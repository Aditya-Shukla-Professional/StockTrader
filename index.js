import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import pool from "./db.js";
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

const __dirname=dirname(fileURLToPath(import.meta.url));
const app=express();
const port=process.env.PORT || 3000;
const API_KEY=process.env.API_KEY;
// const stocks = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA"];

app.use(session({
    secret: process.env.SESSION_SECRET, // A strong key for checking authenticity by the sever
    resave: false,
    saveUninitialized: true
}));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));

const [rows] = await pool.query("SELECT symbol FROM stocks");
const stocks = rows.map(row => row.symbol);

app.get("/", (req, res) => {  // used to get the login as the first page
    res.render("login");
  });

app.post("/login",async(req,res)=>{   // used to check if the user can login or signup
    const {email,username,password,action}=req.body;
    // console.log(req.body)
    if (action==="login"){  // used to login
        const [user]= await pool.query("SELECT * FROM users WHERE email = ? AND username = ? AND password = ?",[email,username,password])
        // console.log(user.length)
        if (user.length>0 && password.length>0){
            req.session.balance=user[0].balance
            req.session.userId= user[0].user_id
            req.session.username = username;
            res.redirect("/home");
        }
        else{
            res.send("Invalid Credentials, <a href='/'>Try again</a>")
        }
    }
    else if (action==="signup"){  // used to signup
        try{
          if (email.length>0 && password.length>0){
              await pool.query(`INSERT INTO users(email, username, password) VALUES(?,?,?)`,[email,username,password])
              const [user]= await pool.query("SELECT * FROM users WHERE email = ? AND username = ? AND password = ?",[email,username,password])
              req.session.balance=user[0].balance
              req.session.userId= user[0].user_id
              req.session.username = username;
              res.redirect("/home");
          }
          else{
              res.send("Invalid Credentials, <a href='/'>Try again</a>")
          }
        }
        catch (error) {
          if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).send("This email is already registered. Please log in.");
          } else {
            console.error(error);
            res.status(500).send("An error occurred. Please try again later.");
          }
        }

    }
})
app.get("/home", async (req, res) => {
  try {
    const allStockData = await Promise.all(
      stocks.map(async (stock) => {
        try {
          const result = await axios.get(
            `https://finnhub.io/api/v1/quote?symbol=${stock}&token=${API_KEY}`
          );
          return {stock_name: stock,price: result.data.c,};
        } catch (error) {
          console.error(`Error fetching ${stock}:`, error.response?.data || error.message);
          return {stock_name: stock,price: "N/A",error: "Failed to fetch data",};
        }
      })
    );

    const [holding_data] = await pool.query("SELECT h.total_quantity, h.avg_price_per_share, s.symbol FROM holdings h JOIN stocks s ON s.stock_id = h.stock_id WHERE user_id = ?",[req.session.userId]);

    res.render("index.ejs", {stocks: allStockData,name: req.session.username.charAt(0).toUpperCase() + req.session.username.slice(1),balance: req.session.balance,holdings: holding_data,});
  } catch (error) {
    console.error("Error in /home route:", error);
    res.status(500).send("Server Error");
  }
});


app.post("/buy",async(req,res)=>{
    const {stock, quantity, price}=req.body;
    const [stock_id]= await pool.query("SELECT stock_id FROM stocks WHERE symbol = ?",[stock])
    if (!stock || !quantity || !price) return res.status(400).send("Invalid Data");
    await pool.query("INSERT INTO transactions(user_id,stock_id,type,quantity,price_per_share) VALUES(?,?,?,?,?)",[req.session.userId,stock_id[0].stock_id,"BUY",quantity,price.slice(1)])
    const [existing] = await pool.query(
      "SELECT * FROM holdings WHERE user_id = ? AND stock_id = ?",
      [req.session.userId,stock_id[0].stock_id]
    );
    
    await pool.query("UPDATE users SET balance = balance - ? WHERE user_id = ?",[quantity*Number(price.slice(1)),req.session.userId])
    if (existing.length > 0) {
      // Update existing holding
      const oldQty = existing[0].total_quantity
      const oldPrice = parseFloat(existing[0].avg_price_per_share);
      const newQty = oldQty + parseInt(quantity,10);
      const newAvgPrice = ((oldQty * oldPrice) + (quantity * price.slice(1))) / newQty;

      await pool.query(
        "UPDATE holdings SET total_quantity = ?, avg_price_per_share = ? WHERE user_id = ? AND stock_id = ?",
        [newQty, newAvgPrice.toFixed(2), req.session.userId,stock_id[0].stock_id]
      );
      res.render("index.ejs",{holding:newQty,avg_price:newAvgPrice.toFixed(2)})
    } else {
      // Insert new holding
      await pool.query(
        "INSERT INTO holdings(user_id, stock_id, total_quantity, avg_price_per_share) VALUES (?, ?, ?, ?)",
        [req.session.userId,stock_id[0].stock_id, quantity, price.slice(1)]
      );
      res.render("index.ejs",{holding:quantity,avg_price:price.slice(1)})
    }
    // res.status(200).send("Buy order placed successfully");
    
})

app.post("/sell", async (req, res) => {
  const { stock, quantity, price, balance } = req.body;
  if (!stock || !quantity || !price) return res.status(400).send("Invalid Data");

  const [stock_id] = await pool.query("SELECT stock_id FROM stocks WHERE symbol = ?", [stock]);

  const stockId = stock_id[0].stock_id;
  const userId = req.session.userId;
  const sellQty = parseInt(quantity, 10);
  const sellPrice = parseFloat(price.slice(1));

  // Record the sell transaction
  await pool.query(
    "INSERT INTO transactions(user_id, stock_id, type, quantity, price_per_share) VALUES (?, ?, ?, ?, ?)",
    [userId, stockId, "SELL", sellQty, sellPrice]
  );
  await pool.query("UPDATE users SET balance = balance + ? WHERE user_id = ?",[quantity*Number(price.slice(1)),req.session.userId])
  // Check existing holding
  const [existing] = await pool.query(
    "SELECT * FROM holdings WHERE user_id = ? AND stock_id = ?",
    [userId, stockId]
  );

  if (existing.length > 0) {
    const oldQty = parseInt(existing[0].total_quantity, 10);
    const oldAvgPrice = parseFloat(existing[0].avg_price_per_share);

    if (sellQty > oldQty) {
      return res.status(400).send("Not enough shares to sell.");
    }

    const newQty = oldQty - sellQty;

    if (newQty === 0) {
      // Remove holding completely if no shares left
      await pool.query("DELETE FROM holdings WHERE user_id = ? AND stock_id = ?", [userId, stockId]);
    } else {
      // Keep avg price the same
      await pool.query(
        "UPDATE holdings SET total_quantity = ? WHERE user_id = ? AND stock_id = ?",
        [newQty, userId, stockId]
      );
    }

    res.status(200).send("Sell order placed successfully");
  } else {
    return res.status(400).send("No holdings to sell.");
  }
});

app.post("/addmoney", async (req, res) => {
    const { balance } = req.body;
    // console.log(Number(balance))
    // res.render("index.ejs",{balance:Number(balance)})
    await pool.query("UPDATE users SET balance = ? WHERE user_id = ?",[Number(balance),req.session.userId])
    res.json({ newBalance: Number(balance) });
})

// repeater 
app.get("/api/stocks", async (req, res) => {
  try {
    const allStockData = await Promise.all(
      stocks.map(async (stock) => {
        try {
          const result = await axios.get(
            `https://finnhub.io/api/v1/quote?symbol=${stock}&token=${API_KEY}`
          );
          return {
            stock_name: stock,
            price: result.data.c,
          };
        } catch (error) {
          console.error(`Error fetching ${stock}:`, error.response?.data || error.message);
          return {
            stock_name: stock,
            price: "N/A",
            error: "Failed to fetch data (maybe API limit)",
          };
        }
      })
    );
    res.json(allStockData);
  } catch (error) {
    console.error("Unexpected error in /api/stocks:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});



app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})