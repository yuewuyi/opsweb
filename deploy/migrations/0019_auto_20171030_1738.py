# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-10-30 09:38
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('deploy', '0018_auto_20171030_1712'),
    ]

    operations = [
        migrations.AlterField(
            model_name='hostapplication',
            name='hostId',
            field=models.ForeignKey(db_column='hostId', on_delete=django.db.models.deletion.CASCADE, related_name='+', to='deploy.host'),
        ),
    ]
