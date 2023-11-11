import pandas as pd
from model.stockdatamodel import StockDataModel
from lib.updatestockdata import UpdateStockData
import datetime
from conf.settings import *

def HistoryData(stockId='2412'):
    try:
        stockDataModel = StockDataModel(stockId=stockId)
        updateStockData = UpdateStockData(histStartDate
            ,(datetime.datetime.now() + datetime.timedelta(days=1)).strftime('%Y-%m-%d')
        )

        df = updateStockData.HistoryData(stockDataModel)
        for i in range(0, len(df)):
            # print(round(float(df.iloc[i]['Open']),2))
            df.iloc[i]=[
                df.iloc[i]['Date']
                ,round(float(df.iloc[i]['Open']),2)
                ,round(float(df.iloc[i]['High']),2)
                ,round(float(df.iloc[i]['Low']),2)
                ,round(float(df.iloc[i]['Close']),2)
                ,round(float(df.iloc[i]['Adj Close']),2)
                ,round(float(df.iloc[i]['Volume']),0)]
        # print(df)
        return df
    except:
        return pd.DataFrame(columns=['Date','Open','High','Low','Close','Adj Close','Volume'])
