from utils.zabbix_public_invok import zabbix_data
from utils.clusterKmease import cluster
from multiprocessing.dummy import Pool
import time
from monitor.models import abnormal_value
class abnormalCheck():
    __queryItem = ["CPU_util", 'disk_read_Bps', 'disk_write_Bps', 'vailable_memory']
    def __init__(self):
        self.__zabbix_data_get = zabbix_data()
    def valueCheck(self):
        s=int(time.time())
        itemdata = []
        for item in self.__queryItem:
            parm = {
                "output": ['name', 'itemid', 'lastvalue', 'lastclock', 'units', 'value_type'],
                "selectHosts": ["host", "status"],
                "search": {
                    "name": item,
                },
            }
            zabbix_data_get = zabbix_data()
            itemdata += zabbix_data_get.item_get(parm)
        a = Pool(processes=10)
        for item in itemdata:
            a.apply_async(func=historyGet,args=(item,))
        a.close()
        a.join()
        print("join完成")
        print("总共耗时%s"%str(int(time.time())-s))
def historyGet(item):
    zabbix_data_get = zabbix_data()
    now_time = int(time.time())
    if item['hosts'][0]['status'] == "0" and (int(item['lastclock']) + 180) >= now_time:
        lastValue=float(item['lastvalue'])
        history_parm = {
            "output": "extend",
            "history": int(item['value_type']),
            "itemids": item['itemid'],
            "time_from": int(item['lastclock']) - 3700,
            "time_till": int(item['lastclock']) - 10,
            "sortfield": "clock",
            "sortorder": "ACS",
        }
        result = zabbix_data_get.item_history_get(history_parm)
        valueList=[float(x['value']) for x in result]
        valueList.append(lastValue)
        cluKmes=cluster(valueList)
        clusterAssment=cluKmes.calcCluster().getA()
        index=clusterAssment[-1][0]
        indexCount=0
        for item in clusterAssment:
            if item[0]==index:
                indexCount+=1
        if indexCount == 1:
            abnormal_value.objects.create(
                itemid=int(item['itemid']),
                timestampunix=int(item['lastclock']),
                hostName=item['hosts'][0]['host'],
                unit=item['units'],
                value=float(item['value']),
                valueType=int(item['valuetype']),
                itemName=item['name']
            )

