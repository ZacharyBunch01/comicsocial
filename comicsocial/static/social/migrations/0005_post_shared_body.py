# Generated by Django 4.1 on 2022-09-13 22:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('social', '0004_files_post_shared_on_post_shared_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='shared_body',
            field=models.TextField(blank=True, null=True),
        ),
    ]
