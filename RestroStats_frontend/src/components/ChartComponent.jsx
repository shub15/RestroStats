import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

const ChartComponent = ({ id, type, data, options }) => {
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  // Create a unique ID for each chart instance
  const chartId = `${id}-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    // Clean up previous chart instance if it exists
    if (chartInstance) {
      chartInstance.destroy();
    }

    // Return early if no ref or data
    if (!chartRef.current || !data) return;

    const ctx = chartRef.current.getContext('2d');
    
    // Configure chart options based on chart type
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      ...options
    };

    // Configure datasets based on chart type
    let chartData = {
      labels: data.labels,
      datasets: []
    };

    if (type === 'bar') {
      chartData.datasets = [
        {
          label: data.datasets ? data.datasets[0]?.label : 'Sales',
          data: data.datasets ? data.datasets[0]?.data : data.values,
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(199, 199, 199, 0.7)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(199, 199, 199, 1)'
          ],
          borderWidth: 1
        }
      ];
    } else if (type === 'line') {
      chartData.datasets = [
        {
          label: 'Sales Trend',
          data: data.values,
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.1
        }
      ];
    } else if (type === 'pie') {
      chartData.datasets = [
        {
          label: 'Sales Distribution',
          data: data.values,
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }
      ];
    }

    // Using a try-catch to handle any chart creation errors
    try {
      // Create the chart
      const newChartInstance = new Chart(ctx, {
        type,
        data: chartData,
        options: chartOptions
      });
      
      setChartInstance(newChartInstance);
    } catch (error) {
      console.error("Error creating chart:", error);
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [data, id, type, options]);

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <canvas ref={chartRef} id={chartId}></canvas>
    </div>
  );
};

export default ChartComponent;