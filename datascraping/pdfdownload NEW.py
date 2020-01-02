"""
testing pdfdownload_new

This file gets the array that is used for working_pdfs. Need to use to update working_pdfs in datascrape.py
"""
import requests
import os
from datetime import datetime

os.chdir(r"C:\Users\jd721\bthoRegistration\push\datascraping\gradepdfs")
year = 2010
semester = 1 # Spring = 1, Summer = 2, Fall = 3
college = 0
colleges = ['AE','AG','AR','AP','GB','BA','DN','ED','EN','GV','GE','SL','LA',\
            'MD','MS','NU','CP_PROF','PH','QT','SC','VM','VM_PROF']
today = datetime.today() # current date
n = today.year
current_month = today.month
working_pdfs = []

# download gradereport.pdf
def download_filenew(download_url):
    file_name = download_url[download_url.find('grd'):len(download_url)] 
    temp = 1
    r = requests.get(download_url,verify=False)
    if (str(r.content).find("The resource you are looking for might have been removed, had its name changed, or is temporarily unavailable") == -1):
       with open(file_name,"wb") as p:
          p.write(r.content)
          p.close()    
    else:
       temp = 0
    working_pdfs.append(temp)

# only goes up to previous year
while year < n:
    while semester <= 3:
        while college < len(colleges):
            download_url = "https://web-as.tamu.edu/GradeReports/PDFReports/" + str(year) + str(semester) + "/grd" + str(year) + str(semester) + colleges[college] + ".pdf"
            download_filenew(download_url)
            college += 1
        college = 0
        semester += 1
    year += 1
    semester = 1

# current year spring
if ((current_month == 6) or (current_month == 7) or (current_month == 8)):
    semester = 1
    while college < len(colleges):
        download_url = "https://web-as.tamu.edu/GradeReports/PDFReports/" + str(year) + str(semester) + "/grd" + str(year) + str(semester) + colleges[college] + ".pdf"
        download_filenew(download_url)
        college += 1
# current year spring & summer
elif ((current_month == 9) or (current_month == 10) or (current_month == 11) or (current_month == 12)):
    semester = 1
    while semester < 3:
        while college < len(colleges):
            download_url = "https://web-as.tamu.edu/GradeReports/PDFReports/" + str(year) + str(semester) + "/grd" + str(year) + str(semester) + colleges[college] + ".pdf"
            download_filenew(download_url)
            college += 1
        semester += 1
# no current year
else:
    pass

print(working_pdfs)