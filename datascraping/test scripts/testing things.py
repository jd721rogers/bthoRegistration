#just for testing purposes cause im an idiot who knows nothin abt python

import os
import csv

os.chdir(r"C:\Users\jd721\bthoRegistration\gradecsvs")
with open("grd20141EN.csv") as csvfile:
    readGrades = csv.reader(csvfile, delimiter=",")
    for row in readGrades:
        print(len(row))