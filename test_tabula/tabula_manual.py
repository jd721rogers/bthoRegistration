# -*- coding: utf-8 -*-
"""
Created on Wed May  1 13:40:04 2019

@author: jd721
"""


import tabula
import pandas
from pandas import DataFrame

grades_df = tabula.read_pdf("grd20131AG.pdf", outputFormat = "dataFrame", stream = True, multiple_tables = True, area = (129.6,25.2,536.4,750), \
                            options = "--columns 25.2,131.76,177.12,222.48,266.4,310.32,355,528.45,563.76,642.24,750")
# area = (129.6,25.2,536.4,750)
#,\
#                            options="--columns 25.2,131.76,177.12,222.48,266.4,310.32,355,528.45,563.76,642.24,750")
print(grades_df)
grades_csv = grades_df.to_csv(r'C:\Users\jd721\bthoRegistration\push\bthoRegistration\test_tabula\grades_csv.csv')