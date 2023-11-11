import matplotlib as mpl
import numpy as np
import matplotlib.font_manager as font_manager
font_manager.fontManager.addfont("font/NotoSansTC-Light.otf")
zhfont = font_manager.FontProperties(fname="font/NotoSansTC-Light.otf")
from matplotlib import pyplot as plt
import mplfinance as mpf
import datetime
import model.getdata as getdata
import pandas as pd
import uuid
from lib.myimgur import MyImgur
from model.stockdatamodel import StockDataModel

def SomePrice(stockId):
    try:
        df = pd.read_csv(r'stocktargetprice.csv', converters={'stockId': str}, header=0)
        if df.shape[0] > 0: 
            if not df[df['stockId']==stockId].empty:
                targetPrice = df[df['stockId']==stockId].iloc[0]
                

                return float(targetPrice["targetPrice"]), float(targetPrice["releasePrice"])
            else:
                return -1, -1
        else:
            return -1, -1
    except:
        return -1, -1

class CandleV40:
    Name = 'CandleV40'
    def __init__(self, uid, msg):
        self.uid = uid
        self.msg = msg

    def Process(self, test = False):
        msglist = self.msg.split()

        y = datetime.date.today().year
        m = datetime.date.today().month
        d = datetime.date.today().day

        df = pd.DataFrame()
        stock = ''

        try:
            noDataMessage = '沒有資料'
            stock = str(msglist[0][1:])
            stockInfo = getdata.getStockInfo(stock)
            title = stock.upper() + '.TW-' + stockInfo['stockName'].iloc[0]

            if len(msglist) == 1:
                startDate = datetime.datetime(y-1, m, 1)
                endDate = datetime.datetime(y,m,d) + datetime.timedelta(days=1)
            elif len(msglist) == 2:
                startDate = datetime.datetime.strptime(msglist[1], '%Y-%m-%d')
                endDate = datetime.datetime(y,m,d) + datetime.timedelta(days=1)
            elif len(msglist) == 3:
                startDate = datetime.datetime.strptime(msglist[1], '%Y-%m-%d')
                endDate = datetime.datetime.strptime(msglist[2], '%Y-%m-%d')  + datetime.timedelta(days=1)
            
            stockData = StockDataModel(stockId=stock)
            df = stockData.GetHistoryData(startDate.strftime('%Y-%m-%d'), endDate.strftime('%Y-%m-%d'))
            
            if df.empty:
                return MyImgur(msg = noDataMessage)
                
            dfStartDate = df.iloc[0].name.date()
            dfEndDate = df.iloc[-1].name.date()

            subTitle = ' '
            if endDate >= datetime.datetime(y,m,d) + datetime.timedelta(days=1):
                showLast = True
                subTitle += '最近'
            else:
                showLast = False
                subTitle += '歷史'

            diff = dfEndDate-dfStartDate

            if diff.days < 365:
                subTitle += f' {round(diff.days/30)} 個月'
            else:
                years = f'{round(diff.days/365,1)}'
                
                if years[-1]=='0':
                    years = years[:-2]
                    
                subTitle += f' {years} 年'

            buy, release = SomePrice(stock)

            link = self.OStyle(df=df ,title= title + subTitle,test= test, release=release, buy=buy, showLast=showLast)

            plt.close('all')

            if test:
                mpf.show()
                
            return MyImgur(link = link, msg = "", filename=f'{link}.png')
        except:
            return MyImgur(link = "", msg = CandleV40.Name + ":產生圖檔時發生錯誤。。。", filename='')

    def OStyle(self, df, title, release=0, buy=0, showLast=True, test = False):
        if not test:
            mpl.use('Agg')
        
        dfStartDate = datetime.datetime.strptime(str(df.iloc[0].name), '%Y-%m-%d %H:%M:%S')
        dfEndDate = datetime.datetime.strptime(str(df.iloc[-1].name), '%Y-%m-%d %H:%M:%S')
        diff = dfEndDate - dfStartDate
        newxticks, newlabels = self.MyXticks(dfStartDate, dfEndDate)

        lastData = df.iloc[-1]
        last2Data = df.iloc[-2]        
        title2 = f'{last2Data.name.date()}     開盤:{"%.2f"%np.round(last2Data["Open"], 2)}      最高:{"%.2f"%np.round(last2Data["High"], 2)}       最低:{"%.2f"%np.round(last2Data["Low"], 2)}      收盤:{"%.2f"%np.round(last2Data["Close"], 2)}'
        title3 = f'{lastData.name.date()}     開盤:{"%.2f"%np.round(lastData["Open"], 2)}      最高:{"%.2f"%np.round(lastData["High"], 2)}       最低:{"%.2f"%np.round(lastData["Low"], 2)}      收盤:{"%.2f"%np.round(lastData["Close"], 2)}'

        link = 'a' + uuid.uuid4().hex
        imgFilePath =  link + '.png'

        
        # if diff.days <= 365:
        style, title_font, normal_label_font = self.MyStyle(type='Type2')
        # else:
        #     style, title_font, normal_label_font = self.MyStyle()
        
        mav1, mav2, mav3, mav4 = self.MyMav(df)
        
        fig = mpf.figure(style=style, figsize=(12,8))

        if diff.days <= 750:

            fig.text(0.26, 0.94, f'{title}', **title_font)
            fig.text(0.12, 0.88, title2, **normal_label_font)
            fig.text(0.12, 0.82, title3, **normal_label_font)

            ax1 = fig.add_axes([0.06, 0.25, 0.87, 0.55])
            ax2 = fig.add_axes([0.06, 0.15, 0.87, 0.10], sharex=ax1)
            ax3 = fig.add_axes([0.06, 0.05, 0.87, 0.10], sharex=ax1)
                
            macd, signal, histogram_positive, histogram_negative = self.MyMacd(df)
            vol_positive, vol_negative, vol_equal = self.MyVol(df)


            apds = [
                mpf.make_addplot(mav1,  color='fuchsia',linestyle='dashed' , ax = ax1),
                mpf.make_addplot(mav2,  color='orange' ,linestyle='dashdot', ax = ax1),

                mpf.make_addplot(histogram_positive, type = 'bar', width = 0.7, color = 'red', alpha = 1, secondary_y = False, ax=ax2, ylabel='MACD',y_on_right=True),
                mpf.make_addplot(histogram_negative, type = 'bar', width = 0.7, color = 'lime', alpha = 1, secondary_y = False, ax = ax2),
                mpf.make_addplot(macd, color = 'fuchsia', secondary_y = True, linestyle='dashdot', ax = ax2),
                mpf.make_addplot(signal, color = 'blue', secondary_y = True, linestyle='dashdot', ax = ax2),

                mpf.make_addplot(vol_positive, color='red'        , type='bar', width=0.7, alpha=1, ax=ax3, ylabel='Volume', y_on_right=True),
                mpf.make_addplot(vol_negative, color='limegreen'  , type='bar', width=0.7, alpha=1, ax=ax3),
                mpf.make_addplot(vol_equal,    color='orange'     , type='bar', width=0.7, alpha=1, ax=ax3),
            ]

            # if diff.days>365:
            if showLast:
                if release > 0:
                    releasePrice = df['Close'].map(lambda x: release)
                    apds += [
                        mpf.make_addplot(releasePrice,  panel = 1, color = 'fuchsia', linestyle='--', ax=ax1)
                    ]
                if buy > 0:
                    buyPrice = df['Close'].map(lambda x: buy)
                    apds += [
                        mpf.make_addplot(buyPrice,  panel = 1, color = 'limegreen', linestyle='--', ax=ax1)
                    ]

            width_config={ 'candle_linewidth':0.6, 'candle_width':0.9 }

            kwargs = dict(
                type='candle',
                volume=False,
                ylabel = '股價      週線(紅)      月線(橙)',
                show_nontrading = True,
                xrotation = 0,
                update_width_config = width_config
            )

            mpf.plot(
                df,
                ax = ax1,
                addplot = apds,
                **kwargs
            )

        else:

            fig.text(0.26, 0.93, f'{title}', **title_font)
            fig.text(0.12, 0.86, title2, **normal_label_font)
            fig.text(0.12, 0.80, title3, **normal_label_font)
      
            ax1 = fig.add_axes([0.03, 0.12, 0.90, 0.65])
            apds = [
                mpf.make_addplot(mav3,  color='blue' ,linestyle='--', ax = ax1, width=1),
            ]

            if showLast:
                if release > 0:
                    releasePrice = df['Close'].map(lambda x: release)
                    apds += [
                        mpf.make_addplot(releasePrice,  panel = 1, color = 'fuchsia', linestyle='--', width=1, ax=ax1)
                    ]
                if buy > 0:
                    buyPrice = df['Close'].map(lambda x: buy)
                    apds += [
                        mpf.make_addplot(buyPrice,  panel = 1, color = 'limegreen', linestyle='-', width=1, ax=ax1)
                    ]

            kwargs = dict(
                type='line',
                linecolor='fuchsia',
                volume=False,
                ylabel = '股價(紅)  季線(藍)',
                show_nontrading = True,
                xrotation = 0
            )

            mpf.plot(
                df,
                ax = ax1,
                addplot = apds,
                **kwargs
            )

        ax1.set_xticks(newxticks)
        ax1.set_xticklabels(newlabels)

        fig.savefig(imgFilePath)

        

        return link
    
    def MyMav(self, df):
        #MAV
        exp5 = df['Close'].ewm(span=5, adjust=False).mean()
        exp20 = df['Close'].ewm(span=20, adjust=False).mean()
        exp60 = df['Close'].ewm(span=60, adjust=False).mean()
        exp240 = df['Close'].ewm(span=240, adjust=False).mean()

        return exp5, exp20, exp60, exp240
    
    def MyMacd(self, df):
        #MACD
        exp12 = df['Close'].ewm(span=12, adjust=False).mean()
        exp26 = df['Close'].ewm(span=26, adjust=False).mean()
        macd = exp12 - exp26
        signal = macd.ewm(span=9, adjust=False).mean()
        histogram = macd - signal
        histogram[histogram<0] = None
        histogram_positive = histogram
        histogram = macd - signal
        histogram[histogram>0] = None
        histogram_negative = histogram

        return macd, signal, histogram_positive, histogram_negative
    
    def MyVol(self, df):
        #Volume
        vol = df['Volume']
        vol_positive = vol.map(lambda x:0)
        vol_negative = vol.map(lambda x:0)
        vol_equal = vol.map(lambda x:0)
        preClose = df.iloc[0]['Close']
        
        if df.iloc[0]['Open']<preClose:
            vol_positive.iloc[0] = vol.iloc[0]
        elif df.iloc[0]['Open']>preClose:
            vol_negative.iloc[0] = vol.iloc[0]
        else:
            vol_equal.iloc[0] = vol.iloc[0]
        
        for i in range(1, len(vol)):
            if preClose<df.iloc[i]['Close']:
                vol_positive.iloc[i] = vol.iloc[i]
            elif preClose>df.iloc[i]['Close']:
                vol_negative.iloc[i] = vol.iloc[i]
            else:
                vol_equal.iloc[i]=vol.iloc[i]
            preClose = df.iloc[i]['Close']

        return vol_positive, vol_negative, vol_equal
    
    def MyStyle(self, type='Type1'):
        title_font = {
            'fontname': zhfont.get_name(), 
            'size':'22',
            'color':'black',
            'weight':'bold',
            'va':'bottom',
            'ha':'left',
            
        }

        normal_label_font = {
            'fontname': zhfont.get_name(),
            'size':'20',
            'color':'black',
            'weight':'bold',
            'va':'bottom',
            'ha':'left',
        }

        if type == 'Type1':
            marketcolors = mpf.make_marketcolors(up = 'red', down = 'limegreen', inherit=True)
        elif type == 'Type2':
            marketcolors = mpf.make_marketcolors(up='r', down='lime', edge='black')
        rc = { 'font.family': zhfont.get_name(), 'axes.unicode_minus': 'False' }
        style = mpf.make_mpf_style(
            base_mpf_style='yahoo', 
            marketcolors=marketcolors, 
            rc=rc,
            gridaxis = 'both',
            gridstyle = '-.',
            gridcolor = '#E1E1E1',
            y_on_right = True)
        return style, title_font, normal_label_font
    
    def MyXticks(self, dfStartDate, dfEndDate):
        diff = dfEndDate - dfStartDate
        firstDay = datetime.datetime(1970,1,1)
        tempArray =[]

        if diff.days < 1600:
            tempDate = datetime.datetime(dfStartDate.year,dfStartDate.month,1)
            while tempDate < dfEndDate:
                tempArray.append(tempDate)
                tempDate = tempDate + datetime.timedelta(days=31)
                tempDate = datetime.datetime(tempDate.year, tempDate.month, 1)
        else:
            tempDate = datetime.datetime(dfStartDate.year,1,1)
            while tempDate < dfEndDate:
                tempArray.append(tempDate)
                tempDate = tempDate + datetime.timedelta(days=370)
                tempDate = datetime.datetime(tempDate.year, 1, 1)
        
        newxticks = [(i-firstDay).days for i in tempArray]
        newlabels = []

        for i in tempArray:
            if datetime.datetime.strftime(i, '%m-%d') == '01-01':
                newlabels.append(f'{i.year}')
            elif i.month % 2 == 0:
                newlabels.append(f' ')
            else:
                newlabels.append(f'{i.month}/{i.day}')

        return newxticks, newlabels

# stockId = '9921'
# startDate = datetime.datetime.strptime('2010-05-14','%Y-%m-%d')
# endDate = datetime.datetime.strptime('2023-05-14','%Y-%m-%d')

# msg = f'k{stockId} {startDate.strftime("%Y-%m-%d")} {endDate.strftime("%Y-%m-%d")}'
# testKchart = CandleV40('uid', msg)
# testKchart.Process(test=True)

