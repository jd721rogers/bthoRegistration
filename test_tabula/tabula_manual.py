# -*- coding: utf-8 -*-
"""
Created on Wed May  1 13:40:04 2019

@author: jd721
"""


import tabula
import pandas as pd
import os
import glob

# change current working directory
os.chdir(r"C:\Users\jd721\bthoRegistration")
# read pdf file into an array of dataframes
grades_df = tabula.read_pdf("grd20131AG.pdf", outputFormat = "dataFrame", pages = 'all', stream = True, multiple_tables = True, \
                            area = (129.6,25.2,536.4,750), options = "--columns 25.2,131.76,177.12,222.48,266.4,310.32,355,528.45,563.76,642.24,750")
#print(grades_df)
#print(len(grades_df))
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
grades_csv = pd.concat([pd.read_csv(f) for f in all_csvs])
# convert combined dataframe into a csv
grades_csv.to_csv( "grades_csv.csv", index = False, encoding = 'utf-8-sig')