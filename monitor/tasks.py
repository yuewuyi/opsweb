from celery import task
from utils.abNormalCheck import abnormalCheck
@task
def abnormalCheckTask():
    ac = abnormalCheck()
    ac.valueCheck()