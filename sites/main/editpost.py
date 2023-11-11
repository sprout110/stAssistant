from flask import render_template
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired
from flask_ckeditor import CKEditor,CKEditorField
import datetime
import pandas as pd
import os

class PostForm(FlaskForm):
    title = StringField('Title')
    body = CKEditorField('Body', validators=[DataRequired()])
    submit = SubmitField('Submit')

def EditPost(postDate='2023-09-30'):
    updateIndex = -1
    isThere = False
    form = PostForm()

    if os.path.isfile('myget.csv'):
        df1 = pd.read_csv(r'myget.csv',  header=0)
    else:
        df1 = pd.DataFrame(columns=['Date','Title','Get'])

    print(df1)

    for index, row in df1.iterrows():  
        if str(row['Date']) == str(postDate):
            updateIndex = index
            isThere = True

    if form.validate_on_submit():
        title = form.title.data
        body = form.body.data

        if isThere != True:
            get = {
                "Date":[datetime.datetime.strftime(datetime.datetime.today(), '%Y-%m-%d')],
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

        print('hi')
        for index, row in df1.iterrows():  
            if str(row['Date']) == str(postDate):
                form.title.data = df1.loc[index,'Title']
                form.body.data = df1.loc[index,'Get']

        return render_template(
            template_name_or_list = 'main/editpost.html', 
            appName = '新增修改貼文',
            form = form
        )