import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto"; // Ensure this is imported once


// 1️⃣ ViewMenu.jsx (Converted from view_menu.js)
const ViewMenu = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterValue, setFilterValue] = useState("all");

    useEffect(() => {
        filterMenu();
    }, [searchTerm, filterValue]);

    const filterMenu = () => {
        document.querySelectorAll("#menu-table tbody tr").forEach(row => {
            const itemName = row.querySelector("td:nth-child(2)").textContent.toLowerCase();
            const category = row.querySelector("td:nth-child(3)").textContent.toLowerCase();

            const matchesSearch = itemName.includes(searchTerm.toLowerCase());
            const matchesFilter = filterValue === "all" || category === filterValue;

            row.style.display = matchesSearch && matchesFilter ? "" : "none";
        });
    };

    return (
        <div>
            <input type="text" placeholder="Search..." onChange={(e) => setSearchTerm(e.target.value)} />
            <select onChange={(e) => setFilterValue(e.target.value)}>
                <option value="all">All</option>
                <option value="category1">Category 1</option>
                <option value="category2">Category 2</option>
            </select>
            <table id="menu-table">
                <tbody>
                    {/* Menu items here */}
                </tbody>
            </table>
        </div>
    );
};

// 2️⃣ ViewBill.jsx (Converted from viewbill.js)
const ViewBill = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterValue, setFilterValue] = useState("all");

    useEffect(() => {
        filterBills();
    }, [searchTerm, filterValue]);

    const filterBills = () => {
        document.querySelectorAll("#bills-table tbody tr").forEach(row => {
            const customerName = row.querySelector("td:nth-child(2)").textContent.toLowerCase();
            const status = row.querySelector("td:nth-child(5) .status").classList.contains(filterValue);

            row.style.display = customerName.includes(searchTerm.toLowerCase()) && (filterValue === "all" || status) ? "" : "none";
        });
    };

    return (
        <div>
            <input type="text" placeholder="Search bills..." onChange={(e) => setSearchTerm(e.target.value)} />
            <select onChange={(e) => setFilterValue(e.target.value)}>
                <option value="all">All</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
            </select>
            <table id="bills-table">
                <tbody>
                    {/* Bill items here */}
                </tbody>
            </table>
        </div>
    );
};

// 5️⃣ ChartComponent.jsx (Converted from chart.js)
// Removed duplicate import here
// const ChartComponent = () => {
//     useEffect(() => {
//         const ctx1 = document.getElementById("sales-bar").getContext("2d");
//         new Chart(ctx1, {
//             type: "bar",
//             data: {
//                 labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
//                 datasets: [{ label: "Sales", data: [33635, 27750, 35650, 34650, 28420, 29925, 36495] }]
//             }
//         });
//     }, []);

//     return <canvas id="sales-bar"></canvas>;
// };

// const ChartComponent = ({ type = "bar", id = "sales-bar", data, options }) => {
//     useEffect(() => {
//         // Use the provided ID or default to "sales-bar"
//         const ctx = document.getElementById(id).getContext("2d");
        
//         // Default data if none provided
//         const defaultData = {
//             labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
//             datasets: [{ 
//                 label: "Sales", 
//                 data: [33635, 27750, 35650, 34650, 28420, 29925, 36495],
//                 backgroundColor: type === "pie" ? [
//                     '#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40', '#c9cbcf'
//                 ] : 'rgba(54, 162, 235, 0.7)'
//             }]
//         };
        
//         // Default options
//         const defaultOptions = {
//             responsive: true,
//             maintainAspectRatio: false
//         };
        
//         // Create chart
//         const chartInstance = new Chart(ctx, {
//             type: type,  // Use the provided type
//             data: data || defaultData,  // Use provided data or default
//             options: options || defaultOptions  // Use provided options or default
//         });
        
//         // Cleanup function to destroy chart when component unmounts
//         return () => {
//             chartInstance.destroy();
//         };
//     }, [id, type, data, options]);

//     return <canvas id={id}></canvas>;
// };


const ChartComponent = ({ type = "bar", id = "sales-bar", data, options }) => {
    const chartRef = useRef(null);  // Reference to the canvas

    useEffect(() => {
        if (!chartRef.current) return;  

        const ctx = chartRef.current.getContext("2d");

        const defaultData = {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [{ 
                label: "Sales", 
                data: [33635, 27750, 35650, 34650, 28420, 29925, 36495],
                backgroundColor: type === "pie" ? [
                    '#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40', '#c9cbcf'
                ] : 'rgba(54, 162, 235, 0.7)'
            }]
        };

        const chartInstance = new Chart(ctx, {
            type: type,
            data: data || defaultData,
            options: options || { responsive: true, maintainAspectRatio: false }
        });

        return () => {
            chartInstance.destroy();
        };
    }, [type, data, options]);

    return (
        <div style={{ width: "100%", height: "250px" }}> {/* Fixed height */}
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

// 7️⃣ UpdateMenu.jsx (Converted from update_menu.js)
const UpdateMenu = () => {
    const [items, setItems] = useState([]);

    const addItem = () => {
        const newItem = { id: items.length + 1, name: "", category: "", price: "" };
        setItems([...items, newItem]);
    };

    return (
        <div>
            <button onClick={addItem}>Add Item</button>
            <table>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={index}>
                            <td>{item.id}</td>
                            <td><input type="text" defaultValue={item.name} /></td>
                            <td>{item.category}</td>
                            <td><input type="number" defaultValue={item.price} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Export all components
export { ViewMenu, ViewBill, ChartComponent, UpdateMenu };