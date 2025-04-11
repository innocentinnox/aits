from django.apps import AppConfig

# This file is part of the Django project.It is a configuration file for the accounts application.
class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        import accounts.signals
