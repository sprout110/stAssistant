import pandas as pd
from sites.main.tools.historydata import HistoryData

def sendHistory(stockId):
    pd.set_option('colheader_justify', 'center')   # FOR TABLE <th>
    df=HistoryData(stockId=stockId)
    df.columns=['日期','開盤','最高','最低','收盤','調整','成交量']
    df.set_index('日期', inplace=True)
    
    return f"{df.to_html(classes='table')}"
    