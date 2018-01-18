from celery import task
from utils.abNormalCheck import abnormalCheck
import multiprocessing
@task
def abnormalCheckTask():
    curr_proc = multiprocessing.current_process()
    curr_proc.daemon = False
    ac = abnormalCheck()
    ac.valueCheck()
    curr_proc.daemon=True
