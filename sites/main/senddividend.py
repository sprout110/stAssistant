import pandas as pd
import os

def sendDividend(code):
    
    htmlHead = f""
    # df = pd.read_csv(r'stockdividend.csv',  header=0, converters={'stockId': str})

    # stockModel = StockDataModel(code)
    # price = stockModel.GetLastStockClose()
    
    # if df.shape[0]==0 or df[df['stockId']==code].empty:
    #     htmlHead = ""
    # else:
    #     dividend = df[df['stockId'] == code].iloc[0]['dividendTotal']
    #     returnRatio = dividend/price*100

    #     
    #         股票名稱:{stockModel.GetStockName()}<br />
    #         代號:{code}<br />
    #         股息:{dividend}<br />
    #         目前股價:{round(price,2)}<br />
    #         目前殖利率:{round(returnRatio,2)}%<br />
    #         """

    pd.set_option('colheader_justify', 'center')   # FOR TABLE <th>

    html_string = '''
        <html>
        <head><title>HTML Pandas Dataframe with CSS</title></head>
        <link rel="stylesheet" type="text/css" href="/static/sidebars/sidebars.css"/>
        <body>
            {table}
        </body>
        </html>.
    '''


    filename = f'l{code}.tw.csv'
    if os.path.isfile(filename):
        #render dataframe as html
        df = pd.read_csv(filename,  header=0, converters={'stockId': str})
        df = df.drop(['stockDividendDate','@price','@priceBackDate','@priceBackDays','cashDividend','shareCashDividend','cashDividendTotal','stockDividend','shareStockDividend','stockDividendTotal'], axis=1)
        df.columns=['發放年份','紅利來源','股東會','除息日','股價','填息日','填息天數','發放日','紅利',]
        df.set_index('紅利來源', inplace=True)
        df = df.drop(['填息日','發放日'], axis=1)
        htmlBody = html_string.format(table=df.to_html(classes='table'))
        # print(html)
        return f'{htmlHead} {htmlBody}'
        
        #     return msg
    else:
        return "<p>查無資料</p>"
