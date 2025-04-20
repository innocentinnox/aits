from django.dispatch import Signal

# Define all custom signals here
issue_notification_signal = Signal()
issue_status_changed = Signal()