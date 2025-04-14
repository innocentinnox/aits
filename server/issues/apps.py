from django.apps import AppConfig


class IssuesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'issues'
    
    def ready(self):
        # Import and register signals
        import issues.signals
