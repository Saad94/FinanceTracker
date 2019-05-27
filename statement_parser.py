import argparse
import csv
from collections import defaultdict
from operator import itemgetter
from itertools import groupby
import datetime
import json
import os
import sys

#######################
### GLOBAL VARIABLES
#######################

# Accounts
AMEX = './Amex'
CHASE = './Chase'
DISCOVER = './Discover'

# Transactions
TRANSACTIONS = []

# Categories
CATEGORIES = {
  'AIRLINES': 'AIRLINES',
  'AMAZON': 'AMAZON',
  'APPAREL': 'APPAREL',
  'CHARITY': 'CHARITY',
  'DANCING': 'DANCING',
  'ENTERTAINMENT': 'ENTERTAINMENT',
  'ESSENTIALS': 'ESSENTIALS',
  'FITNESS': 'FITNESS',
  'GAMING': 'GAMING',
  'GIFTS': 'GIFTS',
  'GROCERIES': 'GROCERIES',
  'HAIRCUTS': 'HAIRCUTS',
  'HOTELS': 'HOTELS',
  'INCOME': 'INCOME',
  'INVESTMENTS': 'INVESTMENTS',
  'LOANS': 'LOANS',
  'MAIL': 'MAIL',
  'MISC': 'MISC',
  'ONE_TIME_SPENDING': 'ONE_TIME_SPENDING',
  'RESTAURANTS': 'RESTAURANTS',
  'SUBSCRIPTIONS': 'SUBSCRIPTIONS',
  'TRANSPORTATION': 'TRANSPORTATION'
}

# Aliases
ALIASES = {
  'AUSTIN INSPIRED'             : ['Austin Inspired Movement',      CATEGORIES['DANCING'],        ''              ],
  'AUSTIN SWING'                : ['Austin Swing Syndicate',        CATEGORIES['DANCING'],        ''              ],
  'FOUR ON THE'                 : ['Four On The Floor',             CATEGORIES['DANCING'],        ''              ],
  'GO DANCE'                    : ['Go Dance',                      CATEGORIES['DANCING'],        ''              ],
  'AUSTIN LINDY'                : ['Austin Lindy Exchange',         CATEGORIES['DANCING'],        ''              ],
  'Blackrock'                   : ['Rent',                          CATEGORIES['ESSENTIALS'],     ''              ],
  'City of Austin'              : ['City of Austin Utilities',      CATEGORIES['ESSENTIALS'],     ''              ],
  'Amerenil'                    : ['Ameren Illinois',               CATEGORIES['ESSENTIALS'],     ''              ],
  'GOOGLE'                      : ['Google Fibre',                  CATEGORIES['ESSENTIALS'],     ''              ],
  'TMOBILE'                     : ['T-Mobile',                      CATEGORIES['ESSENTIALS'],     ''              ],
  'T-MOBILE'                    : ['T-Mobile',                      CATEGORIES['ESSENTIALS'],     ''              ],
  'RENT'                        : ['Rent',                          CATEGORIES['ESSENTIALS'],     ''              ],
  'BAILEY APARTMENTS'           : ['Rent',                          CATEGORIES['ESSENTIALS'],     ''              ],
  'PRIVATEINTERNETACCESS'       : ['Private Internet Access VPN',   CATEGORIES['ESSENTIALS'],     ''              ],
  'COINTRACKER'                 : ['CoinTracker',                   CATEGORIES['ESSENTIALS'],     'Taxes'         ],
  'SPRINTAX'                    : ['Sprintax',                      CATEGORIES['ESSENTIALS'],     'Taxes'         ],
  'Austin Bouldering'           : ['Austin Bouldering Project',     CATEGORIES['FITNESS'],        'Climbing'      ],
  'AUSTIN BOULDERING'           : ['Austin Bouldering Project',     CATEGORIES['FITNESS'],        'Climbing'      ],
  'CRUX CLIMBING CENTER'        : ['Crux Climbing Center',          CATEGORIES['FITNESS'],        'Climbing'      ],
  'REI'                         : ['REI',                           CATEGORIES['FITNESS'],        'Climbing'      ],
  'BROOKLYN BOULDERS'           : ['Brooklyn Boulders',             CATEGORIES['FITNESS'],        'Climbing'      ],
  'URBANA BOULDERS'             : ['Urbana Boulders',               CATEGORIES['FITNESS'],        'Climbing'      ],
  'STEAM'                       : ['Steam',                         CATEGORIES['GAMING'],         ''              ],
  'CRUNCHYROLL'                 : ['Crunchyroll',                   CATEGORIES['SUBSCRIPTIONS'],  ''              ],
  'MOVIEPASS'                   : ['Moviepass',                     CATEGORIES['SUBSCRIPTIONS'],  ''              ],
  'Netflix'                     : ['Netflix',                       CATEGORIES['SUBSCRIPTIONS'],  ''              ],
  'SPOTIFY'                     : ['Spotify',                       CATEGORIES['SUBSCRIPTIONS'],  ''              ],
  'PATREON'                     : ['Patreon',                       CATEGORIES['SUBSCRIPTIONS'],  ''              ],
  'CAPITAL METRO'               : ['Capital Metro',                 CATEGORIES['TRANSPORTATION'], ''              ],
  'LYFT'                        : ['Lyft',                          CATEGORIES['TRANSPORTATION'], ''              ],
  'UBER'                        : ['Uber',                          CATEGORIES['TRANSPORTATION'], ''              ],
  'GROUNDSHUTTLE.COM'           : ['Groundshuttle',                 CATEGORIES['TRANSPORTATION'], ''              ],
  'MYTAXI.PH'                   : ['Mytaxi.ph',                     CATEGORIES['TRANSPORTATION'], ''              ],
  'AMTRAK'                      : ['Amtrak',                        CATEGORIES['TRANSPORTATION'], ''              ],
  'AMAZON.COM'                  : ['Amazon',                        CATEGORIES['AMAZON'],         ''              ],
  'AMZN MKTP'                   : ['Amazon',                        CATEGORIES['AMAZON'],         ''              ],
  'AMAZON MKTPLACE'             : ['Amazon',                        CATEGORIES['AMAZON'],         ''              ],
  'PRIME VIDEO'                 : ['Amazon Prime Video',            CATEGORIES['AMAZON'],         ''              ],
  'Amazon Prime'                : ['Amazon Prime',                  CATEGORIES['AMAZON'],         ''              ],
  'AMAZON WEB'                  : ['Amazon AWS',                    CATEGORIES['AMAZON'],         ''              ],
  'AMERICAN AIRLINES'           : ['American Airlines',             CATEGORIES['AIRLINES'],       ''              ],
  'AMERICANAIR'                 : ['American Airlines',             CATEGORIES['AIRLINES'],       ''              ],
  'DELTA AIR LINES'             : ['Delta Airlines',                CATEGORIES['AIRLINES'],       ''              ],
  'EMIRATES'                    : ['Emirates',                      CATEGORIES['AIRLINES'],       ''              ],
  'EVA AIR'                     : ['Eva Air',                       CATEGORIES['AIRLINES'],       ''              ],
  'Pakistan Air'                : ['Pakistan Internation Airlines', CATEGORIES['AIRLINES'],       ''              ],
  'Qatar Airways'               : ['Qatar Airways',                 CATEGORIES['AIRLINES'],       ''              ],
  'Southwest Airlines'          : ['Southwest Airlines',            CATEGORIES['AIRLINES'],       ''              ],
  'SW AIR'                      : ['Southwest Airlines',            CATEGORIES['AIRLINES'],       ''              ],
  'SPIRIT AIRLINES'             : ['Spirit Airlines',               CATEGORIES['AIRLINES'],       ''              ],
  'UNITED AIRLINES'             : ['United Airlines',               CATEGORIES['AIRLINES'],       ''              ],
  'WORLD FOOD'                  : ['World Food',                    CATEGORIES['GROCERIES'],      ''              ],
  'H-E-B'                       : ['H-E-B',                         CATEGORIES['GROCERIES'],      ''              ],
  'HEB'                         : ['H-E-B',                         CATEGORIES['GROCERIES'],      ''              ],
  'CENTRAL MARKET'              : ['Central Market',                CATEGORIES['GROCERIES'],      ''              ],
  'WALMART'                     : ['Walmart',                       CATEGORIES['GROCERIES'],      ''              ],
  'WAL-MART'                    : ['Walmart',                       CATEGORIES['GROCERIES'],      ''              ],
  '7-ELEVEN'                    : ['7-Eleven',                      CATEGORIES['GROCERIES'],      ''              ],
  'CVS'                         : ['CVS',                           CATEGORIES['GROCERIES'],      ''              ],
  'MEIJER'                      : ['Meijer',                        CATEGORIES['GROCERIES'],      ''              ],
  'COUNTY MARKET'               : ['County Market',                 CATEGORIES['GROCERIES'],      ''              ],
  'ANYDAY GROCERY'              : ['Anyday Grocery',                CATEGORIES['GROCERIES'],      ''              ],
  'THE AUSTINITE MARK'          : ['The Austinite Market',          CATEGORIES['GROCERIES'],      ''              ],
  'AIRBNB'                      : ['Airbnb',                        CATEGORIES['HOTELS'],         ''              ],
  'UPS'                         : ['UPS',                           CATEGORIES['MAIL'],           ''              ],
  'USPS'                        : ['USPS',                          CATEGORIES['MAIL'],           ''              ],
  'PARCEL PENDING INC'          : ['Parcel Pending Inc',            CATEGORIES['MAIL'],           ''              ],
  'ESHIPGLOBAL'                 : ['Eshipglobal',                   CATEGORIES['MAIL'],           ''              ],
  'SUPERCUTS'                   : ['Supercuts',                     CATEGORIES['HAIRCUTS'],       ''              ],
  'FINLEY\'S'                   : ['Finley\'s',                     CATEGORIES['HAIRCUTS'],       ''              ],
  'Robinhood'                   : ['Robinhood',                     CATEGORIES['INVESTMENTS'],    'Stocks'        ],
  'Coinbase.Com'                : ['Coinbase',                      CATEGORIES['INVESTMENTS'],    'Cryptocurrency'],
  'Betterment'                  : ['Betterment',                    CATEGORIES['INVESTMENTS'],    'Stocks'        ],
  'ALAMO'                       : ['Alamo Drafthouse',              CATEGORIES['ENTERTAINMENT'],  ''              ],
  'ZOMBIE CHARGE'               : ['Zombie Charge',                 CATEGORIES['ENTERTAINMENT'],  ''              ],
  'SILENT DISCO'                : ['Silent Disco',                  CATEGORIES['ENTERTAINMENT'],  ''              ],
  'AMC BARTON CREEK'            : ['AMC',                           CATEGORIES['ENTERTAINMENT'],  ''              ],
  'TOPGOLF'                     : ['Top Golf',                      CATEGORIES['ENTERTAINMENT'],  ''              ],
  'URBAN AXES'                  : ['Urban Axes',                    CATEGORIES['ENTERTAINMENT'],  ''              ],
  'Retailmenot Rmn Paymnt'      : ['RMN Reimbursements',            CATEGORIES['INCOME'],         ''              ],
  'Retailmenot, Inc'            : ['RMN Reimbursements',            CATEGORIES['INCOME'],         ''              ],
  'Retailmenot Inc Direct Dep'  : ['Salary',                        CATEGORIES['INCOME'],         ''              ],
  'CHIPOTLE'                    : ['Chipotle',                      CATEGORIES['RESTAURANTS'],    ''              ],
  'TORCHYS TACOS'               : ['Salary',                        CATEGORIES['RESTAURANTS'],    ''              ],
  'SNOOZE'                      : ['Snooze: An AM Eatery',          CATEGORIES['RESTAURANTS'],    ''              ],
  'DONFOODTRUCK'                : ['Don\'s Japanese Kitchen',       CATEGORIES['RESTAURANTS'],    ''              ],
  'RAMEN TATSU-YA'              : ['Ramen Tatsu Ya',                CATEGORIES['RESTAURANTS'],    ''              ],
  'THE WHITE HORSE'             : ['The White Horse',               CATEGORIES['RESTAURANTS'],    ''              ],
  'SHAKE SHACK'                 : ['Shake Shack',                   CATEGORIES['RESTAURANTS'],    ''              ],
  'HALCYON'                     : ['Halcyon',                       CATEGORIES['RESTAURANTS'],    ''              ],
  'DFG NOODLES'                 : ['DFG Noodles',                   CATEGORIES['RESTAURANTS'],    ''              ],
  'SA-TEN'                      : ['Sa-Ten',                        CATEGORIES['RESTAURANTS'],    ''              ],
  'P TERRYS'                    : ['P-Terrys',                      CATEGORIES['RESTAURANTS'],    ''              ],
  'TRUE FOOD KITCHEN'           : ['True Food Kitchen',             CATEGORIES['RESTAURANTS'],    ''              ],
  'LA TRAVIATA'                 : ['La Traviata',                   CATEGORIES['RESTAURANTS'],    ''              ],
  'MAI THAI AUSTIN'             : ['Mai Thai',                      CATEGORIES['RESTAURANTS'],    ''              ],
  'PINTHOUSE PIZZA'             : ['Pinthouse Pizza',               CATEGORIES['RESTAURANTS'],    ''              ],
  'COLDSTONE '                  : ['Coldstone Creamery',            CATEGORIES['RESTAURANTS'],    ''              ],
  'TRUE FOOD KITCHEN'           : ['True Food Kitchen',             CATEGORIES['RESTAURANTS'],    ''              ],
  'CAVA GRILL'                  : ['Cava',                          CATEGORIES['RESTAURANTS'],    ''              ],
  'DOWNTOWN JOS'                : ['Jo\'s Coffee',                  CATEGORIES['RESTAURANTS'],    ''              ],
  'GUSS FRIED CHICKEN'          : ['Gus\'s Fried Chicken',          CATEGORIES['RESTAURANTS'],    ''              ],
  'DUNKIN'                      : ['Dunkin\' Donuts',               CATEGORIES['RESTAURANTS'],    ''              ],
  'CHILANTRO'                   : ['Chilantro',                     CATEGORIES['RESTAURANTS'],    ''              ],
  'PAPADOM'                     : ['Papadom',                       CATEGORIES['RESTAURANTS'],    ''              ],
  'SUMMERMOON'                  : ['Summermoon',                    CATEGORIES['RESTAURANTS'],    ''              ],
  'GELATERIA GEMELLI'           : ['Gelateria Gemelli',             CATEGORIES['RESTAURANTS'],    ''              ],
  'TURF N SURF PO BOY'          : ['Turn \'n Surf Po Boy',          CATEGORIES['RESTAURANTS'],    ''              ],
  'COMBO DONUTS'                : ['Combo Donuts',                  CATEGORIES['RESTAURANTS'],    ''              ],
  'SUSHI JUNAI'                 : ['Sushi Junai',                   CATEGORIES['RESTAURANTS'],    ''              ],
  'QDOBA'                       : ['Qdoba',                         CATEGORIES['RESTAURANTS'],    ''              ],
  'IHOP'                        : ['Ihop',                          CATEGORIES['RESTAURANTS'],    ''              ],
  'BARCHI SUSHI'                : ['Barchi Sushi',                  CATEGORIES['RESTAURANTS'],    ''              ],
  'KEBABALICIOUS'               : ['Kebabalicious',                 CATEGORIES['RESTAURANTS'],    ''              ],
  'CHICK-FIL-A'                 : ['Chick-fil-A',                   CATEGORIES['RESTAURANTS'],    ''              ],
  'RA SUSHI'                    : ['Ra Sushi',                      CATEGORIES['RESTAURANTS'],    ''              ],
  'HANDLEBAR'                   : ['Handlebar',                     CATEGORIES['RESTAURANTS'],    ''              ],
  'VIA313'                      : ['Via 313',                       CATEGORIES['RESTAURANTS'],    ''              ],
  'HOP DODDY'                   : ['Hopdoddy\'s',                   CATEGORIES['RESTAURANTS'],    ''              ],
  'NI-KOME'                     : ['Ni-Kome Sushi',                 CATEGORIES['RESTAURANTS'],    ''              ],
  'MAGNOLIA CAFE'               : ['Magnolia Cafe',                 CATEGORIES['RESTAURANTS'],    ''              ],
  'GOURDOUGH\'S'                : ['Gourdough\'s',                  CATEGORIES['RESTAURANTS'],    ''              ]
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
  'AMERICAN EXPRESS',
  'Venmo Cashout',
  'Venmo Payment',
  'Online Transfer From Sav',
  'Paypal Transfer',
  'Paypal Inst'
]


##################
### ENCRYPTION ###
###################

def encrypt(data):
  key = None

  with open('./display/.env', 'r') as f:
    for line in f:
      if line.startswith('KEY'):
        key = line.strip().split('=')[1]

  if key is None or len(key) == 0:
    print('\nCould not load encryption key! Exiting!\n')
    sys.exit(1)

  result = '';

  for i in range(0, len(data)):
    result += chr(ord(key[i % len(key)]) ^ ord(data[i]));
  
  return result;


#######################
### HELPER FUNCTIONS
#######################

def to_date(string):
  return datetime.datetime.strptime(string, '%m/%d/%Y')


def load_data_file():
  with open ('./display/src/server/data/data.json', 'r') as f:
    result = []
    data = json.loads(encrypt(f.read()))

    for obj in data:
      result.append(Transaction(obj['date'], obj['description'], obj['amount'], obj['category'], obj['tag']))

  return result;

########################
### TRANSACTION CLASS
########################

class Transaction(object):

  idCounter = 0
  
  def __init__(self, date, description, amount, category, tag):
    self.id = Transaction.idCounter
    self.date = to_date(date)
    self.description = description
    self.amount = amount
    self.category = category
    self.tag = tag
    Transaction.idCounter += 1

  def __str__(self):
    return '{}, {}, {}, {}, {}, {:.2f}'.format(self.id, self.date.strftime('%m/%d/%Y'), self.tag, self.category, self.description, self.amount)

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
  return ''.join(['{}: {}\n'.format(category.ljust(20), sum(t.amount for t in group)) for category, group in groupby(TRANSACTIONS, key=lambda t: t.category)])

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

def summarize_transactions(sort_key):
  val = ''

  total_income = sum([t.amount for t in TRANSACTIONS if t.category == 'INCOME'])
  total_expenses = sum([t.amount for t in TRANSACTIONS if t.category != 'INCOME']) * -1
  total_savings = total_income - total_expenses

  sort_transactions_list()
  val += print_summary()

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

def extract_desc_and_category_and_tag(description, amount):
  '''
  Looks up explicit String patterns in transaction descriptions:
    If a match is found, returns the standard descriptor and category type for the transaction.
    If amount is positive, returns [description, 'INCOME']
    Else returns [description, 'MISC']
  '''
  for label, values in ALIASES.items():
    if label in description:
      return values

  if amount > 0:
    return [description, 'INCOME', '']

  return [description, CATEGORIES['MISC'], '']


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
    description, category, tag = extract_desc_and_category_and_tag(description, amount)
    return Transaction(date, description, amount, category, tag)

  return None


def process_chase(row):
  if is_useful_transaction(row[1]):
    date, description, amount = row[0], row[1], float(row[2].replace(',', ''))
    description, category, tag = extract_desc_and_category_and_tag(description, amount)
    return Transaction(date, description, amount, category, tag)

  return None


def process_discover(row):
  if is_useful_transaction(row[2]):
    date, description, amount = row[0], row[2], float(row[3].replace(',', '')) * -1.0
    description, category, tag = extract_desc_and_category_and_tag(description, amount)
    return Transaction(date, description, amount, category, tag)

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
      process_file(filepath, function_switch[dir], start_date, end_date)

def process_csv_files_in_list(files, start_date, end_date):
  for file in files:
    if os.path.isfile(file):
      if file.startswith('./'):
        file = file[2:]
      if file.endswith('.csv'):
        process_file(file, function_switch['./'+file.split('/')[0]], start_date, end_date)
    else:
      print('\nFile <{}> does not exist! Exiting!\n'.format(file))
      sys.exit(1)


###########
### MAIN
###########

if __name__ == '__main__':
  parser = argparse.ArgumentParser(description='Parses bank and credit card statements to extract and categorize expenses.')
  parser.add_argument('-s', help='Start date for transactions in format mm/dd/yyyy', type=to_date, dest='start_date')
  parser.add_argument('-e', help='End date for transactions in format mm/dd/yyyy', type=to_date, dest='end_date')
  parser.add_argument('-k', help='The sort key for outputting transactions', default='date', choices=['date', 'description', 'amount'], dest='sort_key')
  parser.add_argument('--summary', help='Whether to display individual transactions or not', default=False, action='store_true')
  parser.add_argument('-f', dest='files', type=str, nargs='+', help='the list of files to process')
  parser.add_argument('-r', dest='rerun', default=False, action='store_true', help='Whether to reprocess all raw files. Uses current data.json by default.')
  args = parser.parse_args()

  if args.rerun:
    for directory in [AMEX, CHASE, DISCOVER]:
      process_csv_files_in_dir(directory, args.start_date, args.end_date)
  else:
    TRANSACTIONS = load_data_file()

  if args.files:
    process_csv_files_in_list(args.files, args.start_date, args.end_date)

  if args.summary:
    print(summarize_transactions(args.sort_key))
  else:
    with open('data.json', 'w') as f:
      f.write(encrypt(transactions_to_json(args.sort_key)))

  # summaries = defaultdict(lambda: defaultdict(lambda: defaultdict(int)))

  # for t in TRANSACTIONS:
  #   date = t.date.strftime('%m/%d/%Y')
  #   mm, dd, yyyy = date.split('/')

  #   if t.category == 'INCOME':
  #     summaries[yyyy][mm]['income'] += t.amount
  #   elif t.category == 'INVESTMENTS':
  #     summaries[yyyy][mm]['investments'] += t.amount
  #   else:
  #     summaries[yyyy][mm]['expenses'] += t.amount

  #     if t.category == 'GIFTS':
  #       summaries[yyyy][mm]['gifts'] += t.amount
  #     elif t.category == 'LOANS':
  #       summaries[yyyy][mm]['loans'] += t.amount
  #     elif t.category == 'CHARITY':
  #       summaries[yyyy][mm]['charity'] += t.amount

  # total_savings = 0
  # total_loans = 0
  # total_gifts = 0
  # total_charity = 0
  # total_investments = 0

  # for yyyy, months in sorted(summaries.items()):
  #   for mm, data in sorted(months.items()):
  #     data['savings'] = data['income'] + data['expenses']

  #     total_savings += data['savings']
  #     total_loans += data['loans']
  #     total_gifts += data['gifts']
  #     total_charity += data['charity']
  #     total_investments += data['investments']

  #     data['total_savings'] = total_savings
  #     data['total_loans'] = total_loans
  #     data['total_gifts'] = total_gifts
  #     data['total_charity'] = total_charity
  #     data['total_investments'] = total_investments

  # for year, months in sorted(summaries.items()):
  #   print(year)
  #   for month, data in sorted(months.items()):
  #     print(month, data)