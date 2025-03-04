// tag-functions.js

// Map digits 0-9 to letters A-J for product code encoding
const digitMap = "ZABCDEFGHIJ";

// Track current orientation
let currentOrientation = 'portrait';

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Set up orientation toggle buttons
    document.querySelectorAll('.orientation-btn').forEach(button => {
        button.addEventListener('click', function() {
            const orientation = this.dataset.orientation;
            setOrientation(orientation);
        });
    });
});

function setOrientation(orientation) {
    currentOrientation = orientation;

    // Update active button
    document.querySelectorAll('.orientation-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.orientation === orientation);
    });

    // Update preview tag if visible
    const previewTag = document.getElementById('previewTag');
    if (previewTag) {
        previewTag.className = `tag ${orientation}`;
    }

    // Update document class for print styles
    document.body.classList.toggle('print-portrait', orientation === 'portrait');
    document.body.classList.toggle('print-landscape', orientation === 'landscape');

    // Update any existing tags
    document.querySelectorAll('.tags-container .tag').forEach(tag => {
        tag.className = `tag ${orientation}`;
    });
}

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

function previewTag() {
    if (!validateInputs()) return;

    // Get values from form
    const productName = document.getElementById('productName').value;
    const buyingPrice = parseFloat(document.getElementById('buyingPrice').value);
    const sellingPrice = parseFloat(document.getElementById('sellingPrice').value);
    const discountPercentage = parseFloat(document.getElementById('discountPercentage').value) || 0;

    // Calculate original price if discount exists
    const originalPrice = discountPercentage > 0 ?
        sellingPrice / (1 - discountPercentage / 100) :
        sellingPrice;

    // Create tag element
    const tag = createTag(productName, buyingPrice, sellingPrice, discountPercentage, originalPrice);

    // Add current orientation
    tag.className = `tag ${currentOrientation}`;

    // Show in preview area
    const previewContainer = document.getElementById('previewContainer');
    const previewTagElement = document.getElementById('previewTag');

    previewTagElement.innerHTML = tag.innerHTML;
    previewTagElement.className = `tag ${currentOrientation}`;
    previewContainer.style.display = 'flex';

    showStatus("Tag preview generated", true);
}

function generateTags() {
    if (!validateInputs()) return;

    // Get values from form
    const productName = document.getElementById('productName').value;
    const buyingPrice = parseFloat(document.getElementById('buyingPrice').value);
    const sellingPrice = parseFloat(document.getElementById('sellingPrice').value);
    const discountPercentage = parseFloat(document.getElementById('discountPercentage').value) || 0;
    const quantity = parseInt(document.getElementById('quantity').value) || 1;

    if (quantity <= 0) {
        showStatus("Please enter a valid quantity", false);
        return;
    }

    // Calculate original price if discount exists
    const originalPrice = discountPercentage > 0 ?
        sellingPrice / (1 - discountPercentage / 100) :
        sellingPrice;

    // Get tags container
    const tagsContainer = document.getElementById('tagsContainer');

    // Generate tags
    for (let i = 0; i < quantity; i++) {
        const tag = createTag(productName, buyingPrice, sellingPrice, discountPercentage, originalPrice);
        tag.className = `tag ${currentOrientation}`;
        tagsContainer.appendChild(tag);
    }

    showStatus(`${quantity} tag${quantity > 1 ? 's' : ''} generated successfully`, true);
}

function clearTags() {
    const tagsContainer = document.getElementById('tagsContainer');

    // Only show confirmation if there are tags
    if (tagsContainer.children.length > 0) {
        if (confirm('Are you sure you want to clear all tags?')) {
            tagsContainer.innerHTML = '';
            showStatus("All tags cleared", true);
        }
    } else {
        showStatus("No tags to clear", false);
    }
}

function printTags() {
    const container = document.getElementById('tagsContainer');
    if (container.children.length === 0) {
        showStatus("Please generate tags before printing", false);
        return;
    }

    // Add appropriate print class based on orientation
    document.body.classList.add(`print-${currentOrientation}`);

    // Print
    window.print();

    // Remove print class
    document.body.classList.remove(`print-${currentOrientation}`);
}

function createTag(productName, buyingPrice, sellingPrice, discount, originalPrice) {
    const tag = document.createElement('div');
    tag.className = 'tag';

    // Different layout for landscape mode
    if (currentOrientation === 'landscape') {
        tag.innerHTML = `
        <div class="tag-header">
          <img src="media/Logo.svg" alt="Motitaka Logo" class="logo"
               onerror="this.src='https://via.placeholder.com/150x40?text=Motitaka';this.style.border='1px solid #ccc'">
          <div class="product-name">${productName}</div>
        </div>
        <div class="price-container">
          ${discount > 0 ? `
            <div class="discount-info">
              <div class="discount-badge">-${Math.round(discount)}%</div>
              <div class="original-price">MRP: ₹${formatCurrency(Math.round(originalPrice))}</div>
            </div>
          ` : '<div></div>'}
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
    } else {
        // Original portrait layout
        tag.innerHTML = `
        <div class="tag-header">
          <img src="media/Logo.svg" alt="Motitaka Logo" class="logo"
               onerror="this.src='https://via.placeholder.com/150x40?text=Motitaka';this.style.border='1px solid #ccc'">
        </div>
        <div class="product-name">${productName}</div>
        <div class="price-container">
          ${discount > 0 ? `
            <div class="discount-badge">-${Math.round(discount)}%</div>
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
    }

    return tag;
}