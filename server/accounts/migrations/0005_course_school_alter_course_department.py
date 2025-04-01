# Generated by Django 5.1.7 on 2025-04-01 13:12

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_customuser_course'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='school',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='courses', to='accounts.school'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='course',
            name='department',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='courses', to='accounts.department'),
        ),
    ]
