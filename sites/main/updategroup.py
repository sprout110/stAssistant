import pandas as pd
import time
import random
from lib.updatestockdata import UpdateStock
from model.stockgroupmodel import StockGroupModel

def updateGroup(groupId='my'):
    stockGroup = StockGroupModel()
    stocks = stockGroup.GetStocks(groupId)

    try:
        if not UpdateStock(stockId='^TWII'):
            return "更新失敗"
        for stock in stocks:
            time.sleep(random.randint(0,1))
            if not UpdateStock(stockId=stock['stockId']):
                return "更新失敗"

        return "更新成功"
    except:
        return "更新失敗"

    