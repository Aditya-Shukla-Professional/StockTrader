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

<h2>🗃️ Folder Structure</h2>
<pre>
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
</pre>

<hr>

<h2>⚙️ How to Run It Locally</h2>

<h3>1. Fork and Clone</h3>
<pre>
git clone https://github.com/Aditya-Shukla-Professional/StockTrader.git
cd StockTrader
</pre>

<h3>2. Install Dependencies</h3>
<pre>
npm install
</pre>

<h3>3. Setup MySQL Database</h3>
<ul>
  <li>Create a MySQL database</li>
  <li>Configure connection details in <code>db.js</code></li>
  <li>Import your SQL schema (if provided separately)</li>
</ul>

<h3>4. Start the Server</h3>
<pre>
nodemon index.js
</pre>
<p><em>(If you don't have <code>nodemon</code>, install it with <code>npm install -g nodemon</code>)</em></p>

<h3>5. Open in Browser</h3>
<pre>
http://localhost:3000
</pre>
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

* * *

### Connect with me:

<p align="left">
<a href="https://www.linkedin.com/in/aditya-shukla-8b3494341/" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/linked-in-alt.svg" alt="aditya shukla" height="30" width="40" /></a>
</p>

**Made with ❤️ by Aditya Shukla**

