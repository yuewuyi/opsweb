from multiprocessing import Process,Queue
import os
import time
import threading
class cpPoll:
    def __init__(self,process):
        #线程数
        if process is None:
            process = os.cpu_count() or 1
        if process < 1:
            raise ValueError("进程数必须大于或等于1")
        self.__process=process
        #初始化队列
        self.__task_queue=Queue()
        self.__pool_list=[]
        #队列是否关闭
        self.__task_close=False
        #初始化进程池
        self.__init_pool=threading.Thread(target=self.__init_pool)
        self.__init_pool.daemon=True
        self.__init_pool.start()
    #初始化进程池
    def __init_pool(self):
        for i in range(self.__process):
            self.__pool_list.append(Process(target=worker,args=(self.__task_queue,i)))
            self.__pool_list[i].daemon=True
            self.__pool_list[i].start()
    def add_task(self,task):
        if self.__task_close:
            raise ValueError("进程池已关闭，不能再添加任务")
        else:
            self.__task_queue.put(task)
    def close_pool(self):
        self.__task_close=True

    def pool_join(self):
        join_state = True
        print("开始阻塞主进程")
        if self.__task_close:
            while join_state:
                time.sleep(0.01)
                join_state = False
                for p in self.__pool_list:
                    print("进程%d状态为%s" % (self.__pool_list.index(p), str(p.is_alive())))
                    if p.is_alive():
                        join_state = True
            # for p in self.__pool_list:
            #     print("第%d个进程"%self.__pool_list.index(p))
            #     print(p.is_alive())
            #     p.join(10)
            #     print(p.is_alive())
            print("进程已执行完毕")
            # self.__init_pool.join()
        else:
            raise ValueError("进程池未关闭,不能阻塞退出")
        print("结束阻塞主进程")
def worker(arg,i):
    time.sleep(2)
    while not arg.empty():
        arg.get()


