document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-input");
    const filterSelect = document.getElementById("filter-select");
    const menuTableBody = document.querySelector("#menu-table tbody");

    searchInput.addEventListener("input", filterMenu);
    filterSelect.addEventListener("change", filterMenu);

    function filterMenu() {
        const searchTerm = searchInput.value.toLowerCase();
        const filterValue = filterSelect.value;

        menuTableBody.querySelectorAll("tr").forEach(row => {
            const itemName = row.querySelector("td:nth-child(2)").textContent.toLowerCase();
            const category = row.querySelector("td:nth-child(3)").textContent.toLowerCase();

            const matchesSearch = itemName.includes(searchTerm);
            const matchesFilter = filterValue === "all" || category === filterValue;

            if (matchesSearch && matchesFilter) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    }
});