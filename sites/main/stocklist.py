from flask import Flask, render_template, request, Markup
import pandas as pd
from model.stockdatamodel import StockDataModel
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired
from flask_ckeditor import CKEditor,CKEditorField
import datetime

class PostForm(FlaskForm):
    title = StringField('Title')
    body = CKEditorField('Body', validators=[DataRequired()])
    submit = SubmitField('Submit')

def getStocks(csvFile=''):
    fuchi50 = []
    dfMy = pd.read_csv(csvFile, converters={'stockId': str}, header=0)
    for stockId in dfMy['stockId']:
        fuchi50.append(stockId)

    return fuchi50

def getMyStocks(csvFile=''):
    fuchi50 = []
    dfMy = pd.read_csv(csvFile, converters={'stockId': str}, header=0)
    for index, stock in dfMy.iterrows():
        fuchi50.append([stock['stockId'],stock['mark']])

    return fuchi50

def formateInt(p):
    if p < 10:
        return f'0{p}'
    else:
        return f'{p}'
    
def StockList():
    etf00730stockIds = getStocks('stockETF00730.csv')    
    etf00730Count = len(etf00730stockIds)
    etf00730 = [{'stockId':stockId,'stockName':StockDataModel(stockId).GetStockName()} for stockId in etf00730stockIds] 

    # print(etf00730)
    # print(etf00730Count)

    mycares = getStocks('mycare.csv')
    mycareCount = formateInt(len(mycares))
    mycareName = [{'stockId':mycare,'stockName':StockDataModel(mycare).GetStockName()} for mycare in mycares]

    fuchi50 = getMyStocks('myall.csv')
    fuchiCount = len(fuchi50)
    fuchiName = [{'stockId':fuchi[0],'stockName':StockDataModel(fuchi[0]).GetStockName(), 'mark':fuchi[1]} for fuchi in fuchi50]

    history = getStocks('myhistory.csv')
    historyCount = formateInt(len(history))
    historyName = [{'stockId':stock.strip(),'stockName':StockDataModel(stock).GetStockName()} for stock in history]

    high = getStocks('high.csv')
    highCount = formateInt(len(high))
    highName = [{'stockId':stock.strip(),'stockName':StockDataModel(stock).GetStockName()} for stock in high]

    middle = getStocks('middle.csv')
    middleCount = formateInt(len(middle))
    middleName = [{'stockId':stock.strip(),'stockName':StockDataModel(stock).GetStockName()} for stock in middle]

    candate = getStocks('low.csv')
    candateCount = formateInt(len(high))
    candateName = [{'stockId':stock.strip(),'stockName':StockDataModel(stock).GetStockName()} for stock in candate]

    form = PostForm()

    if form.validate_on_submit():
        title = form.title.data
        body = form.body.data

        df1 = pd.read_csv('./myget.csv')
        get = {
            "Date":[datetime.datetime.strftime(datetime.datetime.today(), '%Y-%m-%d')],
            "Title":[title], 
            "Get":[body]
        }

        # df2 = pd.DataFrame(get) 
        # dff = df1.append(df2, ignore_index = True)
        dff = pd.concat([df1, pd.DataFrame(get)], ignore_index=True)
        dff.to_csv(r'./myget.csv', index = False)

        return render_template('main/post.html', title=title, body=body)
    
    return render_template(
        template_name_or_list = 'main/stocklist.html', 
        appName = '平靜似海',
        etf00730 = etf00730,
        etf00730Count = etf00730Count,
        mycares = mycares,
        mycareCount = mycareCount,
        mycareName = mycareName,
        fuchi50 = fuchi50,
        fuchiCount = fuchiCount,
        fuchiName = fuchiName,
        history = history,
        historyCount = historyCount,
        historyName=historyName,
        candate = candate,
        candateCount = candateCount,
        candateName=candateName,
        middle = middle,
        middleCount = middleCount,
        middleName=middleName,
        high = high,
        highCount = highCount,
        highName = highName,
        form = form
    )
