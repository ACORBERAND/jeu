// Assurez-vous d'inclure Chart.js dans votre projet
// Vous pouvez ajouter cette ligne dans votre fichier HTML :
// <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

// Initialisation des données du compteur de CO2
let co2Data = [];
let startTime = Date.now();
const maxYears = 300;
const updateInterval = 1000; // Mise à jour toutes les secondes
const yearsPerSecond = 8.3;
const maxDataPoints = Math.floor(maxYears / yearsPerSecond);

// Fonction pour mettre à jour les données du graphique
const updateData = () => {
    co2Accumule = window.co2Accumule;
    o2Accumule = window.o2Accumule;
    console.log(window.co2Accumule);

    // Calculer le temps écoulé en années
    const elapsedTime = (Date.now() - startTime) / 1000 * yearsPerSecond;
    data.labels.push(elapsedTime.toFixed(2)); // Ajouter le temps écoulé en années aux labels
    data.datasets[0].data.push(co2Accumule); // Ajouter la nouvelle valeur de co2Accumule

    // Supprimer les anciennes données si le nombre maximum de points est atteint
    if (data.labels.length > maxDataPoints) {
        data.labels.shift();
        data.datasets[0].data.shift();
    }

    chart.update(); // Mettre à jour le graphique
};

const data = {
    labels: [],
    datasets: [{
        label: 'Compteur de CO2',
        data: [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.2
    }]
};

// Options du graphique
const config = {
    type: 'line',
    data: data,
    options: {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Temps (années)'
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'CO2 Accumulé'
                }
            }
        }
    }
};

const initiateChart = () => {
    const ctx = document.getElementById('co2Chart').getContext('2d');
    chart = new Chart(ctx, config);
    setInterval(updateData, updateInterval); // Mise à jour des données toutes les secondes
};

document.addEventListener('DOMContentLoaded', initiateChart);