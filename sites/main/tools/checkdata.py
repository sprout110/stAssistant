import pandas as pd
from model.stockdatamodel import StockDataModel
from lib.updatestockdata import UpdateStockData
import datetime
from conf.settings import *

def CheckData():
    try:
        stockDataModel = StockDataModel(stockId='^TWII')
        updateStockData = UpdateStockData(histStartDate
            ,(datetime.datetime.now() + datetime.timedelta(days=1)).strftime('%Y-%m-%d')
        )

        df = updateStockData.CheckData(stockDataModel)
        
        return df
    except:
        return pd.DataFrame(columns=['Date','Open','High','Low','Close','Adj Close','Volume'])