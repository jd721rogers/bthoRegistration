import urllib.request
import os

os.chdir(r"C:\Users\jd721\bthoRegistration\push\datascraping\gradepdfs")
file_name = "test.pdf"
download_url = "https://web-as.tamu.edu/GradeReports/PDFReports/20191/grd20191EN.pdf"

urllib.request.urlretrieve(download_url,file_name)