# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-11-24 08:31
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('deploy', '0031_auto_20171120_1651'),
    ]

    operations = [
        migrations.AddField(
            model_name='taskstate',
            name='cmd_type',
            field=models.IntegerField(default=None),
        ),
        migrations.AlterField(
            model_name='taskstate',
            name='status',
            field=models.IntegerField(default=None),
        ),
    ]
