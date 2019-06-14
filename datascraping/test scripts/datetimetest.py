from datetime import datetime

today = datetime.today()
mon = today.month
print(mon)

if ((mon == 6) or (mon == 7) or (mon == 8)):
    print("Hello World")