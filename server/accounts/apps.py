from django.apps import AppConfig

# This file is part of the Django project.It is a configuration file for the accounts application.
class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        import accounts.signals

# This method is called when the application is ready. It imports the signals module to ensure that the signals are registered when the application starts.
