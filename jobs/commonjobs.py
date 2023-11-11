import pandas as pd
from conf.settings import appName
from lib.filelib import IsLocal
from lib.writelog import writeLog
import lib.notify as notify
from apscheduler.schedulers.background import BackgroundScheduler
from model.stockdatamodel import StockDataModel
from sites.main.updatehistory import UpdateHistory
from sites.main.sendkchart import sendHighHead, sendLowHead, sendMiddleHead

def Every50MinJobs():
    try:
        writeLog('Info', appName + ' 50分鐘排程開始執行。。。')
    except:
        writeLog('Error', '網路故障或其它原因造成 ' + appName + ' notify 無法傳送')

def CheckTargetPrice(hasNet=True):
    get1, get1Count = sendLowHead(OnlyMessage=True)
    get2, get2Count = sendHighHead(OnlyMessage=True)
    get3, get3Count = sendMiddleHead(OnlyMessage=True)

    if IsLocal():
        print(f'{get1}')
        print(f'{get2}')
        print(f'{get3}')
    else:
        if get1Count > 0:
            notify.sendNotify(f'{get1}')

        if get2Count > 0:
            notify.sendNotify(f'{get2}')

        # if get3Count > 0:
        #     notify.sendNotify(f'{get3}')

        notify.sendNotify('投資一定有風險，有賺有賠，購買股票前，應再詳細評估，以上建議，僅供參考。')

def ScheduleStarted(hasNet=True):
    try:
        if IsLocal():
            writeLog('Info', appName + ' 排程成功啟動!')
        else:
            UpdateHistory()
        # CheckTargetPrice(hasNet)
    except:
        writeLog('Error', '檢查目標價錯誤！')

def myJob():
    Every50MinJobs()

try:
    scheduler = BackgroundScheduler(timezone='Asia/Taipei') 
    scheduler.add_job(func=myJob, trigger='cron', hour= '9-15', minute='*/50')
    scheduler.start()
    ScheduleStarted()
except:
    writeLog('Error', '發生了排程啟動錯誤!')
