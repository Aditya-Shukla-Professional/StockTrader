$(document).ready(function () {
  $('.hamburger').click(function () {
    $('nav.nav-menu ul').slideToggle().toggleClass('show');
  });
});

$(document).on('keypress', 'input[type="number"][step="1"]', function (e) {
  if (e.key === '.' || e.key === 'e' || e.key === '-') {
    e.preventDefault();
  }
});

$(document).ready(function(){
  $("#money").click(function(){
    const amount=+prompt("Enter the amount: ") // the + is used to convert the prompt value to an float or integer
    if (amount>0){
      total_amount=+($(".balance").text().slice(10))+amount
      $.post("/addmoney",{balance:total_amount}, function(response){
        $(".balance").text(`Balance: $${response.newBalance}`);
        alert(`$${amount} added to your account!`)
      }).fail(function(){
        alert("Error adding money.")
      })
    }
    else{
      alert("Please enter a valid amount!")
    }
  })
  $(".btn.buy").click(function(){
    const card= $(this).closest(".card");
    const stockName=card.find(".stock-name").text();
    const qty=card.find("input[name='buyQty']").val();
    const price=card.find(".stock-price").text();
    const amount=$(".balance").text().slice(10);
    const holding=card.find(".holdings").text().slice(10);
    const avg=card.find(".avg").text().slice(13);
    
    if (Number(amount)>=(Number(price.slice(1))*qty)){
      $(".balance").text(`Balance: $${(Number(amount)-(Number(price.slice(1))*qty)).toFixed(2)}`);
      card.find(".holdings").html(`<strong>Holdings:</strong> ${Number(holding)+Number(qty)}`);
      card.find(".avg").html(`<strong>Avg. Price:</strong> $${(Number(holding)+Number(qty) === 0 ? 0 : (((Number(avg)*Number(holding))+(Number(price.slice(1))*Number(qty)))/(Number(holding)+Number(qty))).toFixed(2))}`);
      $.post("/buy",{stock:stockName,quantity:qty,price:price}, function(response){
        alert(`Buy order placed: ${qty} shares of ${stockName} at ${price}`)
      }).fail(function(){
        alert("Error placing buy order.")
      })
    }
    else {
      alert("You don't have enough money in your wallet to place this buy order.")
    }
  });

  $(".btn.sell").click(function(){
    const card= $(this).closest(".card");
    const stockName=card.find(".stock-name").text()
    const qty=card.find("input[name='buyQty']").val();
    const price=card.find(".stock-price").text();
    const holding=card.find(".holdings").text().slice(10);
    const amount=$(".balance").text().slice(10);
    const avg=card.find(".avg").text().slice(13);

    if (Number(holding)>=qty){
      $.post("/sell",{stock:stockName,quantity:qty,price:price}, function(response){
        $(".balance").text(`Balance: $${(Number(amount)+(Number(price.slice(1))*qty)).toFixed(2)}`)
        card.find(".holdings").html(`<strong>Holdings:</strong> ${Number(holding)-Number(qty)}`);
        card.find(".avg").html(`<strong>Avg. Price:</strong> $${(Number(holding)-Number(qty) === 0 ? 0 : (((Number(avg)*Number(holding))-(Number(price.slice(1))*Number(qty)))/(Number(holding)-Number(qty))).toFixed(2))}`);
        alert(`Sell order placed: ${qty} shares of ${stockName} at ${price}`)
      }).fail(function(){
        alert("Error placing sell order.")
      })
    }
    else{
      alert("You don't have enought quantity to sell.")
    }
  });
});

// timer...
function fetchStockPrices() {
  $.get("/api/stocks", function (data) {
    data.forEach(stock => {
      const card = $(`.card:has(.stock-name:contains(${stock.stock_name}))`);
      card.find(".stock-price").text(`$${stock.price.toFixed(2)}`);
      // console.log(`$${stock.price}`)
    });
  });
}
setInterval(fetchStockPrices, 8000); // updates stock data every 8 seconds

