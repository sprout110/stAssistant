from flask import render_template
import pandas as pd

from model.stockgroupmodel import StockGroupModel

class MoveGroup:
    def __init__(self):   
        self.none = ''
    
    def Base(self, groupId):
        stockGroup = StockGroupModel()
        stocks = stockGroup.GetStocks(groupId)
        exchangegroups = stockGroup.GetSibling(groupId)
        return render_template("main/movegroup.html", groupId=groupId, stocks=stocks, exchangegroups=exchangegroups)
    
    def MyCare(self, groupId):
        stockGroup = StockGroupModel()
        stocks = stockGroup.GetStocks(groupId)
        exchangegroups = stockGroup.GetSibling(groupId)
        return render_template("main/movegroup.html", groupId=groupId, stocks=stocks, exchangegroups=exchangegroups)
    
    def Move(self, stockId, fromGroupId, toGroupId):
        if self.addStockId(stockId, toGroupId):
            print("新增成功")
            if self.deleteStockId(stockId, fromGroupId):
               print("刪除成功")
            else:
               print("刪除失敗")
               return "移動失敗"
        else:
            print("新增失敗")
            return "移動失敗"
    
    def addStockId(self, stockId, groupId):
        try:
            stockGroup = StockGroupModel()
            groupFile = stockGroup.GetGroupFile(groupId)
            df = pd.read_csv(groupFile, converters={'stockId': str}, header=0)

            stock = {
                "stockId":[stockId], 
                "mark":["O"]
            }
            
            dfNew = pd.concat([df, pd.DataFrame(stock)], ignore_index=True)
            dfNew = dfNew.drop_duplicates()
            dfNew.set_index('stockId', inplace=True)
            dfNew = dfNew.sort_index()
            dfNew.to_csv(groupFile,encoding='utf-8-sig')

            return True
        except:
            return False


    def deleteStockId(self, stockId, groupId):
        try:
            stockGroup = StockGroupModel()
            groupFile = stockGroup.GetGroupFile(groupId)

            df = pd.read_csv(groupFile, converters={'stockId': str}, header=0)
            if not df[df['stockId'] == stockId].empty:
                df = df.drop(df[df['stockId'] == stockId].index)            
            df = df.drop_duplicates()
            df.set_index('stockId', inplace=True)
            df = df.sort_index()
            df.to_csv(groupFile,encoding='utf-8-sig')

            return True
        except:
            return False
