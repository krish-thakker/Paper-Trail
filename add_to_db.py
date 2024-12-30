import psycopg2
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

conn = psycopg2.connect(
    host=os.environ['DB_HOST'],
    database=os.environ['DB_NAME'],
    user=os.environ['DB_USER'],
    password=os.environ['DB_PASSWORD']
)
cur = conn.cursor()

# Insert data into the finances table
cur.execute('''
    INSERT INTO finances (month, checking_balance, stock_balance, income, credit_bill, other_expenses)
    VALUES 
        ('January', 1500.00, 1200.00, 3000.00, 200.00, 150.00),
        ('February', 1800.00, 1300.00, 3200.00, 250.00, 175.00),
        ('March', 1600.00, 1100.00, 3100.00, 220.00, 160.00),
        ('April', 1700.00, 1400.00, 3300.00, 275.00, 180.00),
        ('May', 1650.00, 1250.00, 3150.00, 230.00, 170.00);
''')


conn.commit()
cur.close()
conn.close()