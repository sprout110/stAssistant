from flask import Flask, render_template, request, Markup
import model.getdata as getdata
import pandas as pd

def StockInfo(stockId='', queryStockName='', appName='', returnUrl='', index=-1, fromUrl=''):
    if stockId != '':
        data = getdata.getStockInfo(stockId=stockId)
    elif queryStockName !='':
        data = getdata.getStockInfo(stockName=queryStockName)
    else:
        data = pd.DataFrame()

    if data.empty:
        log = '今天還沒有任何執行記錄。'
        return render_template('main/p0ans.html', 
                           name = '親愛的', 
                           stockId = '  ', 
                           stockName = '  ',
                           stockClass = '  ',
                           type = '  ',
                           appName=appName,
                           returnUrl=returnUrl,
                           fromUrl=fromUrl,
                           queryStockName=queryStockName,
                           index=-1)
    else:
        # print(f'index:{index}')
        index += 1
        row = data.iloc[index]
        # print(row)
        stock = row['stockId']
        stockName = row['stockName']
        stockClass = row['industryCategory']
        type = row['type']
        appName = f'{appName} - {stockName}{stock}'
        # print(len(data))
        if len(data)-1<=index:
            index = -1
        # print(f'index:{index}')
        return render_template('main/p0ans.html', 
                           name = '親愛的', 
                           stockId = stock, 
                           stockName = stockName,
                           stockClass = stockClass,
                           type = type,
                           appName=appName,
                           returnUrl=returnUrl,
                           fromUrl=fromUrl,
                           queryStockName=queryStockName,
                           index = index)