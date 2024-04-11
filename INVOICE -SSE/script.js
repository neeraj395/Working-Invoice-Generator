// Function to save data to session storage
function saveDataToSessionStorage(data) {
    sessionStorage.setItem('invoiceData', JSON.stringify(data));
}

// Function to retrieve data from session storage
function getDataFromSessionStorage() {
    const data = sessionStorage.getItem('invoiceData');
    return data ? JSON.parse(data) : null;
}

// Function to retrieve item details
function getItemDetails() {
    const itemRows = document.querySelectorAll(".item-row");
    const itemDetails = [];
    itemRows.forEach(row => {
        const itemName = row.querySelector(".itemName").value;
        const quantity = row.querySelector(".quantity").value;
        const unitPrice = row.querySelector(".unitPrice").value;
        itemDetails.push({ itemName, quantity, unitPrice });
    });
    return itemDetails;
}

// Function to handle adding item rows dynamically
function addItem() {
    const itemDetailsContainer = document.getElementById("itemDetails");
    const newItemRow = document.createElement("div");
    newItemRow.classList.add("item-row");
    newItemRow.innerHTML = `
        <label for="itemName">Item Name:</label>
        <input type="text" class="itemName" name="itemName[]" required>
        
        <label for="quantity">Quantity:</label>
        <input type="number" class="quantity" name="quantity[]" required>
        
        <label for="unitPrice">Unit Price:</label>
        <input type="number" class="unitPrice" name="unitPrice[]" required>
    `;
    itemDetailsContainer.appendChild(newItemRow);
}

// Function to handle previewing invoice details and redirecting to preview page
function previewInvoice() {
    const invoiceForm = document.getElementById("invoiceForm");

    // Save form data to session storage
    const formData = {
        invoiceNo: invoiceForm.invoiceNo.value,
        invoiceDate: invoiceForm.invoiceDate.value,
        poNo: invoiceForm.poNo.value,
        poDate: invoiceForm.poDate.value,
        hsnCode: invoiceForm.hsnCode.value,
        vehicleNo: invoiceForm.vehicleNo.value,
        consigneeName: invoiceForm.consigneeName.value,
        addressLine1: invoiceForm.addressLine1.value,
        addressLine2: invoiceForm.addressLine2.value,
        gstin: invoiceForm.gstin.value,
        itemDetails: getItemDetails() // Capture item details
    };
    saveDataToSessionStorage(formData);

    window.location.href = "preview.html";
}

// Function to load preview data on preview.html
function loadPreviewData() {
    const storedData = getDataFromSessionStorage();
    if (storedData && storedData.itemDetails) {
        // Populate invoice details
        document.getElementById("previewInvoiceNo").textContent = storedData.invoiceNo;
        document.getElementById("previewInvoiceDate").textContent = storedData.invoiceDate;
        document.getElementById("previewPONo").textContent = storedData.poNo;
        document.getElementById("previewPODate").textContent = storedData.poDate;
        document.getElementById("previewHSNCode").textContent = storedData.hsnCode;
        document.getElementById("previewVehicleNo").textContent = storedData.vehicleNo;
        document.getElementById("previewConsigneeName").textContent = storedData.consigneeName;
        document.getElementById("previewAddressLine1").textContent = storedData.addressLine1;
        document.getElementById("previewAddressLine2").textContent = storedData.addressLine2;
        document.getElementById("previewGSTIN").textContent = storedData.gstin;
        
        // Populate item details table
        const itemDetailsTable = document.getElementById("previewItemDetails");
        itemDetailsTable.innerHTML = ""; // Clear existing content
        const itemDetails = storedData.itemDetails;
        itemDetails.forEach(item => {
            const row = itemDetailsTable.insertRow();
            const itemNameCell = row.insertCell(0);
            const quantityCell = row.insertCell(1);
            const unitPriceCell = row.insertCell(2);
            itemNameCell.textContent = item.itemName;
            quantityCell.textContent = item.quantity;
            unitPriceCell.textContent = item.unitPrice;
        });
    } else {
        console.error("No item details found in session storage.");
    }
}
// Function to calculate subtotal from item details
function calculateSubtotal() {
    const itemRows = document.querySelectorAll("#previewItemDetails tbody tr");
    let subtotal = 0;
    itemRows.forEach(row => {
        const quantity = parseInt(row.cells[1].textContent);
        const unitPrice = parseFloat(row.cells[2].textContent);
        subtotal += quantity * unitPrice; // Calculate subtotal for each item
    });
    return subtotal;
}

// Function to calculate total amount (subtotal + GST)
function calculateAmount() {
    const subtotal = calculateSubtotal();
    const taxRate = 0.18; // Assuming tax rate is 18%
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount;
    return totalAmount;
}

// Function to calculate tax amount (18% of subtotal)
function calculateTaxAmount() {
    const subtotal = calculateSubtotal();
    const taxRate = 0.18; // Assuming tax rate is 18%
    const taxAmount = subtotal * taxRate;
    return taxAmount;
}

// Function to convert total amount to words (Indian numbering system)
function totalAmountInWords() {
    const subtotal = calculateSubtotal();
    const taxAmount = calculateTaxAmount();
    const totalAmount = subtotal + taxAmount;
    return convertToIndianCurrency(totalAmount);
}


// Function to display money calculation details
function displayMoneyCalculation() {
    // Calculate total amount
    const totalAmount = calculateAmount();

    // Calculate tax amount
    const taxAmount = calculateTaxAmount();

    // Calculate total amount with tax
    const totalAmountWithTax = totalAmount + taxAmount;

    // Convert total amount to words
    const totalAmountInWords = convertToIndianCurrency(totalAmount);

    // Display total amount, tax amount, and total amount in words
    document.getElementById("previewTotalAmount").textContent = formatAmount(totalAmount);
    document.getElementById("previewTotalTaxAmount").textContent = formatAmount(taxAmount);
    document.getElementById("previewTotalAmountInWords").textContent = totalAmountInWords;
}

// Call displayMoneyCalculation function when the preview page loads
window.onload = function() {
    displayMoneyCalculation(); // Display money calculation details
};



function convertToIndianWords(number) {
    const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const teens = ["", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    if (number === 0) return "Zero";

    let words = "";

    // Handle lakhs and crores
    if (number >= 10000000) {
        words += convertToIndianWords(Math.floor(number / 10000000)) + " Crore ";
        number %= 10000000;
    }
    if (number >= 100000) {
        words += convertToIndianWords(Math.floor(number / 100000)) + " Lakh ";
        number %= 100000;
    }

    // Handle thousands
    if (number >= 1000) {
        words += convertToIndianWords(Math.floor(number / 1000)) + " Thousand ";
        number %= 1000;
    }

    // Handle hundreds
    if (number >= 100) {
        words += convertToIndianWords(Math.floor(number / 100)) + " Hundred ";
        number %= 100;
    }

    // Handle tens and units
    if (number > 0) {
        if (number < 10) {
            words += units[number] + " ";
        } else if (number < 20) {
            words += teens[number - 10] + " ";
        } else {
            words += tens[Math.floor(number / 10)] + " ";
            if (number % 10 > 0) {
                words += units[number % 10] + " ";
            }
        }
    }

    return words.trim();
}


function convertToIndianCurrency(amount) {
    const words = convertToIndianWords(Math.floor(amount));
    const rupees = words === "One" ? "Rupee" : "Rupees";
    const paisa = Math.round((amount - Math.floor(amount)) * 100);
    const paisaWord = paisa > 0 ? `and ${convertToIndianWords(paisa)} Paisa` : "";
    return `${words} ${rupees} ${paisaWord} only`;
}

// Example usage
const amount = 100981.70;
console.log(convertToIndianCurrency(amount)); // Output: One Lakh One Thousand Nine Hundred Eighty One Rupees and Seventy Paisa only



// Function to format amount to Indian currency
function formatAmount(amount) {
    return "₹ " + amount.toFixed(2);
}

// Call loadPreviewData function when preview.html loads
window.onload = function() {
    loadPreviewData(); // Load preview data
    displayMoneyCalculation(); // Display money calculation details
};

