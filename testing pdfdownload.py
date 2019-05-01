# -*- coding: utf-8 -*-
"""
Created on Mon Apr 29 21:46:34 2019

@author: jd721
"""

import requests
import urllib
from datetime import datetime

# download gradereport.pdf
def download_filenew(download_url):
   # if statement checks if there is an available .pdf for college/year/semester input
   #if (working_pdfs[pdf_ref]) == 1:
      file_name = download_url[download_url.find('grd'):len(download_url)] 
      urllib.request.urlretrieve(download_url,file_name)
#   else:
#      pass 
     
colleges = ['AE','AG','AR','AP','GB','BA','DN','DN_PROF','ED',\
            'EN','GV','GE','SL','SL_PROF','LA',\
            'MD','MD_PROF','MS','NU','CP_PROF','PH','QT','SC',\
            'VM','VM_PROF'] 

# working_pdfs = [0,1,1,0,1,1,0,0,1,1,1,1,0,0,1,0,0,1,0,0,0,1,1,1,0,\
#                 0,1,1,0,1,1,0,0,1,1,1,1,0,0,1,0,0,1,0,0,0,1,1,1,0,\
#                 0,1,1,0,1,1,0,0,1,1,1,1,0,1,1,0,0,1,0,0,0,1,1,1,0,\
#                 0,1,1,0,1,1,0,0,1,1,1,1,0,1,1,0,0,1,0,0,0,1,1,1,0,\
#                 0,1,1,0,1,1,0,0,1,1,1,1,0,1,1,0,0,1,0,0,0,1,1,1,0,\
#                 0,1,1,0,1,1,0,0,1,1,1,1,0,1,1,0,0,1,0,0,0,1,1,1,0,\
#                 0,1,1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,0,1,1,1,1,0,\
#                 0,1,1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,0,1,1,1,1,0,\
#                 0,1,1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,0,1,1,1,1,0,\
#                 0,1,1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,0,1,1,1,1,0,\
#                 0,1,1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,0,1,1,1,1,0,\
#                 1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,\
#                 1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,\
#                 0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,\
#                 1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,\
#                 1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,\
#                 1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,\
#                 1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,]
col = colleges[24]
year = 2014
semester = 2
      
download_url = "http://web-as.tamu.edu/gradereport/PDFReports/" + str(year) + str(semester)\
         + "/grd" + str(year) + str(semester) + col + ".pdf"

         
download_filenew(download_url)