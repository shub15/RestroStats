
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

export default ChartComponent;