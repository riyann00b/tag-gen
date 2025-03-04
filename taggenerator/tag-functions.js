// tag-functions.js

// Map digits 0-9 to letters A-J for product code encoding
const digitMap = "ZABCDEFGHIJ";

function encodePrice(price) {
    const alphabet = "ZABCDEFGHIJKLMNOPQRSTUVWXY";
    let code = alphabet[Math.floor(Math.random() * 26)]; // Starting letter
    String(price).split('').forEach(digit => {
        code += digitMap[parseInt(digit)] || digit;
    });
    code += alphabet[Math.floor(Math.random() * 26)]; // Ending letter
    return code;
}

function formatCurrency(amount) {
    // Format number to have comma separators for thousands
    return amount.toLocaleString('en-IN');
}

function validateInputs() {
    const productName = document.getElementById('productName').value;
    const buyingPrice = document.getElementById('buyingPrice').value;
    const sellingPrice = document.getElementById('sellingPrice').value;

    if (!productName) {
        showStatus("Please enter a product name", false);
        return false;
    }

    if (!buyingPrice || isNaN(parseFloat(buyingPrice)) || parseFloat(buyingPrice) < 0) {
        showStatus("Please enter a valid buying price", false);
        return false;
    }

    if (!sellingPrice || isNaN(parseFloat(sellingPrice)) || parseFloat(sellingPrice) < 0) {
        showStatus("Please enter a valid selling price", false);
        return false;
    }

    return true;
}

function showStatus(message, isSuccess) {
    const statusElement = document.getElementById('statusMessage');
    statusElement.textContent = message;
    statusElement.className = isSuccess ? 'status success' : 'status error';
    statusElement.style.display = 'block';

    // Hide the message after 3 seconds
    setTimeout(() => {
        statusElement.style.display = 'none';
    }, 3000);
}

function createTag(productName, buyingPrice, sellingPrice, discount, originalPrice) {
    const tag = document.createElement('div');
    tag.className = 'tag';

    tag.innerHTML = `
    <div class="tag-header">
      <img src="media/Logo.svg" alt="Motitaka Logo" class="logo" 
           onerror="this.src='https://via.placeholder.com/150x40?text=Motitaka';this.style.border='1px solid red'">
    </div>
    <div class="product-name">${productName}</div>
    <div class="price-container">
      ${discount > 0 ? `
        <div class="discount-badge">-${discount}%</div>
        <div class="original-price">MRP: ₹${formatCurrency(Math.round(originalPrice))}</div>
      ` : ''}
      <div class="discount-price">₹${formatCurrency(Math.round(sellingPrice))}</div>
    </div>
    <div class="tag-footer">
      <div class="product-code">${encodePrice(buyingPrice)}</div>
      <div class="qr-code">
        <img src="media/qr-code.svg" alt="QR Code"
             onerror="this.src='https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://linktr.ee/motitaka'">
      </div>
    </div>
  `;

    return tag;
}