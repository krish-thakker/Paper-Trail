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

# Create the finances table
cur.execute('''
    CREATE TABLE finances (
        id serial PRIMARY KEY,
        month DATE NOT NULL,
        checking_balance numeric(10, 2) NOT NULL,
        stock_balance numeric(10, 2) NOT NULL,
        income numeric(10, 2) NOT NULL,
        credit_bill numeric(10, 2) NOT NULL,
        other_expenses numeric(10,2) NOT NULL,
        net_worth numeric(10, 2),
        money_added numeric(10, 2)
    );
''')

conn.commit()
cur.close()
conn.close()
