# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-11-27 17:29
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('deploy', '0038_auto_20171127_1729'),
    ]

    operations = [
        migrations.AddField(
            model_name='taskstate',
            name='end_time',
            field=models.DateTimeField(null=True),
        ),
        migrations.AddField(
            model_name='taskstate',
            name='start_time',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
