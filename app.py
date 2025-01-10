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
    # return jsonify({"data": "some data"})
    return df

@app.route('/api/finances', methods=['GET'])
def get_records():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM finances ORDER BY month ASC;')
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
    try:
        data = request.get_json()  # Get the JSON data sent in the request body

        # Ensure all required fields are present
        required_fields = ['month', 'checking_balance', 'stock_balance', 'income', 'credit_bill', 'other_expenses', 'money_added']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400


        data = request.get_json()  # Get the JSON data sent in the request body
        month = data.get('month')  # This will be in the format 'YYYY-MM'
        
        # Ensure the month is a valid date (e.g., '2025-02' becomes '2025-02-01')
        if month:
            month = f"{month}-01"  # Adding '-01' to treat it as the first day of the month
        
        checking_balance = data['checking_balance']
        stock_balance = data['stock_balance']
        income = data['income']
        credit_bill = data['credit_bill']
        other_expenses = data['other_expenses']
        money_added = data['money_added']
        stock_growth = data.get('stock_growth')
        net_worth = float(checking_balance) + float(stock_balance)  # Calculates net worth

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
                WHERE month = %s
            ''', (checking_balance, stock_balance, income, credit_bill, other_expenses, net_worth, money_added, month))
        else:
            # Insert a new record
            cur.execute('''
                INSERT INTO finances (month, checking_balance, stock_balance, income, credit_bill, other_expenses, net_worth, money_added)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            ''', (month, checking_balance, stock_balance, income, credit_bill, other_expenses, net_worth, money_added))

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({'message': 'Finance record created or updated successfully!'}), 201

    except Exception as e:
        # Log the error and return a helpful message
        print(f"Error: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500


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

def calculate_average_growth(df):
    # Calculate the average stock growth
    avg_growth_rate = df['stock_growth'].mean()
    print(f"Average Monthly Stock Growth: {avg_growth_rate:.2f}%")
    return avg_growth_rate / 100  # Convert percentage to multiplier

@app.route('/api/projected_growth', methods=['GET'])
def projected_growth():
    # Get the finance data
    df = get_finance_data()

    # Ensure 'stock_growth' column exists and contains numeric values
    if 'stock_growth' not in df.columns or not pd.api.types.is_numeric_dtype(df['stock_growth']):
        return jsonify({'error': 'Stock growth data is unavailable or invalid.'}), 400

    # User inputs: principal investment and timeframe
    principal = float(request.args.get('principal', 10000))  # Default to $10,000
    months = int(request.args.get('months', 12))  # Default to 12 months

    # Calculate the average growth rate
    avg_growth_rate = calculate_average_growth(df)

    # Project growth over the selected timeframe
    projections = []
    current_value = principal
    for i in range(1, months + 1):
        current_value *= (1 + avg_growth_rate)
        projections.append({"month": f"Month {i}", "projected_value": round(current_value, 2)})

    return jsonify(projections)


# Add this new route to your Flask backend:

# In your Flask backend, ensure your delete route looks exactly like this:

@app.route('/api/finances/<int:id>', methods=['DELETE'])
def delete_record(id):
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Check if record exists
        cur.execute('SELECT * FROM finances WHERE id = %s', (id,))
        record = cur.fetchone()
        
        if record is None:
            cur.close()
            conn.close()
            return jsonify({'error': 'Record not found'}), 404
            
        # Delete the record
        cur.execute('DELETE FROM finances WHERE id = %s', (id,))
        conn.commit()
        
        cur.close()
        conn.close()
        return jsonify({'message': 'Record deleted successfully'}), 200
        
    except Exception as e:
        print(f"Error deleting record: {str(e)}")  # Add this for debugging
        cur.close()
        conn.close()
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)