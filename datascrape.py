"""
Created on Mon Apr 29 10:24:30 2019
Version 1.0

@author: Jonathan Rogers
         Nicholas Minton
"""


import urllib
import tabula
from datetime import datetime
import time

start_time = time.time()

# left, mid, and right functions
def left(s, amount):
    return s[:amount]

def right(s, amount):
    return s[-amount:]

def mid(s, offset, amount):
    return s[offset:offset+amount]

# downloads grade reports from TAMU registrar
def download_file(download_url,pdf_ref,working_pdfs):
   # if statement checks if there is an available .pdf for college/year/semester input
   if (working_pdfs[pdf_ref]) == 1:
      file_name = download_url[download_url.find('grd'):len(download_url)] 
      urllib.request.urlretrieve(download_url,file_name)
   else:
      pass

# get grade data from downloaded grade reports
def getGrades(url,yr,sem,col):
   tabula.convert_into(url[url.find('grd'):len(url)],url[url.find('grd'):(len(url)-4)] + ".csv",\
                           output_format="csv",pages='all')

# initialize variables
year = 2013
today = datetime.today() # current date
n = today.year
semester = 1 # Spring = 1, Summer = 2, Fall = 3
college = 0
colleges = ['AE','AG','AR','AP','GB','BA','DN','DN_PROF','ED','EN','GV','GE','SL','SL_PROF','LA',\
            'MD','MD_PROF','MS','NU','CP_PROF','PH','QT','SC','VM','VM_PROF']
# array for referencing whether there is an available pdf from previous years/semesters/colleges
# each row is a semester&year combination and each number slot represents a college for that combination
working_pdfs = [0,1,1,0,1,1,0,0,1,1,1,1,0,0,1,0,0,1,0,0,0,1,1,1,0,\
                0,1,1,0,1,1,0,0,1,1,1,1,0,0,1,0,0,1,0,0,0,1,1,1,0,\
                0,1,1,0,1,1,0,0,1,1,1,1,0,1,1,0,0,1,0,0,0,1,1,1,0,\
                0,1,1,0,1,1,0,0,1,1,1,1,0,1,1,0,0,1,0,0,0,1,1,1,0,\
                0,1,1,0,1,1,0,0,1,1,1,1,0,1,1,0,0,1,0,0,0,1,1,1,0,\
                0,1,1,0,1,1,0,0,1,1,1,1,0,1,1,0,0,1,0,0,0,1,1,1,0,\
                0,1,1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,0,1,1,1,1,0,\
                0,1,1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,0,1,1,1,1,0,\
                0,1,1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,0,1,1,1,1,0,\
                0,1,1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,0,1,1,1,1,0,\
                0,1,1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,0,1,1,1,1,0,\
                1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,\
                1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,\
                0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,\
                1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,\
                1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,\
                1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,\
                1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
pdf_ref = 0

# loops through every college for every semester and every year and downloads available grade reports\
# and parses through grade reports to obtain grade data
# checks for current time of year to see last probable grade report available
#
# current year spring reports available
if today.month == ("July" or "August" or "September"):
   while year <= n:
      if year == today.year:
         semester = 1
         while college < len(colleges):
            download_url = "http://web-as.tamu.edu/gradereport/PDFReports/" + str(year) + str(semester)\
            + "/grd" + str(year) + str(semester) + colleges[college] + ".pdf"
            download_file(download_url,pdf_ref,working_pdfs);
            if (working_pdfs[pdf_ref]) == 1:
               getGrades(download_url,year,semester,colleges[college])
            college += 1
            pdf_ref += 1
         college = 0
      else:
         while semester <= 3:
            while college < len(colleges):
               download_url = "http://web-as.tamu.edu/gradereport/PDFReports/" + str(year) + str(semester)\
               + "/grd" + str(year) + str(semester) + colleges[college] + ".pdf"
               download_file(download_url,pdf_ref,working_pdfs);
               if (working_pdfs[pdf_ref]) == 1:
                  getGrades(download_url,year,semester,colleges[college])
               college += 1
               pdf_ref += 1
            college = 0
            semester += 1
         year += 1
         semester = 1  
# current year spring and summer reports available
elif today.month == ("October" or "November" or "December"):
   while year <= n:
      if year == today.year:
         semester = 1
         while semester <= 2:
            while college < len(colleges):
               download_url = "http://web-as.tamu.edu/gradereport/PDFReports/" + str(year) + str(semester)\
               + "/grd" + str(year) + str(semester) + colleges[college] + ".pdf"
               download_file(download_url,pdf_ref,working_pdfs);
               if (working_pdfs[pdf_ref]) == 1:
                  getGrades(download_url,year,semester,colleges[college])
               college += 1
               pdf_ref += 1
            college = 0
            semester += 1
      else:
         while semester <= 3:
            while college < len(colleges):
               download_url = "http://web-as.tamu.edu/gradereport/PDFReports/" + str(year) + str(semester)\
               + "/grd" + str(year) + str(semester) + colleges[college] + ".pdf"
               download_file(download_url,pdf_ref,working_pdfs);
               if (working_pdfs[pdf_ref]) == 1:
                  getGrades(download_url,year,semester,colleges[college])
               college += 1
               pdf_ref += 1
            college = 0
            semester += 1
         year += 1
         semester = 1  
# no current year reports available
else:
   while year < n:
      while semester <= 3:
         while college < len(colleges):
            download_url = "http://web-as.tamu.edu/gradereport/PDFReports/" + str(year) + str(semester)\
            + "/grd" + str(year) + str(semester) + colleges[college] + ".pdf"
            download_file(download_url,pdf_ref,working_pdfs);
            if (working_pdfs[pdf_ref]) == 1:
               getGrades(download_url,year,semester,colleges[college])
            college += 1
            pdf_ref += 1
         college = 0
         semester += 1
      year += 1
      semester = 1
      
end_time = time.time()