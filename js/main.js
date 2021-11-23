import functions from './functions/functions.js';

const showGraph = (dataset, baseTemperature) => {
    let svg = functions.createSvgContainer("main");
    const WIDTH = functions.getSvgWidth(svg);
    const HEIGHT = functions.getSvgHeight(svg);
    const PADDING = 150;
    let xScale = functions.createYearsScale(dataset, WIDTH, PADDING);
    let yScale = functions.createMonthsScale(HEIGHT, PADDING);
    functions.addYearsAxis(svg, "years", xScale, (HEIGHT - PADDING));
    functions.addMonthsAxis(svg, "months", yScale, PADDING);
    let graphData = functions.getGraphDataset(dataset, baseTemperature);
    console.log(dataset);
    console.log(graphData);
    functions.buildHeatMap(svg, xScale, yScale, graphData);
    functions.addTemperatureReference(svg, HEIGHT, PADDING);
};

document.addEventListener('DOMContentLoaded', () => {
    const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
    fetch(url)
    .then(response => response.json())
    .then(dataset => showGraph(dataset.monthlyVariance, dataset.baseTemperature));
});