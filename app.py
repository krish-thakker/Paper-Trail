import os
import psycopg2
from flask import Flask, jsonify, request, send_file
from dotenv import load_dotenv
from flask_cors import CORS
import pandas as pd
import matplotlib.pyplot as plt
from io import BytesIO

# Load environment variables from .env file
load_dotenv()

# Test environment variables
print("DB Name:", os.getenv('DB_NAME'))  # This should print 'finances_tracker'
print("DB User:", os.getenv('DB_USER'))  # This should print 'postgres'
print("DB Password:", os.getenv('DB_PASSWORD'))  # This should print the password

app = Flask(__name__)
CORS(app, origins="http://localhost:3000")  # Enable Cross-Origin Resource Sharing (CORS) for the frontend to access the API

def get_db_connection():
    conn = psycopg2.connect(
        host='localhost',
        dbname=os.environ['DB_NAME'],
        user=os.environ['DB_USER'],
        password=os.environ['DB_PASSWORD']
    )
    return conn

def get_finance_data(): # for the line chart
    conn = get_db_connection()
    query = 'SELECT * FROM finances;'  # Adjust your query based on your actual schema
    df = pd.read_sql(query, conn)
    conn.close()
    return df

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
         'income': finance[4], 'credit_bill': finance[5], 'other_expenses': finance[6], 'net_worth': finance[7], 
         'money_added': finance[8], 'stock_growth': finance[9]}
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
    money_added = data.get('money_added')
    stock_growth = data.get('stock_growth')
    net_worth = checking_balance + stock_balance # Sets net worth

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
                other_expenses = %s,
                net_worth = %s,
                money_added = %s,
                stock_growth = %s
            WHERE month = %s
        ''', (checking_balance, stock_balance, income, credit_bill, other_expenses, net_worth, money_added, stock_growth, month))
    else:
        # Insert a new record
        cur.execute('''
            INSERT INTO finances (month, checking_balance, stock_balance, income, credit_bill, other_expenses, net_worth, money_added, stock_growth)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        ''', (month, checking_balance, stock_balance, income, credit_bill, other_expenses, net_worth, money_added, stock_growth))

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({'message': 'Finance record created or updated successfully!'}), 201

@app.route('/api/chart', methods=['GET'])
def generate_chart():
    # Get the finance data
    df = get_finance_data()

    # Convert 'month' column to datetime format
    df['month'] = pd.to_datetime(df['month'], format='%B %Y')
    print(df['month'])

    # Create the plot for checking_balance over time
    plt.figure(figsize=(10, 6))
    plt.plot(df['month'], df['checking_balance'], label='Checking Balance', color='blue')
    plt.title('Monthly Checking Balance')
    plt.xlabel('Month')
    plt.ylabel('Checking Balance ($)')
    plt.legend()
    plt.xticks(rotation=45)
    plt.tight_layout()

    # Save the plot to a BytesIO object to return as an image
    img = BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    plt.close()  # Close the plot to free memory

    # Send the image back to the client
    return send_file(img, mimetype='image/png')

if __name__ == '__main__':
    app.run(debug=True)