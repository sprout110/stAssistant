from flask import render_template
import pandas as pd
from model.stockdatamodel import StockDataModel
from model.stockgroupmodel import StockGroupModel


def StockGroup():
    stockGroup = StockGroupModel()
    groups, groupStocks = stockGroup.GetGroups()    
    groupsCount = len(groups)
    
    return render_template(
        template_name_or_list = 'main/stockgroup.html', 
        appName = '平靜如海',
        groups = groups,
        groupStocks = groupStocks,
        groupsCount = groupsCount
    )
