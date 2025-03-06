

const ctx1 = document.getElementById('sales-bar').getContext('2d');
        const myChart1 = new Chart(ctx1, {
        type: 'bar',
        data: {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday','Saturday','Sunday'],
        datasets: [{
            label: 'Sales per Day',
            data: [33635,27750,35650,34650,28420,29925,36495],
            backgroundColor: '#5C677D   ', // Your selected color
            borderColor: '#4A5568   ', // Slightly darker shade for contrast
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
            
        }
        
    }
});

const ctx2 = document.getElementById('sales-line').getContext('2d');
        const myChart2 = new Chart(ctx2, {
        type: 'line',
        data: {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday','Saturday','Sunday'],
        datasets: [{
            label: 'Sales per Day',
            data: [33635,27750,35650,34650,28420,29925,36495],
            backgroundColor: '#5C677D   ', // Your selected color
            borderColor: '#4A5568   ', // Slightly darker shade for contrast
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
            
        }
        
    }
});

const ctx3 = document.getElementById('sales-pie');
        const myChart3 = new Chart(ctx3, {
        type: 'pie',
        data: {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday','Saturday','Sunday'],
        datasets: [{
            label: 'Sales per Day',
            data: [33635,27750,35650,34650,28420,29925,36495],
            backgroundColor: ['#fd7f6f','#7eb0d5','#b2e061','#bd7ebe','#ffb55a','#ffee65','#beb9db'], // Your selected color
            borderColor: '#4A5568   ', // Slightly darker shade for contrast
            borderWidth: 1
        }]
    },
    

});