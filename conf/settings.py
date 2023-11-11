from lib.filelib import IsLocal
import datetime

appName = '台股小助理'
IMGUR_CLIENT_ID = 'd82208d3c8f4f9c'
DBName = 'howard-good31'
ClectionName = 'mystock'
OnPrice = 'onprice'
Favorite = 'mytetffavorite'
MyStocks = 'mystocks'
histStartDate = '1900-01-01'
histMiddleDate = '2012-01-01'
histEndDate = '2023-06-02'
stockClass = ''
defaultStock = '2412'

defaultFavorite = [{
    'stock' : '0050',
    'stockName' : '台灣50'
}, {
    'stock' : '2412',
    'stockName' : '中華電'
}, {
    'stock' : '1737',
    'stockName' : '臺鹽'
}, {
    'stock' : '1216',
    'stockName' : '統一'
}, {
    'stock' : '2891',
    'stockName' : '中信金'
}, {
    'stock' : '2812',
    'stockName' : '台中銀'
}, {
    'stock' : '0056',
    'stockName' : '元大高股息'
}, {
    'stock' : '00713',
    'stockName' : '元大台灣高息低波'
}, {
    'stock' : '00731',
    'stockName' : 'FH富時高息低波'
}, {
    'stock' : '00878',
    'stockName' : '國泰永續高股息'
}]


tzone = datetime.timezone(datetime.timedelta(hours=8))
stocklistfile = 'stocklist20230403.csv'
stockdividendfile = 'stockdividend20230420.csv'

# LINE Notify 權杖
# notifyToken = 'bIBelZ9Cjev7JNbXcls7H0hHd8lf91WuIHMIB5h88t3'
# notifyToken = 'bMSsFQ32jUEcVzG70UGGWCeGfKeGLBfglGPc9B63oqt'

stocklistfile = 'stocklist20230403.csv'
stockdividendfile = 'stockdividend20230420.csv'

if IsLocal():
    # ETF小助理
    LINE_CHANNEL_ACCESS_TOKEN = 'FwwOtveP0V7ettA3lfMUosGjAgWsvsZ9plskd9pw9AhmSnBEqVhJ8pO5NN/qTF1a0uvZgbgJ5p4Sweke1nA6Sq4MP84DEQhE5JtqHlb2Bpegl9WVc6zWjG4fbYuK08m1inYOTMdHeB0rcr98nB84LgdB04t89/1O/w1cDnyilFU='
    LINE_CHANNEL_SECRET = 'cd510492573cf936ebed71625ea82cf0'
    LINE_USER_ID = 'Uf005f1db11566194e221f598c3f0cb92'
else:
    # ETF小助理
    LINE_CHANNEL_ACCESS_TOKEN = 'FwwOtveP0V7ettA3lfMUosGjAgWsvsZ9plskd9pw9AhmSnBEqVhJ8pO5NN/qTF1a0uvZgbgJ5p4Sweke1nA6Sq4MP84DEQhE5JtqHlb2Bpegl9WVc6zWjG4fbYuK08m1inYOTMdHeB0rcr98nB84LgdB04t89/1O/w1cDnyilFU='
    LINE_CHANNEL_SECRET = 'cd510492573cf936ebed71625ea82cf0'
    LINE_USER_ID = 'Uf005f1db11566194e221f598c3f0cb92'

