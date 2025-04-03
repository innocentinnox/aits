from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import UnifiedToken
from .utils import send_verification_email

@receiver(post_save, sender=UnifiedToken)
def send_email_on_token_creation(sender, instance, created, **kwargs):
    if created:
        send_verification_email(instance.email, instance)
        
