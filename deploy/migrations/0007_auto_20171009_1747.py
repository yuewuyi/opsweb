# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-10-09 09:47
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('deploy', '0006_auto_20170912_1203'),
    ]

    operations = [
        migrations.AlterField(
            model_name='saltreturns',
            name='jid',
            field=models.CharField(max_length=191),
        ),
    ]