# Generated by Django 5.1.7 on 2025-03-16 15:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('issues', '0004_remove_issue_attachment_issue_attachments'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='issue',
            name='resolved_at',
        ),
    ]
