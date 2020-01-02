# -*- coding: utf-8 -*-
"""
Created on Wed May  1 10:27:10 2019

@author: Jonathan Rogers
"""

import os
import shutil
import csv
import sqlite3

# left, mid, and right functions
def left(s, amount):
    return s[:amount]

def right(s, amount):
    return s[-amount:]

def mid(s, offset, amount):
    return s[offset:offset+amount]

# initialize database
db = sqlite3.connect('grades.db')
c = db.cursor()
c.execute("""CREATE TABLE grades (
            instructor TEXT, 
            class TEXT, 
            numAs INTEGER, 
            numBs INTEGER, 
            numCs INTEGER, 
            numDs INTEGER, 
            numFs INTEGER, 
            numQs INTEGER
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

# open csv file
os.chdir(r"C:\Users\jd721\bthoRegistration\gradecsvs")
with open("grd20141EN.csv") as csvfile:
   # read csv file
   readGrades = csv.reader(csvfile, delimiter=",")
   # iterate through row to grab useful data from .csv
   for row in readGrades:
      if (row[0] != "COURSE TOTAL:") & (row[0] != "DEPARTMENT TOTAL:") & (len(row[0]) > 6):
         # these if statements SHOULD account for an error in converting the .pdf to
         # a .csv file. Tabula is kinda wack. Maybe something that could be fixed.
         # Lol jk we'll wing it.
         if len(row) == 13:
            void = "OK"
            crs = left(row[0],4) + mid(row[0],5,3)
            A = int(row[1])
            B = int(row[2])
            Q = int(float(row[10]))
            instr = right(row[12],(len(row[12]) - row[12].find(" ") - 1))
            if row[4] == "":
               C = int(left(row[3],(row[3].find(" "))))
               D = int(right(row[3],len(row[3]) - row[3].find(" ") - 1))
               F = int(row[5])
            elif row[5] == "":
               if row[4].count(" ") == 1:
                  C = int(row[3])
                  D = int(left(row[4],(row[4].find(" "))))
                  F = int(right(row[4],len(row[4]) - row[4].find(" ") - 1))
               elif row[3].count(" ") == 1:
                  C = int(left(row[3],(row[3].find(" "))))
                  D = int(right(row[3],len(row[3]) - row[3].find(" ") - 1))
                  F = int(row[4])
               # this is where you get boned because tabula is garbo so im just 
               # ignoring these instances.
               else:
                  void = "VOID"
            else:
               C = int(row[3])
               D = int(row[4])
               F = int(row[5])
         elif len(row) == 15:
            crs = left(row[0],4) + mid(row[0],5,3)
            A = int(row[1])
            B = int(row[2])
            C = int(row[3])
            D = int(row[4])
            F = int(row[5])
            Q = int(float(row[11]))
            instr = row[14]
         else:
            raise Exception('Need to account for a new version of csv format. Sry, I know it sucks to see this. ;(')
         # add values to array
         if void != "VOID":
            temp = Grade(instr,crs,A,B,C,D,F,Q)
            c.execute("INSERT INTO grades VALUES (?, ?, ?, ?, ?, ?, ?, ?)", (temp.instructor, temp.clas, temp.numAs, temp.numBs, temp.numCs, temp.numDs, temp.numFs, temp.numQs))
            db.commit()