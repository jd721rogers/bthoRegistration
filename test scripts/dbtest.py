# learning to create a database file

import sqlite3

db = sqlite3.connect('grades.db')

c = db.cursor()

# c.execute("""CREATE TABLE grades (
#             instructor TEXT, 
#             class TEXT, 
#             numAs INTEGER, 
#             numBs INTEGER, 
#             numCs INTEGER, 
#             numDs INTEGER, 
#             numFs INTEGER, 
#             numQs INTEGER
#             )""")

# c.execute("INSERT INTO grades VALUES ('Aurispa', 'MATH251', '137', '32', '7', '2', '0', '5')")
c.execute("SELECT * FROM grades WHERE instructor='Aurispa'")

print(c.fetchall())

db.commit()
db.close()