# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-12-21 14:12
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('deploy', '0046_auto_20171219_1805'),
    ]

    operations = [
        migrations.AddField(
            model_name='hostapplication',
            name='jid',
            field=models.CharField(db_index=True, default='', max_length=255),
        ),
        migrations.AddField(
            model_name='hostapplication',
            name='jidState',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='hostapplication',
            name='appPath',
            field=models.CharField(default='', max_length=255),
        ),
    ]
