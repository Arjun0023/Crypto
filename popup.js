const API_BASE = 'https://api.binance.com';
const TOP_10_URL = '/api/v3/ticker/24hr';
const IMAGE_BASE_URL = 'https://www.binance.com/images/coins/';

// Store previous prices to compare with current prices
let previousPrices = {};

async function fetchTop10CryptoPrices() {
  try {
    const response = await fetch(`${API_BASE}${TOP_10_URL}`);
    const data = await response.json();
    // Sort the data by market capitalization in descending order
    data.sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume));
    // Take only the top 10 cryptocurrencies
    const top10 = data.slice(0, 10);
    return top10;
  } catch (error) {
    console.error('Error fetching top 10 crypto prices:', error);
    return [];
  }
}

function renderCryptoPrices(prices) {
  const cryptoTable = document.getElementById('cryptoTable');

  // Clear existing table rows
  cryptoTable.innerHTML = '';

  // Add table header
  const headerRow = cryptoTable.insertRow();
  const headerCells = ['Logo', 'Name', 'Price', 'Change'];
  headerCells.forEach(cellText => {
    const th = document.createElement('th');
    th.textContent = cellText;
    headerRow.appendChild(th);
  });

  // Add table rows for each crypto
  prices.forEach(price => {
    const row = cryptoTable.insertRow();
    const logoCell = row.insertCell();
    const nameCell = row.insertCell();
    const priceCell = row.insertCell();
    const changeCell = row.insertCell();

    // Add logo
    const img = document.createElement('img');
    img.src = `${IMAGE_BASE_URL}${price.symbol.toLowerCase()}.png`;
    img.alt = price.symbol;
    img.classList.add('crypto-logo');
    img.onerror = function() {
      console.error('Error loading image for', price.symbol);
      this.style.display = 'none'; // Hide the image if not found
    };
    logoCell.appendChild(img);

    // Add name
    const nameElement = document.createElement('span');
    nameElement.textContent = `${price.symbol}:`;
    nameElement.style.fontWeight = 'bold';
    nameCell.appendChild(nameElement);

    // Add price
    const currentPrice = parseFloat(price.lastPrice).toFixed(2);
    priceCell.textContent = `$${currentPrice}`;

    // Add change
    const previousPrice = previousPrices[price.symbol];
    if (previousPrice !== undefined) {
      const change = currentPrice - previousPrice;
      const changeIndicator = change > 0 ? '▲' : change < 0 ? '▼' : '';
      changeCell.textContent = `${Math.abs(change).toFixed(2)} ${changeIndicator}`;
      if (change > 0) {
        changeCell.classList.add('positive-change');
      } else if (change < 0) {
        changeCell.classList.add('negative-change');
      }
    }

    // Store current price for next comparison
    previousPrices[price.symbol] = currentPrice;
  });
}

async function updatePrices() {
  try {
    const prices = await fetchTop10CryptoPrices();
    renderCryptoPrices(prices);
  } catch (error) {
    console.error('Error updating prices:', error);
  }
}

// Initial call to fetch and render prices
updatePrices();

// Update prices every 5 seconds
setInterval(updatePrices, 1000);
