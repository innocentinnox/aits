"""
    Helper functions for sending notifications and logging
    audit events
"""

from django.core.mail import send_mail
from .models import Notification, AuditLog

def send_notification(recipient, subject, message):
    # Create: Notification record in database
    Notification.objects.create(recipient=recipient, message=message)
    send_email(
        subject,
        message,
        'no-reply@aits.messages.com',
        [recipient.email],
        fail_silently=False,
    )


def log_audit(user, action, description=""):
    AuditLog.objects.create(user=user, action=action, description=description)