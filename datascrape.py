"""
Created on Mon Apr 29 10:24:30 2019
Version 1.0

@author: Jonathan Rogers

"""
import pandas as pd
import csv
import glob
import shutil
import sqlite3
import os
import urllib
import tabula
from datetime import datetime

# left, mid, and right functions
def left(s, amount):
    return s[:amount]

def right(s, amount):
    return s[-amount:]

def mid(s, offset, amount):
    return s[offset:offset+amount]

# function for detecting numbers in string
def hasNumbers(inputString):
   return any(char.isdigit() for char in inputString)

# downloads grade reports from TAMU registrar website
def download_file(download_url,pdf_ref,working_pdfs):
   # if statement checks if there is an available .pdf for college/year/semester input
   if (working_pdfs[pdf_ref]) == 1:
      file_name = download_url[download_url.find('grd'):len(download_url)] 
      urllib.request.urlretrieve(download_url,file_name)
   else:
      pass

# get grade data from downloaded grade reports
def getGrades(url,yr,sem,col):
   # change current working directory
   os.chdir(r"C:\Users\jd721\bthoRegistration\gradepdfs")
   # read pdf file into an array of dataframes
   grades_df = tabula.read_pdf("grd" + str(yr) + str(sem) + str(col) + ".pdf", outputFormat = "dataFrame", pages = 'all', stream = True, multiple_tables = True, \
                              area = (129.6,25.2,536.4,750))
                              #, options = "--columns 25.2,131.76,177.12,222.48,266.4,310.32,355,528.45,563.76,750")
   i = 0
   # converts each dataframe into a csv
   while i < len(grades_df):
      grade_iter = grades_df[i].to_csv(r'C:\Users\jd721\bthoRegistration\tabula\grade_iter' + str(i) + '.csv', index = False)
      i += 1
   # change current working directory
   os.chdir(r"C:\Users\jd721\bthoRegistration\tabula")
   # generate a list of all the filenames to combine
   all_csvs = [j for j in glob.glob('*.{}'.format('csv'))]
   num_csvs = len(os.listdir(r"C:\Users\jd721\bthoRegistration\tabula"))
   # read all csv files into one dataframe
   grades_csv = pd.concat([pd.read_csv(f) for f in all_csvs], sort=False)
   # convert combined dataframe into a csv
   grades_csv.to_csv( "grades_csv.csv", index = False, encoding = 'utf-8-sig')
   # copying grades_csv as new specific filename
   whichpdf = "grd" + str(yr) + str(sem) + str(col)
   shutil.copyfile(r"C:\Users\jd721\bthoRegistration\tabula\grades_csv.csv","C:/Users/jd721/bthoRegistration/gradecsvs/" + whichpdf + ".csv")
   # deleting all csv files in folder
   filelist = glob.glob(os.path.join(r"C:\Users\jd721\bthoRegistration\tabula", "*.csv"))
   for f in filelist:
      os.remove(f)
   # open csv file
   os.chdir(r"C:\Users\jd721\bthoRegistration\gradecsvs")
   with open("grd" + str(yr) + str(sem) + str(col) + ".csv", encoding="utf8") as csvfile:
      # read csv file
      readGrades = csv.reader(csvfile, delimiter=",")
      # iterate through row to grab useful data from .csv
      for row in readGrades:
         if (row[0] != "COURSE TOTAL:") & (row[0] != "DEPARTMENT TOTAL:") & (len(row[0]) > 6):
            void = "OK"
            if str(col) == "CP_PROF":
               crs = left(row[0],4) + mid(row[0],5,3)
               A = str(row[1])
               B = str(row[2])
               C = str(row[3])
               D = str(row[4])
               F = str(row[5])
               Q = "N/A"
               instr = row[13]
            # these if statements SHOULD account for an error in converting the .pdf to
            # a .csv file. Tabula is kinda wack. Maybe something that could be fixed.
            # Lol jk we'll wing it.
            elif len(row) == 13:
               crs = left(row[0],4) + mid(row[0],5,3)
               A = str(row[1])
               B = str(row[2])
               Q = str(row[10])
               instr = right(row[12],(len(row[12]) - row[12].find(" ") - 1))
               if row[4] == "":
                  C = str(left(row[3],(row[3].find(" "))))
                  D = str(right(row[3],len(row[3]) - row[3].find(" ") - 1))
                  F = str(row[5])
               elif row[5] == "":
                  if row[4].count(" ") == 1:
                     C = str(row[3])
                     D = str(left(row[4],(row[4].find(" "))))
                     F = str(right(row[4],len(row[4]) - row[4].find(" ") - 1))
                  elif row[3].count(" ") == 1:
                     C = str(left(row[3],(row[3].find(" "))))
                     D = str(right(row[3],len(row[3]) - row[3].find(" ") - 1))
                     F = str(row[4])
                  # this is where you get boned because tabula is garbo so im just 
                  # ignoring these instances.
                  else:
                     void = "VOID"
                     crs = "VOID"
                     A = "VOID"
                     B = "VOID"
                     C = "VOID"
                     D = "VOID"
                     F = "VOID"
                     Q = "VOID"
                     instr = "VOID"
               else:
                  C = str(row[3])
                  D = str(row[4])
                  F = str(row[5])
            elif len(row) == 15:
               crs = left(row[0],4) + mid(row[0],5,3)
               A = str(row[1])
               B = str(row[2])
               C = str(row[3])
               D = str(row[4])
               F = str(row[5])
               Q = str(row[11])
               instr = row[14]
            else:
               raise Exception('Need to account for a new version of csv format. ;(')
            # accounting for another weird tabula thing
            if F == "":
               if len(D) == 4:
                  F = right(D,2)
                  D = left(D,2)
               elif len(D) == 2:
                  F = right(D,1)
                  D = left(D,1)
               elif len(D) == 3:
                  void = "VOID"
            # add values to array
            if (instr == "") or (hasNumbers(instr) == True) or (len(instr) < 4):
               void = "VOID"
            if void != "VOID":
               temp = Grade(instr,crs,A,B,C,D,F,Q)
               c.execute("INSERT INTO grades VALUES (?, ?, ?, ?, ?, ?, ?, ?)", (temp.instructor, temp.clas, temp.numAs, temp.numBs, temp.numCs, temp.numDs, temp.numFs, temp.numQs))
               db.commit()

# initialize database
db = sqlite3.connect('grades.db')
c = db.cursor()
c.execute("""CREATE TABLE grades (
            instructor TEXT, 
            class TEXT, 
            numAs TEXT, 
            numBs TEXT, 
            numCs TEXT, 
            numDs TEXT, 
            numFs TEXT, 
            numQs TEXT
            )""")

# creating the grade class            
class Grade:
   def __init__(self, instructor, clas, numAs, numBs, numCs, numDs, numFs, numQs):
      self.instructor = instructor
      self.clas = clas
      self.numAs = numAs
      self.numBs = numBs
      self.numCs = numCs
      self.numDs = numDs
      self.numFs = numFs
      self.numQs = numQs
   def __repr__(self):
      return "Grade('{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}')".format(self.instructor, self.clas, self.numAs, self.numBs, self.numCs, self.numDs, self.numFs, self.numQs)

# initialize variables
year = 2010
today = datetime.today() # current date
current_month = today.month # current month
n = today.year # current year
semester = 1 # Spring = 1, Summer = 2, Fall = 3
college = 0
colleges = ['AE','AG','AR','AP','GB','BA','DN','ED','EN','GV','GE','SL','LA',\
            'MD','MS','NU','CP_PROF','PH','QT','SC','VM','VM_PROF']
pdf_ref = 0

# array for referencing whether there is an available pdf from previous years/semesters/colleges
# each row is a semester&year combination and each number slot represents a college for that combination
working_pdfs = [0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, \
                0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, \
                0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, \
                0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, \
                0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, \
                0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, \
                0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, \
                0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, \
                0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, \
                0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, \
                0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, \
                0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, \
                0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, \
                0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, \
                0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, \
                0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, \
                0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, \
                0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, \
                0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, \
                0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, \
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, \
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, \
                0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, \
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, \
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, \
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, \
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, \
                1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0]


# loops through every college for every semester and every year and downloads available grade reports
# Also parses through grade reports to obtain grade data
#
# reports that only go up to previous year
while year < n:
   while semester <= 3:
      while college < len(colleges):
         # if statement accounts for broken pdfs
         if (((str(year) + str(semester) + str(colleges[college])) == "20112MS") \
         or ((str(year) + str(semester) + str(colleges[college])) == "20122MS") \
         or ((str(year) + str(semester) + str(colleges[college])) == "20132MS") \
         or ((str(year) + str(semester) + str(colleges[college])) == "20142MS") \
         or ((str(year) + str(semester) + str(colleges[college])) == "20152MS") \
         or ((str(year) + str(semester) + str(colleges[college])) == "20162MD") \
         or ((str(year) + str(semester) + str(colleges[college])) == "20182AE") \
         or ((str(year) + str(semester) + str(colleges[college])) == "20182MS")):
            pass
         else:
            download_url = "http://web-as.tamu.edu/gradereport/PDFReports/" + str(year) + str(semester)\
            + "/grd" + str(year) + str(semester) + colleges[college] + ".pdf"
            os.chdir(r"C:\Users\jd721\bthoRegistration\gradepdfs")
            download_file(download_url,pdf_ref,working_pdfs)
            if (working_pdfs[pdf_ref]) == 1:
               getGrades(download_url,year,semester,colleges[college])
         college += 1
         pdf_ref += 1
      college = 0
      semester += 1
   year += 1
   semester = 1

# checks for current month to see last probable grade report available
#
# current year spring report
if ((current_month == 6) or (current_month == 7) or (current_month == 8)):
   semester = 1
   college = 0
   year = n
   while college < len(colleges):
      download_url = "http://web-as.tamu.edu/gradereport/PDFReports/" + str(year) + str(semester)\
      + "/grd" + str(year) + str(semester) + colleges[college] + ".pdf"
      os.chdir(r"C:\Users\jd721\bthoRegistration\gradepdfs")
      download_file(download_url,pdf_ref,working_pdfs)
      if (working_pdfs[pdf_ref]) == 1:
         getGrades(download_url,year,semester,colleges[college])
      college += 1
      pdf_ref += 1
# current year spring & summer reports
elif ((current_month == 9) or (current_month == 10) or (current_month == 11) or (current_month == 12)):
   semester = 1
   college = 0
   year = n
   while semester < 3:
      while college < len(colleges):
         download_url = "http://web-as.tamu.edu/gradereport/PDFReports/" + str(year) + str(semester)\
         + "/grd" + str(year) + str(semester) + colleges[college] + ".pdf"
         os.chdir(r"C:\Users\jd721\bthoRegistration\gradepdfs")
         download_file(download_url,pdf_ref,working_pdfs)
         if (working_pdfs[pdf_ref]) == 1:
            getGrades(download_url,year,semester,colleges[college])
         college += 1
         pdf_ref += 1
      college = 0
      semester += 1
# no current year reports
else:
   pass

# deleting all pdfs and csvs
filelist1 = glob.glob(os.path.join(r"C:\Users\jd721\bthoRegistration\gradepdfs", "*.pdf"))
filelist2 = glob.glob(os.path.join(r"C:\Users\jd721\bthoRegistration\gradecsvs", "*.csv"))
for f in filelist1:
   os.remove(f)
for f in filelist2:
   os.remove(f)