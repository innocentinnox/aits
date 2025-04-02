"""
    Helper functions for sending notifications and logging
    audit events
"""

# from django.core.mail import send_mail
from .models import Notification, AuditLog
import smtplib
import logging
import random
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from django.conf import settings
from django.core.mail import send_mail

from twilio.rest import Client

    
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

def send_notification(recipient, subject, message):
    # Create a notification object in the database
    Notification.objects.create(recipient=recipient, subject=subject, message=message)


def log_audit(user, action, description=""):
    AuditLog.objects.create(user=user, action=action, description=description)

def send_sms_notification(user, message):
    Client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    try:
        # Send the SMS using Twilio
        Client.messages.create(
            body=message,
            from_=settings.TWILIO_PHONE_NUMBER,
            to=user.phone_number  # Assuming user has a phone_number field
        )
    except Exception as e:
        logging.error("SMS_NOTIFICATION_ERROR: %s", e)

# Generate a random 6-digit numeric code as a string
def generate_6_digit_code():
    return f"{random.randint(0, 999999):06d}"  


def send_verification_email(user_email, token_instance, issue_title=None, issue_description=None):
    #Send an email containing the 6-digit code for verification.
    #The email content can be customized based on context (signup or password reset).
    
    result = mailer.send(
            to=user_email,
            subject="Email Verification" if token_instance.token_type == "email_verification" else "Password Reset",
            html=f"""
                <h3>{subject}</h3>
                <p>Your verification code is: <strong>{token_instance.code}</strong></p>
            """
        )
    if result:
        return Response({"message": result}, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    
    
    
    
    
    #subject = "Email Verification" if token_instance.token_type == "email_verification" else "Password Reset"
    #html_content = f"""
                #<h3> {subject} </h3>
                #<p>Your verification code is: <strong>{token_instance.code}</strong></p>
    #"""
    
    # Optionally, include issue details if provided
    #if issue_title and issue_description:
        #html_content += f"""
                    #<p>Your issue '{issue_title}' has been submitted.</p>
                    #<p><strong>Token:</strong> {token_instance.id}</p>
                    #<p><strong>Details:</strong> {issue_description}</p>
        #"""
    #send_mail(
        #subject,
        #'',  # Plain text version (can be left blank)
        # settings.DEFAULT_FROM_EMAIL,
        #[user_email],
        #html_message=html_content,
        #fail_silently=False,
    #)
