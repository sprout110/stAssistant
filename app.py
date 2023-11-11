from flask import (Flask)
from flask_cors import CORS
import jobs.commonjobs
from model.stockdatamodel import StockDataModel
from model.stockgroupmodel import StockGroupModel
from flask_ckeditor import CKEditor

from actionMyimgurd import *

app = Flask(__name__)
app.secret_key = 'secret string'

ckeditor = CKEditor(app)

CORS(app)
init_rootPath(app)

app.add_url_rule('/', '', index)
app.add_url_rule('/<path:filename>', '/', png)
app.add_url_rule('/addpost', 'addpost', addPost, methods=['GET', 'POST'])
app.add_url_rule('/ans', 'ans', ans, methods=['POST'])
app.add_url_rule('/ans2', 'ans2', ans2, methods=['POST'])
app.add_url_rule('/candle', 'candle', candle)
app.add_url_rule('/candleV3', 'candleV3', candleV3)
app.add_url_rule('/checkonlinedata','checkonlinedata', checkData)
app.add_url_rule('/ckeditor', 'ckeditor', ckEditor)
app.add_url_rule('/clearpng', 'clearpng', clearpng)
app.add_url_rule('/favicon.ico', 'favicon.ico', favicon)
app.add_url_rule('/description', 'description', descript)
app.add_url_rule('/dividend', 'dividend', dividend)
app.add_url_rule('/editpost', 'editpost', editPost, methods=['GET','POST'])

@app.route("/editbase", methods=['GET','POST'])
def editbase():

   if request.method == "GET":

      stockId = request.args.get('stockId', default=None)
      groupId = request.args.get('groupId', default=None)
   
      return render_template("main/editbase.html", stockId=stockId, groupId=groupId)
   
   elif request.method == "POST":
      
      stockId = request.form["stockId"]
      fromGroupId = request.form["fromGroupId"]
      toGroupId = request.form["toGroupId"]
      
      print(stockId, fromGroupId, toGroupId)

      if fromGroupId != toGroupId:
         if addStockId(stockId, toGroupId):
            print("新增成功")
            if deleteStockId(stockId, fromGroupId):
               print("刪除成功")
            else:
               print("刪除失敗")
               return "移動失敗"
         else:
            print("新增失敗")
            return "移動失敗"

      return StockGroup()
   
@app.route("/editmycare", methods=['GET','POST'])
def editmycare():

   if request.method == "GET":

      stockId = request.args.get('stockId', default=None)
      groupId = request.args.get('groupId', default=None)
   
      return render_template("main/editmycare.html", stockId=stockId, groupId=groupId)
   
   elif request.method == "POST":
      
      stockId = request.form["stockId"]
      fromGroupId = request.form["fromGroupId"]
      toGroupId = request.form["toGroupId"]

      

      if fromGroupId != toGroupId:
         if addStockId(stockId, toGroupId):
            print("新增成功")
            if deleteStockId(stockId, fromGroupId):
               print("刪除成功")
            else:
               print("刪除失敗")
               return "移動失敗"
         else:
            print("新增失敗")
            return "移動失敗"

      return StockGroup()        



def addStockId(stockId, groupId):
   try:
      stockGroup = StockGroupModel()
      groupFile = stockGroup.GetGroupFile(groupId)
      df = pd.read_csv(groupFile, converters={'stockId': str}, header=0)

      stock = {
         "stockId":[stockId], 
         "mark":["O"]
      }
      
      df2 = pd.DataFrame(stock)
      df3 = pd.concat([df, df2], ignore_index=True)
      print(df3)
      df3 = df3.drop_duplicates()
      print(df3)
      df3.set_index('stockId', inplace=True)
      df3 = df3.sort_index()
      
      df3.to_csv(groupFile,encoding='utf-8-sig')
      return True
   except:
      return False


def deleteStockId(stockId, groupId):
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

app.add_url_rule('/getdividend', 'getdividend', getdividend, methods=['GET'])
app.add_url_rule('/getkchart', 'getkchart', getkchart, methods=['POST'])
app.add_url_rule('/hello', 'hello', hello, methods=['POST'])
app.add_url_rule('/historydata','historydata', historyData)
app.add_url_rule('/index', 'index', index)
app.add_url_rule('/movegroupbase', 'movegroupbase', movegroupbase)
app.add_url_rule('/movegroupmycare', 'movegroupmycare', movegroupmycare)
app.add_url_rule('/notifylow', 'notifylow', notifyLow)
app.add_url_rule('/notifymiddle', 'notifymiddle', notifyMiddle)
app.add_url_rule('/notifyhigh', 'notifyhigh', notifyHigh)
app.add_url_rule('/notifymya', 'notifymya', notifyMya)
app.add_url_rule('/notifymyb', 'notifymyb', notifyMyb)
app.add_url_rule('/notifymyc', 'notifymyc', notifyMyc)
app.add_url_rule('/notifygroup', 'notifygroup', notifygroup)
app.add_url_rule('/postlist', 'postlist', postList)
app.add_url_rule('/posts', 'posts', posts)
app.add_url_rule('/quiz', 'quiz', quiz)
app.add_url_rule('/quiz2', 'quiz2', quiz2)
app.add_url_rule('/showlog', 'showlog', addStock)
app.add_url_rule('/stocklist', 'stocklist', stocklist, methods=['GET', 'POST'])
app.add_url_rule('/stockgroup', 'stockgroup', stockgroup, methods=['GET', 'POST'])
app.add_url_rule('/test/<path:mykey>', '/test', mytest)
app.add_url_rule('/updateallstocks','updateallstocks', updateallstocks)
app.add_url_rule('/updatehistory', 'updatehistory', updatehistory)
app.add_url_rule('/updategroup', 'updategroup', updategroup)
app.add_url_rule('/updatestock', 'updatestock', updatestock, methods=['GET','POST'])

if __name__ == '__main__':
   app.run()
