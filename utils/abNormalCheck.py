from utils.zabbix_public_invok import zabbix_data
from utils.clusterKmease import cluster
from utils.config import app_config
from utils.customMultiprocessingPool import cpPoll
import time
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
        a = cpPoll(process=20)
        for item in itemdata:
            a.add_task(fun=historyGet,args=(item,))
        a.close_pool()
        a.pool_join()
        print("join完成")
        # while True:
        #     result=a.get_task()
        #     if result=='EOF':
        #         break
        #     elif not result[0]:
        #         print(result)
        print("总共耗时%s"%str(int(time.time())-s))
def historyGet(item):
    return  [0,12,3,4]
    # zabbix_data_get = zabbix_data()
    # now_time = int(time.time())
    # if item['hosts'][0]['status'] == "0" and (int(item['lastclock']) + 180) >= now_time:
    #     history_parm = {
    #         "output": "extend",
    #         "history": int(item['value_type']),
    #         "itemids": item['itemid'],
    #         "time_from": int(item['lastclock']) - 3700,
    #         "time_till": int(item['lastclock']) - 10,
    #         "sortfield": "clock",
    #         "sortorder": "ACS",
    #     }
    #     result = zabbix_data_get.item_history_get(history_parm)
    #     return result
def poolErrorCallback(this):
    print(this)