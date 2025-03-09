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
    const printBtn = document.querySelector(".print-btn");

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
            <tr id="itemRow$">
                <td>${description}</td>
                <td>${quantity}</td>
                <td>${price.toFixed(2)}</td>
                <td>${total.toFixed(2)}</td>
                <td><button class="remove-btn">Remove</button></td>
            </tr>
        `;

        itemsTableBody.appendChild(newRow);
        grandTotalCell.textContent = grandTotal.toFixed(2);

        // Disable Customer Name & Table Number Input
        customerName.disabled = true;
        tableNumber.disabled = true;

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

    });

    // Function to generate printable bill
    printBtn.addEventListener("click", function () {
        const customerName = document.getElementById("customer-name").value;
        const tableNumber = document.getElementById("table-number").value;
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;
        const items = [];

        // Collect all items from the table
        itemsTableBody.querySelectorAll("tr").forEach(row => {
            const description = row.querySelector("td:nth-child(1)").textContent;
            const quantity = row.querySelector("td:nth-child(2)").textContent;
            const price = row.querySelector("td:nth-child(3)").textContent;
            const total = row.querySelector("td:nth-child(4)").textContent;

            items.push({
                description,
                quantity,
                price,
                total,
            });
        });
        username = "Shree Nidhi"
        address = "45, Gandhi Nagar Kolkata, West Bengal 700032 India"
        GSTIN = "AB54XXXXXXXXXXX"
        FssaiNo = "XXXXXX0000X0XX"
        // Create a printable bill HTML
        const printableBill = `
            <style>
                body { font-family: Arial, sans-serif; color: black; }
                h1, h3 , h4 { text-align: center;  }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { padding: 10px; border: 1px solid #ccc; text-align: left; }
                th { background-color: #4a90e2; color: black; }
                .total-label { font-weight: bold; }
            </style>
            <h1>${username}<h1>
            <h3>${address}</h3>
            <h3>${GSTIN}</h3>
            <h4>${FssaiNo}</h4>
            <p><strong>Customer Name:</strong> ${customerName}</p>
            <p><strong>Table Number:</strong> ${tableNumber}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${items.map(item => `
                        <tr>
                            <td>${item.description}</td>
                            <td>${item.quantity}</td>
                            <td>${item.price}</td>
                            <td>${item.total}</td>
                        </tr>
                    `).join("")}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3" class="total-label">Grand Total</td>
                        <td>${grandTotalCell.textContent}</td>
                    </tr>
                </tfoot>
            </table>
        `;

        // Open a new window with the printable bill
        const printWindow = window.open("", "_blank");
        printWindow.document.write(printableBill);
        printWindow.document.close();

        // Print the bill
        printWindow.print();
    });
});

// Function to auto-fill date and time
    function autoTickDateTime() {
        let currentDate = new Date();
        let formattedDate = currentDate.toISOString().split('T')[0];
        let formattedTime = currentDate.toTimeString().split(' ')[0].substring(0, 5);
        document.getElementById('date').value = formattedDate;
        document.getElementById('time').value = formattedTime;
    }
