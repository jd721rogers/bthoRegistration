import certifi
import urllib3
import os

http = urllib3.PoolManager(cert_file=r"C:\Users\jd721\bthoRegistration\push\tamucert.cer",cert_reqs='CERT_REQUIRED',ca_certs=certifi.where())
os.chdir(r"C:\Users\jd721\bthoRegistration\push\datascraping\gradepdfs")
file_name = "test.pdf"
download_url = "https://web-as.tamu.edu/GradeReports/PDFReports/20191/grd20191EN.pdf"

r = http.request('GET', download_url, preload_content=False)
f = open(file_name, 'wb')
f.write(r.read())
f.close()
r.release_conn()