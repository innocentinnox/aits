# Generated by Django 5.1.4 on 2025-04-03 07:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0007_customuser_email_verified'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='unifiedtoken',
            name='is_used',
        ),
    ]
