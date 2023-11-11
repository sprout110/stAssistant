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

def changDirTemplate(app):
    app.template_folder()
def sitebar():
    return 