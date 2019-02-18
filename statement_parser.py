import argparse
import csv
from collections import defaultdict
from operator import itemgetter
from itertools import groupby
import datetime
import json
import os

#######################
### GLOBAL VARIABLES
#######################

# Accounts
AMEX = './Amex'
CHASE = './Chase'
DISCOVER = './Discover'

# Transactions
TRANSACTIONS = []

# Aliases
ALIASES = {
    'Austin Bouldering': ['Austin Bouldering Project', 'CLIMBING'],
    'AUSTIN BOULDERING': ['Austin Bouldering Project', 'CLIMBING'],
    'CRUX CLIMBING CENTER': ['Crux Climbing Center', 'CLIMBING'],
    'REI': ['REI', 'CLIMBING'],
    'BROOKLYN BOULDERS': ['Brooklyn Boulders', 'CLIMBING'],
    'AUSTIN INSPIRED': ['Austin Inspired Movement', 'DANCING'],
    'AUSTIN SWING': ['Austin Swing Syndicate', 'DANCING'],
    'FOUR ON THE': ['Four On The Floor', 'DANCING'],
    'GO DANCE': ['Go Dance', 'DANCING'],
    'AUSTIN LINDY': ['Austin Lindy Exchange', 'DANCING'],
    'Blackrock': ['Rent', 'ESSENTIALS'],
    'City of Austin': ['City of Austin Utilities', 'ESSENTIALS'],
    'Amerenil': ['Ameren Illinois', 'ESSENTIALS'],
    'GOOGLE': ['Google Fibre', 'ESSENTIALS'],
    'TMOBILE': ['T-Mobile', 'ESSENTIALS'],
    'T-MOBILE': ['T-Mobile', 'ESSENTIALS'],
    'RENT': ['Rent', 'ESSENTIALS'],
    'STEAM': ['Steam', 'GAMING'],
    'CRUNCHYROLL': ['Crunchyroll', 'SUBSCRIPTIONS'],
    'MOVIEPASS': ['Moviepass', 'SUBSCRIPTIONS'],
    'Netflix': ['Netflix', 'SUBSCRIPTIONS'],
    'SPOTIFY': ['Spotify', 'SUBSCRIPTIONS'],
    'CAPITAL METRO': ['Capital Metro', 'TRANSPORTATION'],
    'LYFT': ['Lyft', 'TRANSPORTATION'],
    'UBER': ['Uber', 'TRANSPORTATION'],
    'GROUNDSHUTTLE.COM': ['Groundshuttle', 'TRANSPORTATION'],
    'MYTAXI.PH': ['Mytaxi.ph', 'TRANSPORTATION'],
    'AMAZON.COM': ['Amazon', 'AMAZON'],
    'AMZN MKTP': ['Amazon', 'AMAZON'],
    'AMAZON MKTPLACE': ['Amazon', 'AMAZON'],
    'PRIME VIDEO': ['Amazon Prime Video', 'AMAZON'],
    'AMERICAN AIRLINES': ['American Airlines', 'AIRLINES'],
    'AMERICANAIR': ['American Airlines', 'AIRLINES'],
    'DELTA AIR LINES': ['Delta Airlines', 'AIRLINES'],
    'EMIRATES': ['Emirates', 'AIRLINES'],
    'EVA AIR': ['Eva Air', 'AIRLINES'],
    'Pakistan Air': ['Pakistan Internation Airlines', 'AIRLINES'],
    'Qatar Airways': ['Qatar Airways', 'AIRLINES'],
    'Southwest Airlines': ['Southwest Airlines', 'AIRLINES'],
    'SW AIR': ['Southwest Airlines', 'AIRLINES'],
    'SPIRIT AIRLINES': ['Spirit Airlines', 'AIRLINES'],
    'UNITED AIRLINES': ['United Airlines', 'AIRLINES'],
    'WORLD FOOD': ['World Food', 'GROCERIES'],
    'H-E-B': ['H-E-B', 'GROCERIES'],
    'HEB': ['H-E-B', 'GROCERIES'],
    'WALMART': ['Walmart', 'GROCERIES'],
    'WAL-MART': ['Walmart', 'GROCERIES'],
    '7-ELEVEN': ['7-Eleven', 'GROCERIES'],
    'CVS': ['CVS', 'GROCERIES'],
    'MEIJER': ['Meijer', 'GROCERIES'],
    'AIRBNB': ['Airbnb', 'HOTELS'],
    'UPS': ['UPS', 'MAIL'],
    'USPS': ['USPS', 'MAIL'],
    'PARCEL PENDING INC': ['Parcel Pending Inc', 'MAIL'],
    'ESHIPGLOBAL': ['Eshipglobal', 'MAIL'],
    'SUPERCUTS': ['Supercuts', 'HAIRCUTS'],
    'Robinhood': ['Robinhood', 'INVESTMENTS'],
    'Coinbase.Com': ['Coinbase', 'INVESTMENTS'],
    'ALAMO': ['Alamo Drafthouse', 'ENTERTAINMENT'],
    'ZOMBIE CHARGE': ['Zombie Charge', 'ENTERTAINMENT'],
    'SILENT DISCO': ['Silent Disco', 'ENTERTAINMENT'],
    'Retailmenot Rmn Paymnt': ['RMN Reimbursements', 'INCOME'],
    'Retailmenot, Inc': ['RMN Reimbursements', 'INCOME'],
    'Retailmenot Inc Direct Dep': ['Salary', 'INCOME']
}

# Drop Labels
DROPS = [
    'Description',
    'INTERNET PAYMENT - THANK YOU', 
    'ONLINE PAYMENT - THANK YOU', 
    'PAYMENT RECEIVED - THANK YOU', 
    'Discover E-Payment', 
    'American Express ACH Pmt',
    'Online Transfer To Sav',
    'AMERICAN EXPRESS'
]


#######################
### HELPER FUNCTIONS
#######################

def to_date(string):
    return datetime.datetime.strptime(string, '%m/%d/%Y')


########################
### TRANSACTION CLASS
########################

class Transaction(object):
    def __init__(self, date, description, amount, category):
        self.date = to_date(date)
        self.description = description
        self.amount = amount
        self.category = category

    def __str__(self):
        return '{}, {}, {}, {:.2f}'.format(self.date.strftime('%m/%d/%Y'), self.category, self.description, self.amount)

    def to_json_str(self):
        tmp = self.__dict__
        tmp['date'] = tmp['date'].strftime('%m/%d/%Y')
        return json.dumps(tmp)

    def __repr__(self):
        return self.__str__()


#########################
### SORTING AND OUTPUT
#########################

def print_summary():
    return ''.join(['{} - {}\n'.format(category, sum(t.amount for t in group)) for category, group in groupby(TRANSACTIONS, key=lambda t: t.category)])

def print_transactions():
    return ''.join(['{}\n'.format(t) for t in TRANSACTIONS])

def print_transactions_json():
    return ',\n'.join(['\t{}'.format(t.to_json_str()) for t in TRANSACTIONS])

def sort_transactions_list(sort_key='date'):
    if sort_key == 'description':
        TRANSACTIONS.sort(key=lambda t: (t.category, t.description, t.date))
    elif sort_key == 'amount':
        TRANSACTIONS.sort(key=lambda t: (t.category, t.amount, t.date))
    else:    
        TRANSACTIONS.sort(key=lambda t: (t.category, t.date))

def transactions_to_str(sort_key, summary):
    val = ''

    total_income = sum([t.amount for t in TRANSACTIONS if t.category == 'INCOME'])
    total_expenses = sum([t.amount for t in TRANSACTIONS if t.category != 'INCOME']) * -1
    total_savings = total_income - total_expenses

    if summary:
        sort_transactions_list()
        val += print_summary()
    else:
        sort_transactions_list(sort_key)
        val += print_transactions()

    val += '\n============================\n\n'
    val += 'TOTAL INCOME:   {}\n'.format(total_income)
    val += 'TOTAL EXPENSES: {}\n'.format(total_expenses)
    val += 'TOTAL SAVINGS:  {}\n'.format(total_savings)

    return val

def transactions_to_json(sort_key):
    val = '[\n'
    sort_transactions_list(sort_key)
    val += print_transactions_json()
    val += '\n]'
    return val

#######################################
### TRANSACTION PROCESSING FUNCTIONS
#######################################

def is_useful_transaction(description):
    '''
    Returns True/False depending on whether the transaction description contains explicit
    String patterns found in the DROPS list.
    '''
    for label in DROPS:
        if label in description:
            return False

    return True

def extract_desc_and_category(description, amount):
    '''
    Looks up explicit String patterns in transaction descriptions:
        If a match is found, returns the standard descriptor and category type for the transaction.
        If amount is positive, returns [description, 'INCOME']
        Else returns [description, 'MISC']
    '''
    if amount > 0:
        return [description, 'INCOME']

    for label, values in ALIASES.items():
        if label in description:
            return values

    return [description, 'MISC']


def process_transaction(transaction):
    '''
    Add the transaction to the TRANSACTIONS list
    '''
    TRANSACTIONS.append(transaction)


###############################
### ACCOUNT SPECIFIC PARSERS
###############################

def process_amex(row):
    if is_useful_transaction(row[3]):
        date, description, amount = row[0], row[3], float(row[2].replace(',', ''))
        description, category = extract_desc_and_category(description, amount)
        return Transaction(date, description, amount, category)

    return None


def process_chase(row):
    if is_useful_transaction(row[1]):
        date, description, amount = row[0], row[1], float(row[2].replace(',', ''))
        description, category = extract_desc_and_category(description, amount)
        return Transaction(date, description, amount, category)

    return None


def process_discover(row):
    if is_useful_transaction(row[2]):
        date, description, amount = row[0], row[2], float(row[3].replace(',', '')) * -1.0
        description, category = extract_desc_and_category(description, amount)
        return Transaction(date, description, amount, category)

    return None


#############################
### GENERIC FILE PROCESSOR
#############################

def process_file(filename, callback, start_date, end_date):
    with open(filename, 'r') as file:
        for row in csv.reader(file, quotechar='"', delimiter=',', quoting=csv.QUOTE_ALL, skipinitialspace=True):
            try:
                # Ignore empty rows
                if row == []: continue

                # Use an appropriate parsing scheme for each Account Type
                transaction = callback(row)

                # Ignore useless rows
                if transaction == None: continue

                # If a start_date was specified, make sure the transaction is after the date
                if start_date != None and transaction.date < start_date: continue

                # If an end_date was specified, make sure the transaction is before the date
                if end_date != None and transaction.date > end_date: continue

                # Process the transaction
                process_transaction(transaction)

            except Exception as e:
                print('Couldn\'t parse row: {} in file: {}'.format(row, filename))
                raise e


function_switch = {
    AMEX: process_amex,
    CHASE: process_chase,
    DISCOVER: process_discover
}

###############################################
### LOOP DIRECTORIES AND CALL FILE PROCESSOR
###############################################

def process_csv_files_in_dir(dir, start_date, end_date):
    for file in os.listdir(dir):
        if file.endswith(".csv"):
            filepath = os.path.join(dir, file)
            # print('Processing {}'.format(filepath))
            process_file(filepath, function_switch[dir], start_date, end_date)


###########
### MAIN
###########

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Parses bank and credit card statements to extract and categorize expenses.')
    parser.add_argument('-s', help='Start date for transactions in format mm/dd/yyyy', type=to_date, dest='start_date')
    parser.add_argument('-e', help='End date for transactions in format mm/dd/yyyy', type=to_date, dest='end_date')
    parser.add_argument('-k', help='The sort key for outputting transactions', default='date', choices=['date', 'description', 'amount'], dest='sort_key')
    parser.add_argument('--summary', help='Whether to display individual transactions or not', default=False, action='store_true')
    args = parser.parse_args()

    for directory in [AMEX, CHASE, DISCOVER]:
        process_csv_files_in_dir(directory, args.start_date, args.end_date)

    print('\n\n')

    # print(transactions_to_str(args.sort_key, args.summary))
    print(transactions_to_json(args.sort_key))
