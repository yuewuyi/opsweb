# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-09-12 04:03
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('deploy', '0005_auto_20170912_1202'),
    ]

    operations = [
        migrations.AlterField(
            model_name='host',
            name='isSaltStack',
            field=models.SmallIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='host',
            name='status',
            field=models.SmallIntegerField(default=0),
        ),
    ]