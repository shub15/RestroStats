document.addEventListener("DOMContentLoaded", function () {
    const menuTableBody = document.querySelector("#menu-table tbody");
    const addItemForm = document.getElementById("add-item-form");
    let itemIdCounter = 3; 

    
    menuTableBody.addEventListener("click", function (event) {
        if (event.target.classList.contains("save-btn")) {
            const row = event.target.closest("tr");
            const itemId = row.querySelector("td:nth-child(1)").textContent;
            const itemName = row.querySelector("td:nth-child(2) input").value;
            const itemPrice = row.querySelector("td:nth-child(4) input").value;

            console.log("Saving changes for Item ID:", itemId);
            console.log("New Name:", itemName);
            console.log("New Price:", itemPrice);

            alert("Changes saved successfully!");
        }

        
        if (event.target.classList.contains("delete-btn")) {
            const row = event.target.closest("tr");
            const itemId = row.querySelector("td:nth-child(1)").textContent;

            
            console.log("Deleting Item ID:", itemId);
            row.remove();
            alert("Item deleted successfully!");
        }
    });

    
    addItemForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const itemName = document.getElementById("new-item-name").value;
        const itemCategory = document.getElementById("new-item-category").value;
        const itemPrice = document.getElementById("new-item-price").value;

        // Generate a new item ID
        itemIdCounter++;
        const newItemId = itemIdCounter.toString().padStart(3, "0");

        // Create a new row for the table
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${newItemId}</td>
            <td><input type="text" value="${itemName}" class="editable-input"></td>
            <td>${itemCategory}</td>
            <td><input type="number" value="${itemPrice}" step="0.01" class="editable-input"></td>
            <td>
                <button class="action-btn save-btn" title="Save Changes">
                    <span class="material-symbols-outlined">save</span>
                </button>
                <button class="action-btn delete-btn" title="Delete Item">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </td>
        `;

        menuTableBody.appendChild(newRow);


        addItemForm.reset();

        alert("New item added successfully!");
    });
});