import pandas as pd
from sites.candle.candlev40 import CandleV40
from model.stockdatamodel import StockDataModel
from lib.notify import notifyMy, notifyHigh, notifyMiddle, notifyLow, sendNotify, notifyMessage, notifyImage
import datetime
from lib.filelib import IsLocal

def getStockAnalysis(stockId='^TWII'):
    df = pd.read_csv(r'stocktargetprice.csv', converters={'stockId': str}, header=0)
    df = df[df['stockId'] == stockId]

    if df.empty == False:
        cheap = float(df.iloc[0]['cheap'])
        expensive = float(df.iloc[0]['expensive'])
        stockData = StockDataModel(df.iloc[0]['stockId'])

        ret = ''
        if float(stockData.GetLastStockClose()) < cheap:
            ret = f'目前{stockData.GetStockName()}在低檔({round(float(stockData.GetLastStockClose()),2)}<{cheap})'
        elif float(stockData.GetLastStockClose()) > expensive:
            ret = f'目前{stockData.GetStockName()}在高檔({round(float(stockData.GetLastStockClose()),2)}>{expensive})'
        else:
            ret = f'{stockData.GetStockName()}在中間({cheap}<{round(float(stockData.GetLastStockClose()),2)}<{expensive})'
    else:
        ret = '沒有設定高低價格！'

    return ret

def getStockPrice(dfStocks):
    get = ''
    for index, stock in dfStocks.iterrows():
        stockData = StockDataModel(stock['stockId'])            
        if stockData.GetLastStockClose() != '':
            get += f'\n[{index+1}]{stock["stockId"]}-{stockData.GetStockName()}: {round(float(stockData.GetLastStockClose()),2)}'
        else:
            print('抓取' + stock["stockId"] + '股價出問題!')

    return get

def getStockPrice2(arrayStocks):
    get = ''
    index = 0

    for stock in arrayStocks:
        index += 1
        stockData = StockDataModel(stock['stockId'])            
        if stockData.GetLastStockClose() != '':
            get += f'\n[{index}]{stock["stockId"]}-{stockData.GetStockName()}: {round(float(stockData.GetLastStockClose()),2)}'
        else:
            print('抓取' + stock["stockId"] + '股價出問題!')

    return get

def sendCandle(stockId, startDate, endDate, index):
    msg = f"k{stockId} {startDate.strftime('%Y-%m-%d')} {endDate.strftime('%Y-%m-%d')}"          
    kchart = CandleV40('webuser', msg)       
    myImg = kchart.Process()
    
    if myImg.msg == "":
        print(f'[{index}]{stockId}-{StockDataModel(stockId).GetStockName()}')
        print(myImg.filename)
        # notifyMy(f'[{index}]{stockId}-{StockDataModel(stockId).GetStockName()}', myImg.filename)
        notifyImage(f'[{index}]{stockId}-{StockDataModel(stockId).GetStockName()}', 
                    myImg.filename,
                    '小助理通知')
    else:
        print(myImg.msg)
        print('error:可能沒有連網！')  

from model.stockgroupmodel import StockGroupModel

def notifyGroup(groupId='my'):
    stockGroup = StockGroupModel()
    stocks = stockGroup.GetStocks(groupId)

    if len(stocks)>0:
        get = f'{getStockAnalysis("^TWII")}；列出觀察名單，請再判讀k線圖，選擇買進or賣出，名單如下：{getStockPrice2(stocks)}'
        
        try:
            notifyMessage(get, '小助理通知')

            startDate = datetime.datetime.today() + datetime.timedelta(days=-130)
            # startDate = datetime.datetime.today() + datetime.timedelta(days=-1500)
            endDate = datetime.datetime.today() + datetime.timedelta(days=1)

            index = 0
            sendCandle('^TWII', startDate, endDate, index)
            
            for stock in stocks:
                index+=1
                sendCandle(stock['stockId'], startDate, endDate, index)         
          
            notifyMessage('投資一定有風險，有賺有賠，購買股票前，應再詳細評估，以上名單，僅供參考，若需新增，可留言告知！', toName='小助理通知')
        except:
            return "通知失敗"
        
        return f"{groupId} 通知成功"
    else:
        return f"{groupId} 通知失敗"

def sendMy(myfilename='mya.csv'):
    get = f'{getStockAnalysis()}；列出觀察名單，請再判讀k線圖，選擇買進or賣出，名單如下：'
    df = pd.read_csv(myfilename,  header=0, converters={'stockId': str})

    getCount = 0

    for stockId in df['stockId']:
        stockData = StockDataModel(stockId)
        
        if stockData.GetLastStockClose() != '':
            getCount+=1
            get += f'\n{stockId}-{stockData.GetStockName()}: {round(float(stockData.GetLastStockClose()),2)}'
        else:
            print('抓取' + stockId + '股價出問題!')
  
    sendNotify(f'{get}', toBean=True)

    y = datetime.date.today().year
    m = datetime.date.today().month
    d = datetime.date.today().day

    startDate = datetime.datetime(y, m, 1) + datetime.timedelta(days=-120)
    endDate = datetime.datetime(y, m, d) + datetime.timedelta(days=1)
    
    try:
        sendmyimg('^TWII', startDate, endDate, 0)
        for index, stock in df.iterrows():
            if str(stock['mark'])=='O':
                sendmyimg(stock['stockId'], startDate, endDate, index+1)
        sendNotify('投資一定有風險，有賺有賠，購買股票前，應再詳細評估，以上名單，僅供參考，若需新增，可留言告知！', toBean=True)          
    except:
        return "通知失敗"

    return "通知成功"

         

def sendHighHead(OnlyMessage = False):
    df = pd.read_csv(r'stocktargetprice.csv', converters={'stockId': str}, header=0)
    get = f'{getStockAnalysis()}；而股價在高檔的股票：'
    
    dfHigh = pd.DataFrame(columns=['stockId'])
    getCount = 0

    for i in range(1, len(df)):
        stockId = df.iloc[i]['stockId']
        targetPrice = float(df.iloc[i]['targetPrice'])
        releasePrice = float(df.iloc[i]['releasePrice'])
        stockData = StockDataModel(stockId)

        if stockData.GetLastStockClose() != '' and float(stockData.GetLastStockClose()) < 50:
            continue

        if releasePrice-targetPrice < 25:
            continue
        
        if stockData.GetLastStockClose() != '':
            if float(stockData.GetLastStockClose()) > releasePrice:
                getCount+=1
                get += f'\n{stockId}-{stockData.GetStockName()}: {round(float(stockData.GetLastStockClose()),2)}'
                dfHigh.loc[len(dfHigh)] = stockId
        else:
            print('抓取' + stockId + '股價出問題!')

    dfHigh.set_index('stockId', inplace=True)
    dfHigh.to_csv('high.csv')

    if OnlyMessage:
        return get, getCount
    else:
        print(f'{get}')
        sendNotify(f'{get}')
        sendNotify('投資一定有風險，有賺有賠，購買股票前，應再詳細評估，以上建議，僅供參考。')

def sendMiddleHead(OnlyMessage = False):
    df = pd.read_csv(r'stocktargetprice.csv', converters={'stockId': str}, header=0)
    get = f'{getStockAnalysis()}；而股價在中間的股票：'
    
    dfMiddle = pd.DataFrame(columns=['stockId'])
    getCount = 0

    for i in range(1, len(df)):
        stockId = df.iloc[i]['stockId']
        targetPrice = float(df.iloc[i]['targetPrice'])
        releasePrice = float(df.iloc[i]['releasePrice'])
        stockData = StockDataModel(stockId)

        if stockData.GetLastStockClose() != '' and float(stockData.GetLastStockClose()) < 50:
            continue

        if releasePrice-targetPrice < 15:
            continue
        
        if stockData.GetLastStockClose() != '':
            if float(stockData.GetLastStockClose()) >= targetPrice and float(stockData.GetLastStockClose()) <= releasePrice:
                getCount+=1
                get += f'\n{stockId}-{stockData.GetStockName()}: {round(float(stockData.GetLastStockClose()),2)}'
                dfMiddle.loc[len(dfMiddle)] = stockId
        else:
            print('抓取' + stockId + '股價出問題!')

    dfMiddle.set_index('stockId', inplace=True)
    dfMiddle.to_csv('middle.csv')

    if OnlyMessage:
        return get, getCount
    else:
        print(f'{get}')
        sendNotify(f'{get}', toBean=True)
        sendNotify('投資一定有風險，有賺有賠，購買股票前，應再詳細評估，以上建議，僅供參考。', toBean=True)

def sendLowHead(OnlyMessage=False):
    df = pd.read_csv(r'stocktargetprice.csv', converters={'stockId': str}, header=0)
    get = f'{getStockAnalysis()}；而股價在低檔的股票：' 
    dfLow = pd.DataFrame(columns=['stockId'])
    getCount = 0

    for i in range(1, len(df)):
        stockId = df.iloc[i]['stockId']
        targetPrice = float(df.iloc[i]['targetPrice'])
        releasePrice = float(df.iloc[i]["releasePrice"])
        stockData = StockDataModel(stockId)

        if targetPrice < 40:
            continue

        if releasePrice-targetPrice < 5:
            continue
 
        if stockData.GetLastStockClose() != '':
            if float(stockData.GetLastStockClose()) < targetPrice:
                getCount+=1
                get += f'\n{stockId}-{stockData.GetStockName()}: {round(float(stockData.GetLastStockClose()),2)}'
                dfLow.loc[len(dfLow)] = stockId
        else:
            print('抓取' + stockId + '股價出問題!')

    dfLow.set_index('stockId', inplace=True)
    dfLow.to_csv('low.csv')

    if OnlyMessage:
        return get, getCount
    else:
        print(f'{get}')
        sendNotify(f'{get}')
        sendNotify('投資一定有風險，有賺有賠，購買股票前，應再詳細評估，以上建議，僅供參考。')
        
def sendHighKChart():
    df = pd.read_csv(r'high.csv',  header=0, converters={'stockId': str})    
    y = datetime.date.today().year
    m = datetime.date.today().month
    d = datetime.date.today().day

    startDate = datetime.datetime(y-1, m, 1)
    endDate = datetime.datetime(y, m, d) + datetime.timedelta(days=1)
    
    index = 0

    for stockId in df['stockId']:
        msg = f"k{stockId} {startDate.strftime('%Y-%m-%d')} {endDate.strftime('%Y-%m-%d')}" 
        kchart = CandleV40('webuser', msg)
        myImg = kchart.Process()
        
        if myImg.msg == "":
            index += 1
            notifyHigh(f'[{index}]{stockId}-{StockDataModel(stockId).GetStockName()}', myImg.filename)
        else:
            print(myImg.msg)
            print('error:可能沒有連網！')

def sendMiddleKChart():
    df = pd.read_csv(r'middle.csv',  header=0, converters={'stockId': str})    
    y = datetime.date.today().year
    m = datetime.date.today().month
    d = datetime.date.today().day

    startDate = datetime.datetime(y-1, m, 1)
    endDate = datetime.datetime(y, m, d) + datetime.timedelta(days=1)
    
    index = 0

    for stockId in df['stockId']:
        msg = f"k{stockId} {startDate.strftime('%Y-%m-%d')} {endDate.strftime('%Y-%m-%d')}" 
        kchart = CandleV40('webuser', msg)
        myImg = kchart.Process()
        
        if myImg.msg == "":
            index += 1
            notifyMiddle(f'[{index}]{stockId}-{StockDataModel(stockId).GetStockName()}', myImg.filename)
        else:
            print(myImg.msg)
            print('error:可能沒有連網！')

def sendLowKChart():
    df = pd.read_csv(r'low.csv',  header=0, converters={'stockId': str})    
    y = datetime.date.today().year
    m = datetime.date.today().month
    d = datetime.date.today().day

    startDate = datetime.datetime(y-1, m, 1)
    endDate = datetime.datetime(y, m, d) + datetime.timedelta(days=1)
    
    index = 0

    for stockId in df['stockId']:
        msg = f"k{stockId} {startDate.strftime('%Y-%m-%d')} {endDate.strftime('%Y-%m-%d')}"
        kchart = CandleV40('webuser', msg)
        myImg = kchart.Process()

        if myImg.msg == "":
            index += 1
            notifyLow(f'[{index}]{stockId}-{StockDataModel(stockId).GetStockName()}', myImg.filename)
        else:
            print(f'error:{myImg.msg}')        

