from celery import task
from utils.zabbix_public_invok import zabbix_data
@task
def abnormalCheck():
    parm={
        "output": "extend",
        "selectHosts":["host","hostid","status"],
        "search": {
            "name":"CPU_util"
        },
    }
    zabbix_data_get = zabbix_data()
    return zabbix_data_get.item_get(parm)