import os
import sys
import logging
import django
from io import BytesIO
import time

# Set up logging to console
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('test_storage')

# Set up Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main.settings')
django.setup()

# Import the FTPStorage class
from main.storage import FTPStorage

def test_ftp_storage():
    logger.info("Starting FTP storage test")
    
    # Create storage instance (credentials will be loaded from settings)
    storage = FTPStorage()
    logger.info(f"Storage initialized with: host={storage.ftp_host}, port={storage.ftp_port}, base_dir={storage.base_dir}")
    
    # Generate a unique test filename
    timestamp = int(time.time())
    test_filename = f"test_file_{timestamp}.txt"
    test_content = f"This is a test file created at {timestamp}"
    
    logger.info(f"Testing file operations with filename: {test_filename}")
    
    # Test connection by checking if we can connect
    try:
        ftp = storage._connect()
        logger.info("Connection test: SUCCESS - Connected to FTP server")
        ftp.quit()
    except Exception as e:
        logger.error(f"Connection test: FAILED - Could not connect to FTP server: {e}")
        return False
    
    # Test file upload
    try:
        content = BytesIO(test_content.encode('utf-8'))
        saved_name = storage._save(test_filename, content)
        logger.info(f"Upload test: SUCCESS - File uploaded as {saved_name}")
    except Exception as e:
        logger.error(f"Upload test: FAILED - Could not upload file: {e}")
        return False
    
    # Test file exists check
    try:
        time.sleep(1)  # Brief pause to ensure file is available
        if storage.exists(test_filename):
            logger.info("Exists test: SUCCESS - File exists on server")
        else:
            logger.error("Exists test: FAILED - File not found on server")
            return False
    except Exception as e:
        logger.error(f"Exists test: FAILED - Error checking if file exists: {e}")
        return False
    
    # Test URL generation
    try:
        url = storage.url(test_filename)
        logger.info(f"URL test: SUCCESS - Generated URL: {url}")
    except Exception as e:
        logger.error(f"URL test: FAILED - Could not generate URL: {e}")
        return False
    
    # Test file download if _open is implemented
    try:
        file_obj = storage._open(test_filename)
        downloaded_content = file_obj.read().decode('utf-8')
        if downloaded_content == test_content:
            logger.info("Download test: SUCCESS - Downloaded content matches original")
        else:
            logger.error(f"Download test: FAILED - Content mismatch. Expected '{test_content}', got '{downloaded_content}'")
            return False
    except Exception as e:
        logger.error(f"Download test: FAILED - Could not download file: {e}")
        return False
    
    # Test file deletion
    try:
        storage.delete(test_filename)
        logger.info("Delete test: SUCCESS - File deleted from server")
        
        # Verify deletion
        time.sleep(1)  # Brief pause to ensure deletion is processed
        if not storage.exists(test_filename):
            logger.info("Verification: SUCCESS - File no longer exists after deletion")
        else:
            logger.error("Verification: FAILED - File still exists after deletion attempt")
            return False
    except Exception as e:
        logger.error(f"Delete test: FAILED - Could not delete file: {e}")
        return False
    
    logger.info("All tests completed successfully! Your FTP storage is working correctly.")
    return True

if __name__ == "__main__":
    success = test_ftp_storage()
    if success:
        print("\n✅ All tests passed! Your FTP storage implementation is working correctly.")
    else:
        print("\n❌ Some tests failed. Please check the logs above for details.")