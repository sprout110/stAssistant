from flask import render_template
import pandas as pd
from model.stockgroupmodel import StockGroupModel


def StockGroup():
    stockGroup = StockGroupModel()
    groups, groupStocks = stockGroup.GetGroups()    
    groupsCount = len(groups)

    myGroup = stockGroup.GetSibling('mya')
    print(myGroup)
    myGroup = [group['groupId'] for group in myGroup]
    print(myGroup)
    baseGroup = stockGroup.GetSibling('up')
    baseGroup = [group['groupId'] for group in baseGroup]
    print(baseGroup)

    return render_template(
        template_name_or_list = 'main/stockgroup.html', 
        appName = '平靜如海',
        groups = groups,
        groupStocks = groupStocks,
        groupsCount = groupsCount,
        myGroup = myGroup,
        baseGroup = baseGroup
    )
