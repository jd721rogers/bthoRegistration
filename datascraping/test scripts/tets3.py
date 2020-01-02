import requests
import os

os.chdir(r"C:\Users\jd721\bthoRegistration\push\datascraping\gradepdfs")
file_name = "test.pdf"
download_url = "https://web-as.tamu.edu/GradeReports/PDFReports/20101/grd20101CP_PROF.pdf"
r = requests.get(download_url,verify=False)
print(str(r.content).find("The resource you are looking for might have been removed, had its name changed, or is temporarily unavailable"))
if (str(r.content).find("The resource you are looking for might have been removed, had its name changed, or is temporarily unavailable") == -1):

   with open(file_name,"wb") as p:
      p.write(r.content)
      p.close()