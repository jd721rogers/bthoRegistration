# -*- coding: utf-8 -*-
"""
Created on Wed May  1 13:40:04 2019

@author: jd721
"""

import shutil
import csv
import tabula
import pandas as pd
import os
import glob

# left, mid, and right functions
def left(s, amount):
    return s[:amount]

def right(s, amount):
    return s[-amount:]

def mid(s, offset, amount):
    return s[offset:offset+amount]

# change current working directory
os.chdir(r"C:\Users\jd721\bthoRegistration\gradepdfs")
# read pdf file into an array of dataframes
grades_df = tabula.read_pdf("grd20141EN.pdf", outputFormat = "dataFrame", pages = 'all', stream = True, multiple_tables = True, \
                           area = (129.6,25.2,536.4,750))
                           #, options = "--columns 25.2,131.76,177.12,222.48,266.4,310.32,355,528.45,563.76,750")
i = 0
# converts each dataframe into a csv
while i < len(grades_df):
   grade_iter = grades_df[i].to_csv(r'C:\Users\jd721\bthoRegistration\test_tabula\grade_iter' + str(i) + '.csv', index = False)
   i += 1
# change current working directory
os.chdir(r"C:\Users\jd721\bthoRegistration\test_tabula")
# generate a list of all the filenames to combine
all_csvs = [j for j in glob.glob('*.{}'.format('csv'))]
# read all csv files into one dataframe
grades_csv = pd.concat([pd.read_csv(f) for f in all_csvs], sort=False)
# convert combined dataframe into a csv
grades_csv.to_csv( "grades_csv.csv", index = False, encoding = 'utf-8-sig')
# copying grades_csv as new specific filename
whichpdf = "grd20141EN"
shutil.copyfile(r"C:\Users\jd721\bthoRegistration\test_tabula\grades_csv.csv","C:/Users/jd721/bthoRegistration/gradecsvs/" + whichpdf + ".csv")
# deleting all csv files in folder
filelist = glob.glob(os.path.join(r"C:\Users\jd721\bthoRegistration\test_tabula", "*.csv"))
for f in filelist:
    os.remove(f)