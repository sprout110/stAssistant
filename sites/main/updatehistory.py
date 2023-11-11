import pandas as pd
from model.stockdatamodel import StockDataModel
from lib.updatestockdata import UpdateStockData
from lib.updatestockdata import UpdateStock
from conf.settings import *
from lib.writelog import *
import time
import random

def UpdateHistory():
    ### 更新福氣股票 歷史股票股價
    df = pd.read_csv(r'myhistory.csv', converters={'stockId': str}, header=0)
    df.set_index("stockId", inplace=True)

    try:
        for i in range(0, len(df)):
            time.sleep(random.randint(0,1))
            if not UpdateStock(stockId=str(df.iloc[i].name)):
                return "Internal Server Error"

        return "OK"
    except:
        return "Internal Server Error"
    
# UpdateHistory()