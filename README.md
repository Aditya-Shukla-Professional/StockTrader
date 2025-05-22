<h1>📊 AdiTrader - Paper Trading Simulator</h1>

<p><strong>AdiTrader</strong> is a stock market paper trading simulator that lets users buy/sell US stocks using fake money. It fetches <strong>real-time stock prices (updated every 8 seconds)</strong> and simulates a simple investing experience.</p>

<p>🚀 <a href="https://stocktrader-g4o0.onrender.com" target="_blank"><strong>Try Live Demo</strong></a></p>

<hr>

<h2>✨ Features</h2>
<ul>
  <li>User Login & Session Management</li>
  <li>Buy/Sell US Stocks (paper trading only)</li>
  <li>Real-time price updates (every 8 seconds)</li>
  <li>"Add Money" button (top right) to inject fake funds</li>
  <li>Responsive frontend made with EJS + CSS + JavaScript</li>
</ul>

<hr>

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
git clone https://github.com/&lt;Aditya-Shukla-Professional&gt;/StockTrader.git
cd AdiTrader
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

<hr>

<h2>🧠 Tech Stack</h2>
<ul>
  <li><strong>Frontend:</strong> HTML, CSS, EJS, JavaScript</li>
  <li><strong>Backend:</strong> Node.js, Express.js</li>
  <li><strong>Database:</strong> MySQL (Clever Cloud)</li>
  <li><strong>Hosting:</strong> Render (server) + Clever Cloud (MySQL)</li>
</ul>

<hr>

<h2>⚠️ Disclaimer</h2>
<ul>
  <li>This is a student project using <strong>free hosting services</strong>.</li>
  <li>You may experience <strong>slow loading or downtime</strong>.</li>
  <li>All trading is simulated — <strong>no real money or accounts</strong> involved.</li>
</ul>

<hr>

<h2>🙌 Contributing</h2>
<p>Feel free to fork and improve! Pull requests are welcome for feature improvements or bug fixes.</p>

<p><strong>Made with ❤️ by Aditya Shukla</strong></p>
