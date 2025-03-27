"""
    Helper functions for sending notifications and logging
    audit events
"""

# from django.core.mail import send_mail
from .models import Notification, AuditLog
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from django.conf import settings

    
class Mail:
    def __init__(self, host, port, user, password):
        self.host = host
        self.port = port
        self.user = user
        self.password = password

    def send(self, to, subject, html):
        try:
            # Create the email message
            msg = MIMEMultipart()
            app_name = getattr(settings, 'APP_NAME', '')
            msg['From'] = f"{app_name} <{self.user}>"
            msg['To'] = to
            msg['Subject'] = subject
            msg.attach(MIMEText(html, 'html'))
            
            # Connect to SMTP server
            if self.port == 465:
                # For port 465, use SMTP_SSL
                server = smtplib.SMTP_SSL(self.host, self.port)
            else:
                # Otherwise, connect normally and start TLS
                server = smtplib.SMTP(self.host, self.port)
                server.starttls()

            server.login(self.user, self.password)
            server.sendmail(self.user, to, msg.as_string())
            server.quit()
            return "Email sent successfully"
        except Exception as e:
            logging.error("SMTP_MAIL_ERROR: %s", e)
            return "Something went wrong"
        
mailer = Mail(
        host=settings.EMAIL_HOST,
        port=settings.EMAIL_PORT,
        user=settings.EMAIL_HOST_USER,
        password=settings.EMAIL_HOST_PASSWORD
)






def log_audit(user, action, description=""):
    AuditLog.objects.create(user=user, action=action, description=description)