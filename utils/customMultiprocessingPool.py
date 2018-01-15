import multiprocessing
import os
import time
import queue
import threading
class cpPoll:
    def __init__(self,process):
        #线程数
        if process is None:
            process = os.cpu_count() or 1
        if process < 1:
            raise ValueError("进程数必须大于或等于1")
        #初始化队列
        self.__task_queue=queue.Queue()
        #队列是否关闭
        self.__task_close=False
    def __woekr_handle(self):



