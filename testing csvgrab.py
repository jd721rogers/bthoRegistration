# -*- coding: utf-8 -*-
"""
Created on Wed May  1 10:27:10 2019

@author: jd721
"""


import csv

# left, mid, and right functions
def left(s, amount):
    return s[:amount]

def right(s, amount):
    return s[-amount:]

def mid(s, offset, amount):
    return s[offset:offset+amount]

with open("grd20131AG.csv") as csvfile:
   courses = []
   As = []
   Bs = []
   Cs = []
   Ds = []
   Fs = []
   Qs = []
   instructors = []
   readGrades = csv.reader(csvfile, delimiter=",")
   # iterate through row to grab useful data from .csv
   for row in readGrades:
      crs = row[0]
      A = row[1]
      B = row[2]
      C = left(row[3],(row[3].find(" ")))
      # these if statements account for an error in converting the .pdf to\
      # a .csv file. Maybe something that could be fixed if the tabula python\
      # code was used manually to grab the data.
      if row[4] == "":
         if row[3].count(" ") == 2:
            F = right(row[3],(len(row[3]) - row[3].rfind(" ")) - 1)
            D = mid(row[3],row[3].find(" ") + 1,(row[3].rfind(" ") - row[3].find(" ")))
         else:
            F = "na"
            D = "na"
      else:
         D = right(row[3],(len(row[3]) - row[3].find(" ")) - 1)
         F = row[4]
      Q = row[6]
      instr = right(row[8],(len(row[8]) - row[8].find(" ")))
      
      # add values to array
      courses.append(crs)
      As.append(A)
      Bs.append(B)
      Cs.append(C)
      Ds.append(D)
      Fs.append(F)
      Qs.append(Q)
      instructors.append(instr)
#   print(Fs)
      