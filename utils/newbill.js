document.addEventListener("DOMContentLoaded", function () {
    const addItemBtn = document.getElementById("add-item-btn");
    const itemDescription = document.getElementById("item-description");
    const itemQuantity = document.getElementById("item-quantity");
    const itemPrice = document.getElementById("item-price");
    const itemsTableBody = document.querySelector("#items-table tbody");
    const grandTotalCell = document.getElementById("grand-total");
    const billForm = document.getElementById("bill-form");
    const customerName = document.getElementById("customer-name");
    const tableNumber = document.getElementById("table-number");

    let grandTotal = 0;

    // Function to add an item to the table
    addItemBtn.addEventListener("click", function () {
        const description = itemDescription.value.trim();
        const quantity = parseInt(itemQuantity.value);
        const price = parseFloat(itemPrice.value);

        if (!description || isNaN(quantity) || isNaN(price)) {
            alert("Please fill in all fields correctly.");
            return;
        }

        const total = quantity * price;
        grandTotal += total;

        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${description}</td>
            <td>${quantity}</td>
            <td>${price.toFixed(2)}</td>
            <td>${total.toFixed(2)}</td>
            <td><button class="remove-btn">Remove</button></td>
        `;

        itemsTableBody.appendChild(newRow);
        grandTotalCell.textContent = grandTotal.toFixed(2);

        // Disable Customer Name & Table Number Input
        customerName.diabled = "true";
        tableNumber.disabled = "true";
       
        // Clear input fields
        itemDescription.value = "";
        itemQuantity.value = "";
        itemPrice.value = "";

        // Add event listener to remove button
        newRow.querySelector(".remove-btn").addEventListener("click", function () {
            const rowTotal = parseFloat(newRow.querySelector("td:nth-child(4)").textContent);
            grandTotal -= rowTotal;
            grandTotalCell.textContent = grandTotal.toFixed(2);
            newRow.remove();
        });
    });

    // Function to handle form submission
    billForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the form from submitting and reloading the page

        // Get form data
        const customerName = document.getElementById("customer-name").value;
        const tableNumber = document.getElementById("table-number").value;
        const items = [];

        // Collect all items from the table
        itemsTableBody.querySelectorAll("tr").forEach(row => {
            const description = row.querySelector("td:nth-child(1)").textContent;
            const quantity = row.querySelector("td:nth-child(2)").textContent;
            const price = row.querySelector("td:nth-child(3)").textContent;
            const total = row.querySelector("td:nth-child(4)").textContent;

            items.push({
                description,
                quantity: parseInt(quantity),
                price: parseFloat(price),
                total: parseFloat(total),
            });
        });

        // Create the bill object
        const bill = {
            customerName,
            tableNumber,
            items,
            grandTotal: parseFloat(grandTotalCell.textContent),
        };

        // Log the bill object (you can replace this with an API call to save the bill)
        console.log("Generated Bill:", bill);

        // Optionally, display a success message
        alert("Bill generated successfully!");

        // Optionally, reset the form
        billForm.reset();
        itemsTableBody.innerHTML = ""; // Clear the table
        grandTotalCell.textContent = "0.00"; // Reset grand total
    });
});

// Example date string
let dateString = "Thu Mar 06 2025 13:56:04 GMT+0530 (India Standard Time)";

// Create a new Date object from the string
let date = new Date(dateString);

// Function to format the date and time to "yyyy-MM-dd HH:mm:ss"
function autoTickDateTime() {
    let currentDate = new Date();
    let formattedDate = currentDate.toISOString().split('T')[0];
    let formattedTime = currentDate.toTimeString().split(' ')[0].substring(0, 5);  
    document.getElementById('date').value = formattedDate;
    document.getElementById('time').value = formattedTime;
}
