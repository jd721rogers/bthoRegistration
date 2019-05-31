"""
testing pdfdownload_new

This file gets the array that is used for working_pdfs. Need to use to update working_pdfs in datascrape.py
"""
import urllib.request
import os
from datetime import datetime

os.chdir(r"C:\Users\jd721\bthoRegistration\gradepdfs")
year = 2010
semester = 1 # Spring = 1, Summer = 2, Fall = 3
college = 0
colleges = ['AE','AG','AR','AP','GB','BA','DN','DN_PROF','ED','EN','GV','GE','SL','LA',\
            'MD','MD_PROF','MS','NU','CP_PROF','PH','QT','SC','VM','VM_PROF']
today = datetime.today() # current date
n = today.year
working_pdfs = []

# download gradereport.pdf
def download_filenew(download_url):
    file_name = download_url[download_url.find('grd'):len(download_url)] 
    temp = 1
    try:
        urllib.request.urlretrieve(download_url,file_name)
    except:
        temp = 0
    working_pdfs.append(temp)

while year < n:
    while semester <= 3:
        while college < len(colleges):
            download_url = "http://web-as.tamu.edu/gradereport/PDFReports/" + str(year) + str(semester) + "/grd" + str(year) + str(semester) + colleges[college] + ".pdf"
            download_filenew(download_url)
            college += 1
        college = 0
        semester += 1
    year += 1
    semester = 1

print(working_pdfs)