import psycopg2
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

conn = psycopg2.connect(
    host='localhost',
    database=os.environ['DB_NAME'],
    user=os.environ['DB_USER'],
    password=os.environ['DB_PASSWORD']
)
cur = conn.cursor()

# Insert data into the finances table
cur.execute('''
    INSERT INTO finances (month, checking_balance, stock_balance, income, credit_bill, other_expenses)
    VALUES
        ('2025-01-01', 1500.00, 4000.00, 3500.00, 1200.00, 600.00),
        ('2025-02-01', 1800.00, 4500.00, 3800.00, 1300.00, 650.00),
        ('2025-03-01', 2000.00, 4600.00, 3900.00, 1400.00, 700.00),
        ('2025-04-01', 1700.00, 4200.00, 3700.00, 1250.00, 630.00),
        ('2025-05-01', 1900.00, 4800.00, 4000.00, 1350.00, 680.00),
        ('2025-06-01', 2200.00, 5000.00, 4200.00, 1500.00, 710.00),
        ('2025-07-01', 2100.00, 5100.00, 4300.00, 1450.00, 720.00),
        ('2025-08-01', 2300.00, 5300.00, 4400.00, 1550.00, 750.00);

''')

conn.commit()
cur.close()
conn.close()