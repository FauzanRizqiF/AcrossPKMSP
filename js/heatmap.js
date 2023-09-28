// Get references to HTML elements
const imageInput = document.getElementById("imageInput");
const analyzeButton = document.getElementById("analyzeButton");
const percentageText = document.getElementById("percentage");
const pieChartCanvas = document.getElementById("pieChart");

// Initialize Chart.js
const ctx = pieChartCanvas.getContext("2d");

const pieChart = new Chart(ctx, {
    type: "pie",
    data: {
        labels: ["Red Pixels", "Other Pixels"],
        datasets: [
            {
                data: [0, 100], // Initial data (0% red, 100% other)
                backgroundColor: ["red", "lightgray"],
            },
        ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: true,
        },
    },
});

// Listen for the "Analyze Image" button click
analyzeButton.addEventListener("click", analyzeImage);

// Function to handle image analysis and update the pie chart
function analyzeImage() {
    const file = imageInput.files[0];
    if (!file) {
        alert("Please select an image.");
        return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const context = canvas.getContext("2d");
        context.drawImage(img, 0, 0, img.width, img.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let redPixelCount = 0;
        for (let i = 0; i < data.length; i += 4) {
            const red = data[i];
            const green = data[i + 1];
            const blue = data[i + 2];

            if (red > 100 && green < 50 && blue < 50) {
                redPixelCount++;
            }
        }

        const totalPixels = img.width * img.height;
        const redPixelPercentage = ((redPixelCount / totalPixels) * 100).toFixed(2);
        const otherPixelPercentage = (100 - redPixelPercentage).toFixed(2);

        // Update the pie chart data
        pieChart.data.datasets[0].data = [redPixelPercentage, otherPixelPercentage];
        pieChart.update();

        percentageText.textContent = redPixelPercentage + "%";
    };
}
