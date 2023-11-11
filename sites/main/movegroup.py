from flask import render_template
from model.stockgroupmodel import StockGroupModel

class MoveGroup:
    def __init__(self):   
        self.none = ''
    
    def Base(self, groupId):
        stockGroup = StockGroupModel()
        stocks = stockGroup.GetStocks(groupId)
        return render_template("main/movegroup.html", groupId=groupId, stocks=stocks)
    
    def MyCare(self, groupId):
        stockGroup = StockGroupModel()
        stocks = stockGroup.GetStocks(groupId)
        return render_template("main/movegroup.html", groupId=groupId, stocks=stocks)