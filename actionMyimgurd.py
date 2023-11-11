import os
import datetime
from conf import settings
from flask import (Flask, redirect, render_template, request, jsonify, send_from_directory, url_for, Markup)
import pandas as pd
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired
from flask_ckeditor import CKEditorField
import json

from sites.candle.candlev40 import CandleV40
from sites.main.stockinfo import StockInfo
from sites.main.stocklist import StockList
from sites.main.stockgroup import StockGroup
from sites.main.editpost import EditPost
from sites.candle.candle import CandleMain
from sites.candle.candle3 import CandleV30
from sites.main.updatehistory import UpdateHistory 
from lib.updatestockdata import UpdateStock
from model.stockdatamodel import StockDataModel
from sites.main.sendkchart import (sendLowHead, 
                                   sendLowKChart, 
                                   sendMiddleHead, 
                                   sendMiddleKChart, 
                                   sendHighHead, 
                                   sendHighKChart, 
                                   sendMy,
                                   notifyGroup)
from sites.main.senddividend import sendDividend
from sites.main.sendhistory import sendHistory
from sites.main.tools.checkdata import CheckData
from sites.main.tools.historydata import HistoryData
from sites.main.updategroup import updateGroup
from sites.main.movegroup import MoveGroup

class PostForm(FlaskForm):
    title = StringField('Title')
    body = CKEditorField('Body', validators=[DataRequired()])
    submit = SubmitField('Submit')


root_path = ''


def ans():
    stockId = request.form.get('stockId')
    index = int(request.form.get('index'))
    return StockInfo(stockId=stockId, appName='愛你喔!', returnUrl='quiz', index=index, fromUrl='ans')

def ans2():
    queryStockName = request.form.get('queryStockName')
    index = int(request.form.get('index'))
    return StockInfo(queryStockName=queryStockName, appName='愛你喔!2', returnUrl='quiz2', index=index, fromUrl='ans2')

def addPost():
    postDate = datetime.datetime.strftime(datetime.datetime.today(), '%Y-%m-%d')
    return EditPost(postDate)

def addStock():
    logfile = datetime.datetime.now(tz=settings.tzone).strftime('a%Y%m%d.log')
    return send_from_directory('', logfile)


def candle():
    code = request.args.get('code', default=None)
    year = request.args.get('year', default=None)
    return CandleMain(code, True, year=year)

def candleV3():
    stockId = request.args.get('stockId', default=None)
    startDate = request.args.get('startDate', default=None)
    endDate = request.args.get('endDate', default=None)
    return CandleV30(stockId = stockId, startDate=datetime.datetime.strptime(startDate, '%Y-%m-%d'), endDate=datetime.datetime.strptime(endDate, '%Y-%m-%d'))


def ckEditor():
    form = PostForm()
    return render_template('main/ckeditor.html', form=form)

def checkData():
    df = CheckData()

    df.columns=['開盤','最高','最低','收盤','調整','成交量']
    if df.empty == True:
        return "檢查失敗"
    return f"{df.to_html(classes='table')}"

def clearpng():
    return "開發中。。。"

def descript():
    code = request.args.get('code', default=None)
    df = pd.read_csv(r'stockbase.csv',  header=0, converters={'stockId': str})

    if df.shape[0]==0 or df[df['stockId']==code].empty:
        return "查無資料"
    else:
        return str(df[df['stockId'] == code].iloc[0]['description'])

def dividend():
    code = request.args.get('code', default=None)
    return sendDividend(code)

def editPost():
    postDate = request.args.get('Date', default=None)
    return EditPost(postDate)

def favicon():
    return send_from_directory(os.path.join(root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')

def getdividend():
    stockId = request.args.get('stockId')
    
    if stockId:
        stockData = StockDataModel(stockId)
        stockData.GetGoodInfoDividend()
        return "OK"
    else:
        return redirect(url_for('stockgroup'))

def getkchart():
    postValues = request.get_json()
    stockId = postValues['stockId']
    startDate = postValues['startDate']
    endDate = postValues['endDate']

    msg = f'k{stockId} {startDate} {endDate}'
    kchart = CandleV40('webuser', msg)
    myImg = kchart.Process()

    result = {
        "link": myImg.link,
        "msg": myImg.msg
    }

    return jsonify(result)

def hello():
   name = request.form.get('name')

   if name:
       return render_template('main/hello.html', name = name)
   else:
       return redirect(url_for('index'))

def historyData(stockId=''):
    stockId = request.args.get('stockId', default=None)
    return sendHistory(stockId)


def init_rootPath(app):
    root_path = app.root_path

def index():
   return render_template('main/index.html')

def mytest(mykey):
   return mykey

def movegroupbase():
    groupId = request.args.get('groupId', default=None)
    moveGroup = MoveGroup()
    return moveGroup.Base(groupId)

def movegroupmycare():
    groupId = request.args.get('groupId', default=None)
    moveGroup = MoveGroup()

    return moveGroup.MyCare(groupId)

def notifyLow():
    try:
        sendLowHead()
        sendLowKChart()
        return "OK"
    except:
        print('error:可能沒有連網！')
        return "Not OK"

def notifyHigh():
    try:
        sendHighHead()
        sendHighKChart()
        return "OK"
    except:
        print('error:可能沒有連網！')
        return "Not OK"


def notifyMiddle():
    try:
        sendMiddleKChart()
        return "OK"
    except:
        print('error:可能沒有連網！')
        return "Not OK"
    
def notifyMya():
    return sendMy('mya.csv')

def notifyMyb():
    return sendMy('myb.csv')

def notifyMyc():
    return sendMy('myc.csv')


def notifygroup():
    groupId = request.args.get('groupId', default=None)
    return notifyGroup(groupId=groupId)

def png(filename):
    return send_from_directory(os.path.join(root_path, ''), f'{filename}.png')

def posts():
    try:
        df = pd.read_csv(r'myget.csv',  header=0, index_col=0)
    except:
        print('謮取myget.csv失敗')

    posts = ''
    for i in range(0, len(df)):
        posts += f'<p>{df.iloc[i].name} {df.iloc[i]["Title"]}</p>'
        posts += df.iloc[i]['Get']
       
    return render_template('main/posts.html', posts=Markup(posts))

def postList():
    
    posts = ''

    try:
        if os.path.isfile('myget.csv'):
            df = pd.read_csv(r'myget.csv',  header=0, index_col=0)
        else:
            df = pd.DataFrame(columns=['Date','Title','Get'])
            posts = '尚無資料！'       
    except:
        print('謮取myget.csv失敗')

    
    
    for i in range(len(df)-1,-1,-1):
        
        posts += f'<p><a href="editpost?Date={df.iloc[i].name}" target="_child">{df.iloc[i].name} {df.iloc[i]["Title"]}</a></p>'
        posts += df.iloc[i]['Get']

    return render_template('main/postlist.html', 
                           posts=Markup(posts),
                           appName="靜心述事")

def quiz():
   return render_template('main/p0quiz.html', appName='小包的家')

def quiz2():
   return render_template('main/p0quiz2.html', appName='小包第2個家')

def stocklist():
    return StockList()

def stockgroup():
    return StockGroup()

def updateallstocks():
    return "開發中。。。"

def updatehistory():
    return UpdateHistory()

def updatestock():
    if request.method == 'POST':
        if request.form.get('fromForm'):
            stockId = request.form.get('stockId')
            if UpdateStock(stockId):
                return render_template('main/getdata.html', appName='更新成功', msg='更新成功')
            else:
                return "Not OK"
        else:
            postValues = request.get_json()
            try:
                stockId = postValues['stockId']
                if UpdateStock(stockId):
                    return json.dumps(f"{stockId} OK")
                else:
                    return json.dumps(f"Server Error!")
            except:
                return json.dumps("Server Error!")
            
    return render_template('main/getdata.html', appName='更新資料', msg='')        

def updategroup():
    groupId = request.args.get('groupId', default=None)
    return updateGroup(groupId=groupId)
