from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Issue
from accounts.utils import mailer
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=Issue)
def issue_status_changed(sender, instance, created, **kwargs):
    """
    Signal handler for Issue model changes.
    Sends appropriate emails when an issue's status changes.
    """
    # New issue creation
    if created:
        # Notify student of successful submission
        mailer.send(
            to=instance.created_by.email,
            subject="Issue Submitted Successfully",
            html=f"""
                <h3>Issue has been Submitted Successfully.</h3>
                <p>Your issue '{instance.title}' has been submitted.</p>
                <p><strong>Token:</strong> {instance.token}</p>
                <p><strong>Details:</strong> {instance.description}</p>
                """
        )
        
        # Notify assigned registrar
        if instance.assigned_to and instance.assigned_to.role == 'registrar':
            mailer.send(
                to=instance.assigned_to.email,
                subject="New Issue Assigned",
                html=f"""
                    <h3>There has been a new issue created!</h3>
                    <p>New Issue submitted by '{instance.created_by.username}'.</p>
                    <p><strong>Token:</strong> {instance.token}</p>
                    <p><strong>Title:</strong> {instance.title}</p>
                    """
            )
        return
    
    # Check if status is resolved by registrar
    if instance.status == 'resolved' and instance.assigned_to and instance.assigned_to.role == 'registrar':
        # Notify student when registrar resolves the issue
        try:
            mailer.send(
                to=instance.created_by.email,
                subject="Issue Resolved Successfully!",
                html=f"""
                    <h3>Your Issue has been resolved Successfully</h3>
                    <p>Your issue '{instance.title}' has been resolved by the registrar.</p>
                    <p><strong>Token:</strong> {instance.token}</p>
                    <p><strong>Resolution:</strong> {instance.resolution_details or 'No details provided'}</p>
                    """
            )
            logger.info(f"Email sent to {instance.created_by.email} about resolved issue {instance.token}")
        except Exception as e:
            logger.error(f"Failed to send email notification: {str(e)}")
    
    # Check if status is forwarded
    elif instance.status == 'forwarded' and hasattr(instance, 'forwarded_to') and instance.forwarded_to and instance.forwarded_to.role == 'lecturer':
        # Notify lecturer when issue is forwarded to them
        try:
            mailer.send(
                to=instance.forwarded_to.email,
                subject="Issue Forwarded to You",
                html=f"""
                    <h3>There has been an issue forwarded to you.</h3>
                    <p>Issue '{instance.title}'.</p>
                    <p><strong>Token:</strong> {instance.token}</p>
                    <p><strong>Action:</strong> This has been forwarded to you by the registrar! </p>
                    """
            )
            logger.info(f"Email sent to {instance.forwarded_to.email} about forwarded issue {instance.token}")
        except Exception as e:
            logger.error(f"Failed to send email notification: {str(e)}")
    
    # Check if status is resolved by lecturer
    elif instance.status == 'resolved' and hasattr(instance, 'forwarded_to') and instance.forwarded_to and instance.forwarded_to.role == 'lecturer':
        # Notify student when lecturer resolves the issue
        try:
            mailer.send(
                to=instance.created_by.email,
                subject="Issue Resolved by Lecturer",
                html=f"""
                    <h3>The Lecturer has resolved your issue!</h3>
                    <p>Your Issue with title: '{instance.title}'.</p>
                    <p><strong>Token:</strong> {instance.token}</p>
                    <p><strong>Action:</strong> This issue has been resolved by the Lecturer! </p>
                    <p><strong>Resolution:</strong> {instance.resolution_details or 'No details provided'}</p>
                    """
            )
            logger.info(f"Email sent to {instance.created_by.email} about issue {instance.token} resolved by lecturer")
        except Exception as e:
            logger.error(f"Failed to send email notification: {str(e)}")