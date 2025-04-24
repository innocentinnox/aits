from django.db.models.signals import post_save
from django.contrib.auth import get_user_model
from django.dispatch import receiver
from .models import UnifiedToken
from .utils import mailer, send_verification_email

from issues.models import Issue

import logging
# This logger is used to log messages related to the signals
# It is configured to log messages with a level of WARNING or higher
logger = logging.getLogger(__name__)

User = get_user_model()

@receiver(post_save, sender=UnifiedToken)
def send_email_on_token_creation(sender, instance, created, **kwargs):
    if created:
        send_verification_email(instance.email, instance)
        