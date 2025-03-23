import os
import logging
import traceback
from ftplib import FTP, error_perm
from django.conf import settings
from django.core.files.storage import Storage
from django.utils.deconstruct import deconstructible
from io import BytesIO

logger = logging.getLogger(__name__)

@deconstructible
class FTPStorage(Storage):
    """
    A simple FTP storage backend with logging for debugging.
    """

    def __init__(self, ftp_host=None, ftp_user=None, ftp_password=None, ftp_port=None, base_dir=None, base_url=None):
        self.ftp_host = ftp_host or settings.FTP_STORAGE_HOST
        self.ftp_user = ftp_user or settings.FTP_STORAGE_USER
        self.ftp_password = ftp_password or settings.FTP_STORAGE_PASSWORD
        self.ftp_port = ftp_port or settings.FTP_STORAGE_PORT
        self.base_dir = base_dir or settings.FTP_STORAGE_BASE_DIR  # e.g. 'media'
        self.base_url = base_url or settings.FTP_STORAGE_BASE_URL  # e.g. '/media/'
        logger.debug(f"FTPStorage initialized with host={self.ftp_host}, port={self.ftp_port}, base_dir={self.base_dir}")

    def _connect(self):
        logger.debug("Connecting to FTP server...")
        ftp = FTP()
        try:
            ftp.connect(self.ftp_host, self.ftp_port)
            ftp.login(self.ftp_user, self.ftp_password)
            logger.debug("Successfully connected and logged in to FTP server.")
        except Exception as e:
            logger.error(f"FTP connection/login failed: {e}")
            logger.error(traceback.format_exc())
            raise
        return ftp

    def _full_path(self, name):
        # Make sure the path is relative to base_dir
        full_path = os.path.join(self.base_dir, name)
        # Always use forward slashes for FTP paths
        full_path = full_path.replace('\\', '/')
        logger.debug(f"Computed full path for '{name}': {full_path}")
        return full_path

    def _mkdirs(self, ftp, path):
        # Save current directory
        current_dir = ftp.pwd()
        logger.debug(f"Creating directories recursively for path: {path}")
        
        # Go to root directory or base directory first
        try:
            ftp.cwd("/")  # Start from root
        except error_perm as e:
            logger.error(f"Could not change to root directory: {e}")
        
        # If base_dir is defined, try to navigate to it first
        if self.base_dir:
            for part in self.base_dir.split('/'):
                if part:
                    try:
                        ftp.cwd(part)
                    except error_perm:
                        try:
                            ftp.mkd(part)
                            ftp.cwd(part)
                        except error_perm as e:
                            logger.error(f"Could not create base directory part '{part}': {e}")
        
        # Now create the path for this specific file
        path_parts = path.replace(self.base_dir, '').strip('/').split('/')
        for part in path_parts:
            if part:
                try:
                    ftp.cwd(part)
                except error_perm:
                    try:
                        ftp.mkd(part)
                        ftp.cwd(part)
                    except error_perm as e:
                        logger.error(f"Could not create directory part '{part}': {e}")
        
        # Go back to original directory
        try:
            ftp.cwd(current_dir)
        except error_perm:
            logger.warning(f"Could not return to original directory {current_dir}")

    def _save(self, name, content):
        logger.debug(f"Saving file '{name}' to FTP storage...")
        ftp = self._connect()
        full_path = self._full_path(name)
        dirname, filename = os.path.split(full_path)
        logger.debug(f"Directory: {dirname}, Filename: {filename}")
        
        # Ensure the directory exists on FTP
        try:
            ftp.cwd(dirname)
            logger.debug(f"Changed directory to: {dirname}")
        except error_perm:
            logger.debug(f"Directory {dirname} does not exist; attempting to create it.")
            self._mkdirs(ftp, dirname)
            try:
                ftp.cwd(dirname)
                logger.debug(f"Successfully changed to directory: {dirname}")
            except error_perm as e:
                logger.error(f"Failed to change to directory {dirname} after creation: {e}")
        
        try:
            # Handle different content types
            if hasattr(content, 'file'):
                logger.debug("Using content.file for upload")
                ftp.storbinary(f"STOR {filename}", content.file)
            else:
                # Read content as bytes and wrap it in a BytesIO
                logger.debug("Using content.read() for upload")
                file_content = content.read()
                if isinstance(file_content, str):
                    file_content = file_content.encode('utf-8')
                byte_stream = BytesIO(file_content)
                ftp.storbinary(f"STOR {filename}", byte_stream)
                
            logger.debug(f"File '{filename}' uploaded successfully.")
        except Exception as e:
            logger.error(f"Failed to upload file '{filename}': {e}")
            logger.error(traceback.format_exc())
            raise
        finally:
            ftp.quit()
            logger.debug("FTP connection closed.")
        return name

    def exists(self, name):
        logger.debug(f"Checking if file '{name}' exists in FTP storage...")
        ftp = self._connect()
        full_path = self._full_path(name)
        dirname, filename = os.path.split(full_path)
        try:
            ftp.cwd(dirname)
            logger.debug(f"Changed directory to: {dirname}")
            file_list = ftp.nlst()  # list files in the current directory
            logger.debug(f"Files in directory: {file_list}")
            exists = filename in file_list
            logger.debug(f"File '{filename}' exists: {exists}")
        except Exception as e:
            logger.error(f"Error checking existence of file '{name}': {e}")
            logger.error(traceback.format_exc())
            exists = False
        finally:
            ftp.quit()
        return exists

    def url(self, name):
        # Return the base URL combined with the file name.
        url = os.path.join(self.base_url, name).replace('\\', '/')
        logger.debug(f"Generated URL for '{name}': {url}")
        return url

    def _open(self, name, mode='rb'):
        logger.debug(f"Attempting to open file '{name}' from FTP storage...")
        ftp = self._connect()
        full_path = self._full_path(name)
        
        # Fix the path separators for FTP (use forward slashes)
        full_path = full_path.replace('\\', '/')
        logger.debug(f"Using normalized path for retrieval: {full_path}")
        
        buffer = BytesIO()
        try:
            # First try to navigate to the directory and retrieve just the filename
            dirname, filename = os.path.split(full_path)
            dirname = dirname.replace('\\', '/')
            
            try:
                ftp.cwd(dirname)
                logger.debug(f"Changed directory to: {dirname}")
                ftp.retrbinary(f"RETR {filename}", buffer.write)
            except Exception as e:
                logger.debug(f"Directory navigation failed, trying direct retrieval: {e}")
                # Fall back to direct retrieval if directory navigation fails
                ftp.retrbinary(f"RETR {full_path}", buffer.write)
                
            logger.debug(f"Successfully retrieved file '{name}' from FTP")
        except Exception as e:
            logger.error(f"Failed to retrieve file '{name}' from FTP: {e}")
            logger.error(traceback.format_exc())
            raise
        finally:
            ftp.quit()
        
        # Reset buffer position to the beginning
        buffer.seek(0)
        return buffer

        logger.debug(f"Attempting to open file '{name}' from FTP storage...")
        ftp = self._connect()
        full_path = self._full_path(name)
        
        buffer = BytesIO()
        try:
            ftp.retrbinary(f"RETR {full_path}", buffer.write)
            logger.debug(f"Successfully retrieved file '{name}' from FTP")
        except Exception as e:
            logger.error(f"Failed to retrieve file '{name}' from FTP: {e}")
            logger.error(traceback.format_exc())
            raise
        finally:
            ftp.quit()
        
        # Reset buffer position to the beginning
        buffer.seek(0)
        return buffer

    def delete(self, name):
        logger.debug(f"Attempting to delete file '{name}' from FTP storage...")
        ftp = self._connect()
        full_path = self._full_path(name)
        
        # Fix the path separators for FTP (use forward slashes)
        full_path = full_path.replace('\\', '/')
        logger.debug(f"Using normalized path for deletion: {full_path}")
        
        try:
            # Try both approaches - direct delete and directory navigation
            try:
                dirname, filename = os.path.split(full_path)
                dirname = dirname.replace('\\', '/')
                
                ftp.cwd(dirname)
                logger.debug(f"Changed directory to: {dirname}")
                ftp.delete(filename)
            except Exception as e:
                logger.debug(f"Directory navigation failed, trying direct deletion: {e}")
                # Fall back to direct deletion
                ftp.delete(full_path)
                
            logger.debug(f"Successfully deleted file '{name}' from FTP")
        except Exception as e:
            logger.error(f"Failed to delete file '{name}' from FTP: {e}")
            logger.error(traceback.format_exc())
        finally:
            ftp.quit()
            logger.debug(f"Attempting to delete file '{name}' from FTP storage...")
            ftp = self._connect()
            full_path = self._full_path(name)
            
            try:
                ftp.delete(full_path)
                logger.debug(f"Successfully deleted file '{name}' from FTP")
            except Exception as e:
                logger.error(f"Failed to delete file '{name}' from FTP: {e}")
                logger.error(traceback.format_exc())
            finally:
                ftp.quit()