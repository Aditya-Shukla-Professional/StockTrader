📊 AdiTrader - Paper Trading Simulator
======================================

**AdiTrader** is a stock market paper trading simulator that lets users buy/sell US stocks using fake money. It fetches **real-time stock prices (updated every 8 seconds)** and simulates a simple investing experience.

🚀 [**Try Live Demo**](https://stocktrader-g4o0.onrender.com)

* * *

✨ Features
----------

*   User Login & Session Management
*   Buy/Sell US Stocks (paper trading only)
*   Real-time price updates (every 8 seconds)
*   "Add Money" button (top right) to inject fake funds
*   Responsive frontend made with EJS + CSS + JavaScript

* * *

🗃️ Folder Structure
--------------------

├── public/
│   ├── styles/         ← Contains CSS files for the EJS templates
│   └── brain/          ← Contains browser JavaScript (main.js)
├── views/
│   ├── index.ejs       ← Home page after login
│   └── login.ejs       ← Login/signup page
├── db.js               ← MySQL connection and queries
├── index.js            ← Main Node.js backend file
├── package.json        ← Node.js project file
├── .gitignore
└── README.md

* * *

⚙️ How to Run It Locally
------------------------

### 1\. Fork and Clone

git clone https://github.com/<Aditya-Shukla-Professional>/StockTrader.git
cd StockTrader

### 2\. Install Dependencies

npm install

### 3\. Setup MySQL Database

*   Create a MySQL database
*   Configure connection details in `db.js`
*   Import your SQL schema (if provided separately)

### 4\. Start the Server

nodemon index.js

_(If you don't have `nodemon`, install it with `npm install -g nodemon`)_

### 5\. Open in Browser

http://localhost:3000

* * *

🧠 Tech Stack
-------------

*   **Frontend:** HTML, CSS, EJS, JavaScript
*   **Backend:** Node.js, Express.js
*   **Database:** MySQL (Clever Cloud)
*   **Hosting:** Render (server) + Clever Cloud (MySQL)

* * *

⚠️ Disclaimer
-------------

*   This is a student project using **free hosting services**.
*   You may experience **slow loading or downtime**.
*   All trading is simulated — **no real money or accounts** involved.

* * *

🙌 Contributing
---------------

Feel free to fork and improve! Pull requests are welcome for feature improvements or bug fixes.

**Made with ❤️ by Aditya Shukla**
