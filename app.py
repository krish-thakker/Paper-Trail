import os
import psycopg2
from flask import Flask, jsonify, request
from dotenv import load_dotenv
from flask_cors import CORS

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing (CORS) for the frontend to access the API

def get_db_connection():
    conn = psycopg2.connect(
        host='localhost',
        database=os.environ['DB_NAME'],
        user=os.environ['DB_USER'],
        password=os.environ['DB_PASSWORD']
    )
    return conn

@app.route('/api/finances', methods=['GET'])
def get_records():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM finances;')
    finances = cur.fetchall()
    cur.close()
    conn.close()

    # Format finances as a list of dictionaries for easier JSON conversion
    finances_list = [
        {'id': finance[0], 'month': finance[1], 'checking_balance': finance[2], 'stock_balance': finance[3],
         'income': finance[4], 'credit_bill': finance[5], 'other_expenses': finance[6]}
        for finance in finances
    ]
    return jsonify(finances_list)

@app.route('/api/finances', methods=['POST'])
def create_record():
    data = request.get_json()  # Get the JSON data sent in the request body

    month = data.get('month')
    checking_balance = data.get('checking_balance')
    stock_balance = data.get('stock_balance')
    income = data.get('income')
    credit_bill = data.get('credit_bill')
    other_expenses = data.get('other_expenses')

    conn = get_db_connection()
    cur = conn.cursor()

    # Check if the record for the given month already exists
    cur.execute('SELECT * FROM finances WHERE month = %s', (month,))
    existing_record = cur.fetchone()

    if existing_record:
        # Update the existing record
        cur.execute('''
            UPDATE finances
            SET checking_balance = %s,
                stock_balance = %s,
                income = %s,
                credit_bill = %s,
                other_expenses = %s
            WHERE month = %s
        ''', (checking_balance, stock_balance, income, credit_bill, other_expenses, month))
    else:
        # Insert a new record
        cur.execute('''
            INSERT INTO finances (month, checking_balance, stock_balance, income, credit_bill, other_expenses)
            VALUES (%s, %s, %s, %s, %s, %s)
        ''', (month, checking_balance, stock_balance, income, credit_bill, other_expenses))

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({'message': 'Finance record created or updated successfully!'}), 201

if __name__ == '__main__':
    app.run(debug=True)