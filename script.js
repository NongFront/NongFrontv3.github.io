document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const height = parseFloat(document.getElementById('height').value);
    const gender = document.getElementById('gender').value;
    const weight = parseFloat(document.getElementById('weight').value);
    const selectedDate = document.getElementById('dateSelector').value;

    // Check if a date is selected
    if (!selectedDate) {
        alert('โปรดเลือกวัน');
        return; // Stop further execution
    }

    const bmi = calculateBMI(height, weight);
    const category = determineCategory(bmi);

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<p>BMI: ${bmi.toFixed(2)}</p>
                           <p>Category: ${category}</p>`;

    saveData(height, gender, weight, bmi, selectedDate);
    drawChart();
});

document.getElementById('resetBtn').addEventListener('click', function() {
    resetData();
    document.getElementById('height').value = '';
    document.getElementById('weight').value = '';
    clearChart();
});

function calculateBMI(height, weight) {
    return weight / ((height / 100) * (height / 100));
}

function determineCategory(bmi) {
    if (bmi < 18.5) {
        return 'Underweight';
    } else if (bmi < 24.9) {
        return 'Normal weight';
    } else if (bmi < 29.9) {
        return 'Overweight';
    } else {
        return 'Obese';
    }
}

function saveData(height, gender, weight, bmi, date) {
    const userData = {
        "date": date,
        "height": height,
        "gender": gender,
        "weight": weight,
        "bmi": bmi
    };

    let data = localStorage.getItem('userData');
    if (data) {
        data = JSON.parse(data);
        const existingDataIndex = data.findIndex(entry => entry.date === date);
        if (existingDataIndex !== -1) {
            data[existingDataIndex].bmi = bmi;
        } else {
            data.push(userData);
        }
        localStorage.setItem('userData', JSON.stringify(data));
    } else {
        localStorage.setItem('userData', JSON.stringify([userData]));
    }
}

function resetData() {
    localStorage.removeItem('userData');
}

function clearChart() {
    const ctx = document.getElementById('bmiChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels:  dates,
            datasets: [{
                label: 'BMI',
                data: [],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.1
            }]
        },
         options: {
        elements: {
            line: {
                borderWidth: 2, // ปรับขนาดของเส้นกราฟ
                borderColor: 'rgba(0, 0, 0, 1)' // กำหนดสีของเส้นกราฟเป็นสีดำ
            }
        },
        scales: {
            y: {
                beginAtZero: true
                }
            }
        }
    });
}

function drawChart() {
    const data = JSON.parse(localStorage.getItem('userData'));
    const ctx = document.getElementById('bmiChart').getContext('2d');

    const dates = data.map(entry => entry.date);
    const bmiValues = data.map(entry => entry.bmi);

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{  // กำหนดค่าข้อมูลภายในแผนภูมิแบบเส้น
                label: 'BMI',
                data: bmiValues,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

window.addEventListener('load', function() {
    drawChart();
});
