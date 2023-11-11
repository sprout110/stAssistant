import io
import datetime
import matplotlib
import matplotlib.font_manager as font_manager
font_manager.fontManager.addfont("font/NotoSansTC-Light.otf")
zhfont = font_manager.FontProperties(fname="font/NotoSansTC-Light.otf")
import mplfinance as mpf
from flask import send_file
import pandas as pd
from model.stockdatamodel import StockDataModel
import numpy as np

def Buy(stockId='2609'):
    buyDates = []
    dfBuy = pd.read_csv(r'mybuy.csv', converters={'stockId': str}, header=0)
    
    for i in range(0, len(dfBuy)):
        if dfBuy.iloc[i]['stockId'] == stockId:
            buyDates.append(dfBuy.iloc[i]['Date'])

    return buyDates #['2023-02-10','2023-02-17']

def Sell(stockId='2609'):
    sellDates = []
    dfSell = pd.read_csv(r'mysell.csv', converters={'stockId': str}, header=0)
    
    for i in range(0, len(dfSell)):
        if dfSell.iloc[i]['stockId'] == stockId:
            sellDates.append(dfSell.iloc[i]['sellDate'])

    return sellDates #['2023-02-10','2023-02-17']

def TargetPrice(stockId='2609'):
    try:
        df = pd.read_csv(r'stocktargetprice.csv', converters={'stockId': str}, header=0)
        if df.shape[0]>0 and not df[df['stockId']==stockId].empty:
            return float(df[df['stockId']==stockId].iloc[0]['targetPrice'])
        else:
            return -1
    except:
        return -1
    
def ReleasePrice(stockId='2609'):
    try:
        df = pd.read_csv(r'stocktargetprice.csv', converters={'stockId': str}, header=0)
        if df.shape[0]>0 and not df[df['stockId']==stockId].empty: #and str(df[df['stockId']==stockId].iloc[0]['releasePrice']).strip()!='':
        
            return float(df[df['stockId']==stockId].iloc[0]['releasePrice'])
        else:
            return -1
    except:
        return -1


def Cheap(stockId='2609'):
    try:
        df = pd.read_csv(r'stocktargetprice.csv', converters={'stockId': str}, header=0)
        if df.shape[0]>0 and not df[df['stockId']==stockId].empty:
            return float(df[df['stockId']==stockId].iloc[0]['cheap'])
        else:
            return -1
    except:
        return -1
    
def Expensive(stockId='2609'):
    try:
        df = pd.read_csv(r'stocktargetprice.csv', converters={'stockId': str}, header=0)
        if df.shape[0]>0 and not df[df['stockId']==stockId].empty: #and str(df[df['stockId']==stockId].iloc[0]['releasePrice']).strip()!='':
        
            return float(df[df['stockId']==stockId].iloc[0]['expensive'])
        else:
            return -1
    except:
        return -1
    
def CandleMain(stock='', volume = True, year=0, isTest=False):
    if not isTest:
        matplotlib.use('Agg')

    y = datetime.date.today().year
    m = datetime.date.today().month
    d = datetime.date.today().day

    #startDate = datetime.datetime(y-1, m, 1) + datetime.timedelta(days=125)
    endDate = datetime.datetime(y,m,d) + datetime.timedelta(days=1)
    
    if year == None:
        startDate = endDate + datetime.timedelta(days=-320)
    elif year == '0.3':
        startDate = endDate + datetime.timedelta(days=-96)
    elif year == '0.4':
        startDate = endDate + datetime.timedelta(days=-122)
    elif year == '0.6':
        startDate = endDate + datetime.timedelta(days=-183)
    elif year == '0.8':
        startDate = endDate + datetime.timedelta(days=-244)
    elif year == '1':
        startDate = endDate + datetime.timedelta(days=-365)
    elif year == '2':
        startDate = endDate + datetime.timedelta(days=-365*2)        
    elif year == '4':
        startDate = endDate + datetime.timedelta(days=-365*4)
    elif year == '3':
        startDate = endDate + datetime.timedelta(days=-365*3)
    elif year == '8':
        startDate = endDate + datetime.timedelta(days=-365*8)
    elif year == '10':
        startDate = endDate + datetime.timedelta(days=-365*10)
    elif year == '20':
        startDate = endDate + datetime.timedelta(days=-365*20)
    elif year == '100':
        startDate = datetime.datetime(2000,1,1)
    else:
        startDate = endDate + datetime.timedelta(days=-320)
    
    stockData = StockDataModel(stockId=stock)
    df = stockData.GetHistoryData(startDate.strftime('%Y-%m-%d'), endDate.strftime('%Y-%m-%d'))
    
    # print(startDate)
    # print(endDate)
    # print(df)

    if not df.empty and len(df)>3:
        dfStartDate = datetime.datetime.strptime(str(df.iloc[0].name), '%Y-%m-%d %H:%M:%S')
        dfEndDate = datetime.datetime.strptime(str(df.iloc[-1].name), '%Y-%m-%d %H:%M:%S')
        diff = dfEndDate - dfStartDate

        image = io.BytesIO()
        lastData = df.iloc[-1]
        last2Data = df.iloc[-2]

        #MAV
        exp5 = df['Close'].ewm(span=5, adjust=False).mean()
        exp20 = df['Close'].ewm(span=20, adjust=False).mean()
        exp60 = df['Close'].ewm(span=60, adjust=False).mean()

        delta = 0
        if df.iloc[0]['Low'] < 30:
            delta = 0.0625
        elif df.iloc[0]['Low'] < 60:
            delta = 0.125
        elif df.iloc[0]['Low'] < 100:
            delta = 0.25
        elif df.iloc[0]['Low'] < 200:
            delta = 0.5
        elif df.iloc[0]['Low'] < 400:
            delta = 1
        elif df.iloc[0]['Low'] < 500:
            delta = 2
        else:
            delta = 4

        # Buy Days
        buy = df['Close'].map(lambda x: 0)
        buy[buy!=-1] = None
        buy.iloc[0] = df.iloc[0]['Low']-delta

        for buyDate in Buy(stockId = stock):
            if buyDate in buy.index:
                try:
                    buy.loc[buyDate] = df.loc[buyDate]['Low']-delta
                except:
                    print(f'{buyDate} not in df')

        # Sell Days
        sell = df['High'].map(lambda x: 0)
        sell[sell!=-1] = None
        sell.iloc[0] = df.iloc[0]['High']+delta
    
        for sellDate in Sell(stockId = stock):
            if sellDate in sell.index:
                try:
                    sell.loc[sellDate] = df.loc[sellDate]['High']+delta
                except:
                    print(f'{sellDate} not in df')
        
        title = f'\n{stock}-{stockData.GetStockName()}'
        title += f'\n{last2Data.name.date()} Open:{"%.2f"%np.round(last2Data["Open"], 2)} High:{"%.2f"%np.round(last2Data["High"], 2)} Low:{"%.2f"%np.round(last2Data["Low"], 2)} Close:{"%.2f"%np.round(last2Data["Close"], 2)}'
        title += f'\n{lastData.name.date()} Open:{"%.2f"%np.round(lastData["Open"], 2)} High:{"%.2f"%np.round(lastData["High"], 2)} Low:{"%.2f"%np.round(lastData["Low"], 2)} Close:{"%.2f"%np.round(lastData["Close"], 2)}'
        mc = mpf.make_marketcolors(up='r', down='lime', edge="black", wick = 'black')
        
        apds = []
               
        if year in [None,  '0.3',  '0.4', '0.6', '0.8', '1']:
            apds += [
                mpf.make_addplot(exp5  ,        panel = 1, color = 'fuchsia', linestyle='dashed',  width=2),
                mpf.make_addplot(exp20 ,        panel = 1, color = '#FF8000' ,linestyle='dashdot', width=2),
            ]
            # if diff.days < 300:
            if True:
                apds += [
                    mpf.make_addplot(buy,           panel = 1, color = 'blue',    type='scatter', marker='^', markersize=60),
                    mpf.make_addplot(sell,          panel = 1, color = 'purple',  type='scatter', marker='v', markersize=60),
                ]
            try:
                # release price
                if ReleasePrice(stockId=stock) > -1:
                    releaseValue = ReleasePrice(stockId=stock)
                    releasePrice = df['Close'].map(lambda x: releaseValue)
                    apds += [
                        mpf.make_addplot(releasePrice,  panel = 1, color = 'fuchsia', linestyle='--', width=1)
                    ]   

                # buy price
                if TargetPrice(stockId=stock) > -1:
                    buyValue = TargetPrice(stockId=stock)
                    buyPrice = df['Close'].map(lambda x: buyValue)
                    apds += [
                        mpf.make_addplot(buyPrice,  panel = 1, color = 'limegreen', linestyle='-', width=1)
                    ]
                
                # cheap price
                if Cheap(stockId=stock) > -1:
                    cheapValue = Cheap(stockId=stock)
                    cheapPrice = df['Close'].map(lambda x: cheapValue)
                    apds += [
                        mpf.make_addplot(cheapPrice,  panel = 1, color = '#FFD306', linestyle='--', width=1)
                    ]   

                # expensive price
                if Expensive(stockId=stock) > -1:
                    expensiveValue = Expensive(stockId=stock)
                    expensivePrice = df['Close'].map(lambda x: expensiveValue)
                    apds += [
                        mpf.make_addplot(expensivePrice,  panel = 1, color = '#FFD306', linestyle='--', width=1)
                    ]
            except:
                print('buy price or release price error!')

            #MACD
            exp12 = df['Close'].ewm(span=12, adjust=False).mean()
            exp26 = df['Close'].ewm(span=26, adjust=False).mean()
            macd = exp12 - exp26
            signal = macd.ewm(span=9, adjust=False).mean()
            bar = macd - signal
            bar_positive = bar.map(lambda x: x if x > 0 else 0)
            bar_negative = bar.map(lambda x: x if x < 0 else 0)

            # KDJ
            low_list = df['Low'].rolling(9, min_periods=9).min()
            low_list.fillna(value=df['Low'].expanding().min(), inplace=True)
            high_list = df['High'].rolling(9, min_periods=9).max()
            high_list.fillna(value=df['High'].expanding().max(), inplace=True)
            rsv = (df['Close']-low_list) / (high_list-low_list) * 100
            K = pd.DataFrame(rsv).ewm(com=2).mean()
            D = K.ewm(com=2).mean()
            J = 3*K-2*D

            # Volume
            vol = df['Volume']
            vol_positive = vol.map(lambda x:0)
            vol_negative = vol.map(lambda x:0)
            vol_equal = vol.map(lambda x:0)

            minLow = df.iloc[0]['Low']
            maxHigh = df.iloc[0]['High']

            preClose = df.iloc[0]['Close']

            if df.iloc[0]['Open']<preClose:
                vol_positive.iloc[0] = vol.iloc[0]
            elif df.iloc[0]['Open']>preClose:
                vol_negative.iloc[0] = vol.iloc[0]
            else:
                vol_equal.iloc[0]=vol.iloc[0]

            for i in range(1, len(vol)):
                if maxHigh<df.iloc[i]['High']:
                    maxHigh = df.iloc[i]['High']

                if minLow>df.iloc[i]['Low']:
                    minLow = df.iloc[i]['Low']

                if preClose<df.iloc[i]['Close']:
                    vol_positive.iloc[i] = vol.iloc[i]
                elif preClose>df.iloc[i]['Close']:
                    vol_negative.iloc[i] = vol.iloc[i]
                else:
                    vol_equal.iloc[i]=vol.iloc[i]
                preClose = df.iloc[i]['Close']

            apds += [
                mpf.make_addplot(K,             panel = 0, color = 'fuchsia', secondary_y = False, linestyle='dashdot', ylabel = 'KDJ', width=1),
                mpf.make_addplot(D,             panel = 0, color = 'blue',    secondary_y = False, linestyle='dashdot', width=1),
                mpf.make_addplot(J,             panel = 0, color = '#FF8000', secondary_y = False, linestyle='dashdot', width=1),

                mpf.make_addplot(bar_positive,  panel = 2, color = 'red',     secondary_y = False, type = 'bar', width = 0.7, alpha = 1, ylabel = 'MACD'),
                mpf.make_addplot(bar_negative,  panel = 2, color = 'lime',    secondary_y = False, type = 'bar', width = 0.7, alpha = 1),
                mpf.make_addplot(signal,        panel = 2, color = 'blue',    secondary_y = False, linestyle='-.', width=1),
                mpf.make_addplot(macd,          panel = 2, color = 'fuchsia', secondary_y = False, linestyle='--', width=1),

                mpf.make_addplot(vol_positive,  panel = 3, color = 'red',     type='bar', width=0.7, alpha=1, ylabel='Volume'),
                mpf.make_addplot(vol_negative,  panel = 3, color = 'lime',    type='bar', width=0.7, alpha=1),
                mpf.make_addplot(vol_equal,     panel = 3, color = '#FFD306', type='bar', width=0.7, alpha=1),
            ]

            ylimup = maxHigh + 2*delta
            ylimdown = minLow - 2*delta

            kwargs = dict(
                type='candle',
                title=title, 
                ylabel = f'{stock} Price',
                ylim = (ylimdown, ylimup), 
                volume=False,
                num_panels = 4,
                main_panel = 1,           
                panel_ratios=(1,5,1,1),
                figratio=(12,6), 
                figscale=3.0,
                figsize=(16,8.5),
                datetime_format='%Y-%m-%d',
                xrotation=0, 
                show_nontrading=True,
                tight_layout=True,
                scale_padding={'left': 0.3, 'top': 5, 'right': 2, 'bottom': 0.5},
                style=mpf.make_mpf_style(
                    # figcolor = '#EEEEEE', 
                     y_on_right = True,
                     gridaxis = 'both',
                     gridstyle = '-.',
                    #  gridcolor = '#E1E1E1',
                    marketcolors=mc,
                    base_mpf_style='yahoo',
                    # gridcolor='(0.82, 0.83, 0.85)',
                    rc = {
                        'font.family': zhfont.get_name(),
                        'axes.unicode_minus': 'False'
                    }
                ),
                # hlines=[releaseValue, buyValue]
            )

        else:

            apds += [
                mpf.make_addplot(exp60,        panel = 0, color = 'blue', linestyle='--', width=1)
            ]
            try:
                # release price
                if ReleasePrice(stockId=stock) > -1:
                    releaseValue = ReleasePrice(stockId=stock)
                    releasePrice = df['Close'].map(lambda x: releaseValue)
                    apds += [
                        mpf.make_addplot(releasePrice,  panel = 0, color = 'fuchsia', linestyle='--', width=1)
                    ]   

                # buy price
                if TargetPrice(stockId=stock) > -1:
                    buyValue = TargetPrice(stockId=stock)
                    buyPrice = df['Close'].map(lambda x: buyValue)
                    apds += [
                        mpf.make_addplot(buyPrice,  panel = 0, color = 'limegreen', linestyle='-', width=1)
                    ]
                
                # cheap price
                if Cheap(stockId=stock) > -1:
                    cheapValue = Cheap(stockId=stock)
                    cheapPrice = df['Close'].map(lambda x: cheapValue)
                    apds += [
                        mpf.make_addplot(cheapPrice,  panel = 0, color = '#FFD306', linestyle='--', width=1)
                    ]   

                # expensive price
                if Expensive(stockId=stock) > -1:
                    expensiveValue = Expensive(stockId=stock)
                    expensivePrice = df['Close'].map(lambda x: expensiveValue)
                    apds += [
                        mpf.make_addplot(expensivePrice,  panel = 0, color = '#FFD306', linestyle='--', width=1)
                    ]
            except:
                print('buy price or release price error!')

            kwargs = dict(
                type='line',
                linecolor='r',
                title=title, 
                ylabel = f'{stock} Price',
                volume=False,
                figratio=(12,6), 
                figscale=3.0,
                figsize=(16,8.5),
                datetime_format='%Y-%m-%d',
                xrotation=0, 
                show_nontrading=True,
                tight_layout=True,
                scale_padding={'left': 0.3, 'top': 5, 'right': 2, 'bottom': 0.5},
                style=mpf.make_mpf_style(
                    base_mpf_style='yahoo',
                    marketcolors=mc,
                    rc = {
                        'font.family': zhfont.get_name(),
                        'axes.unicode_minus': 'False'
                    }
                )
            )
        
        fig, axes = mpf.plot(df
            ,**kwargs
            ,addplot=apds
            ,returnfig=True
        )

        firstDay = datetime.datetime(1970,1,1)
        tempArray =[]
        if diff.days < 1600:
            dfStartDate += datetime.timedelta(days=31)
            tempDate = datetime.datetime(dfStartDate.year,dfStartDate.month,1)
            while tempDate < dfEndDate:
                tempArray.append(tempDate)
                tempDate = tempDate + datetime.timedelta(days=31)
                tempDate = datetime.datetime(tempDate.year, tempDate.month, 1)
        else:
            dfStartDate += datetime.timedelta(days=365)
            
            tempDate = datetime.datetime(dfStartDate.year,1,1)
            while tempDate < dfEndDate:
                tempArray.append(tempDate)
                tempDate = tempDate + datetime.timedelta(days=370)
                tempDate = datetime.datetime(tempDate.year, 1, 1)
        
        newxticks = [(i-firstDay).days for i in tempArray]
        newlabels = []

        for i in tempArray:
            if diff.days>365:
                if datetime.datetime.strftime(i, '%m-%d') == '01-01':
                    newlabels.append(f'{i.year}')
                elif i.month % 2 == 0:
                    newlabels.append(f' ')
                else:
                    newlabels.append(f'{i.month}/{i.day}')
            else:
                if datetime.datetime.strftime(i, '%m-%d') == '01-01':
                    newlabels.append(f'{i.year}')
                else:
                    newlabels.append(f'{i.month}/{i.day}')

        axes[0].set_xticks(newxticks)
        try:
            axes[0].set_xticklabels(newlabels)
            # print('OK')
        except:
            print('Something error!')
        fig.savefig(image, format='png')
        image.seek(0)

        if isTest:
            mpf.show()
        else:
            return send_file(image, attachment_filename="image.png")       
    else:
        return '<p>查無資料</p>'
# CandleMain(stock='2454', volume = False, year=1, isTest=True)