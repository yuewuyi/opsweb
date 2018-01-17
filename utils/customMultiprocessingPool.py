from multiprocessing import Process,Queue,Manager
import os
import time
import threading
import queue
class cpPoll:
    def __init__(self,process):
        #线程数
        if process is None:
            process = os.cpu_count() or 1
        if process < 1:
            raise ValueError("进程数必须大于或等于1")
        #初始化进程字典
        m = Manager()
        self.__pro_dict=m.dict()
        self.__process=process
        #初始化队列
        self.__task_queue=Queue()
        self.__out_task_queue=Queue()
        self.__pool_list=[]
        #队列是否关闭
        self.__pro_dict['close_state'] = False
        #初始化进程池
        self.__init_pool=threading.Thread(target=self.__init_pool)
        self.__init_pool.daemon=True
        self.__init_pool.start()
        #线程是否全部执行完成
        self.__pool_state=True
    #初始化进程池
    def __init_pool(self):
        for i in range(self.__process):
            self.__pool_list.append(Process(target=worker,args=(self.__task_queue,self.__out_task_queue,self.__pro_dict)))
            self.__pool_list[i].daemon=True
            self.__pool_list[i].start()
    def add_task(self,fun,args):
        if self.__pro_dict['close_state']:
            raise ValueError("进程池已关闭，不能再添加任务")
        else:
            self.__task_queue.put([fun,args])
    def close_pool(self):
        self.__pro_dict['close_state']=True
    def get_task(self):
        if self.__pool_state:
            return self.__out_task_queue.get()
        elif not self.__pool_state and self.__pool_state.empty():
            return "EOF"
        else:
            return self.__out_task_queue.get(2)
    def pool_join(self):
        pool_state=True
        if self.__pro_dict['close_state']:
            while pool_state:
                time.sleep(0.1)
                pool_state = False
                for p in self.__pool_list:
                    if p.is_alive():
                        pool_state=True
            self.__init_pool.join()
            self.__pool_state=False
        else:
            raise ValueError("进程池未关闭,不能阻塞退出")
def worker(inTaskQueue,outTaskQueue,process_dict):
    while not process_dict['close_state']:
        time.sleep(0.01)
        while not inTaskQueue.empty():
            try:
                fun,args=inTaskQueue.get(block=False,timeout=3)
            except queue.Empty:
                break
            try:
                result=fun(*args)
                outTaskQueue.put([True,None,result,fun,args])
            except Exception as e:
                outTaskQueue.put([False,e,None,fun, args])




