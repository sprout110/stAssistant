from flask import Flask, render_template, request, Markup
from lib.writelog import *
from conf.settings import *

def Home():
    # font_set = {f.name for f in font_manager.fontManager.ttflist}
    # for f in font_set:
    #     result += str(f) + '<br />'
    # return result
    logData = showTodayLog()
    if logData.empty:
        log = '今天還沒有任何執行記錄。'
    else:
        log = ''
        for i in range(0, len(logData)):
            row = logData.iloc[i]
            logTime = datetime.datetime.strftime(
                datetime.datetime.strptime(
                    row.name[0:-6], 
                    '%Y-%m-%d %H:%M:%S.%f'
                ),
                '%Y-%m-%d %H:%M'
            )
            log += logTime + ' ' + row['log'] + '<br />'

    return render_template('main/index.html', log = Markup(log), posts = '', appName = appName)