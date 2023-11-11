from flask import render_template
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired
from flask_ckeditor import CKEditor,CKEditorField
import datetime
import pandas as pd
from conf.settings import *

class PostForm(FlaskForm):
    title = StringField('Title')
    body = CKEditorField('Body', validators=[DataRequired()])
    submit = SubmitField('Submit')

def EditBase(stockId='2412'):
    updateIndex = -1
    isThere = False
    form = PostForm()

    df1 = pd.read_csv(stocklistfile)
    for index, row in df1.iterrows():  
        if str(row['stockId']) == str(stockId):
            updateIndex = index
            isThere = True

    if form.validate_on_submit():
        title = form.title.data
        body = form.body.data

        if isThere != True:
            get = {
                "stockId":[stockId],
                "Title":[title], 
                "Get":[body]
            }
            
            dff = pd.concat([df1, pd.DataFrame(get)], ignore_index=True)
            dff.to_csv(r'./myget.csv', index = False)

            return render_template('main/post.html', title=title, body=body)
        else:
            df1.loc[updateIndex,'Title'] = title
            df1.loc[updateIndex,'Get'] = body
            df1.to_csv(r'./myget.csv', index = False)
            return render_template('main/post.html', title=title, body=body)
    else:

        for index, row in df1.iterrows():  
            if str(row['stockId']) == str(stockId):
                form.title.data = df1.loc[index,'Title']
                form.body.data = df1.loc[index,'Get']

        return render_template(
            template_name_or_list = 'main/editbase.html', 
            appName = '新增修改基本資料',
            form = form
        )