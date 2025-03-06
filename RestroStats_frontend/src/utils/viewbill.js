document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-input");
    const filterSelect = document.getElementById("filter-select");
    const billsTableBody = document.querySelector("#bills-table tbody");

    searchInput.addEventListener("input", filterBills);
    filterSelect.addEventListener("change", filterBills);

    function filterBills() {
        const searchTerm = searchInput.value.toLowerCase();
        const filterValue = filterSelect.value;

        billsTableBody.querySelectorAll("tr").forEach(row => {
            const customerName = row.querySelector("td:nth-child(2)").textContent.toLowerCase();
            const status = row.querySelector("td:nth-child(5) .status").classList.contains(filterValue);

            const matchesSearch = customerName.includes(searchTerm);
            const matchesFilter = filterValue === "all" || status;

            if (matchesSearch && matchesFilter) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    }
});