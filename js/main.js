import functions from './functions/functions.js';

const showGraph = (dataset, baseTemperature) => {
    let svg = functions.createSvgContainer("main");
    const WIDTH = functions.getSvgWidth(svg);
    const HEIGHT = functions.getSvgHeight(svg);
    const PADDING = 140;
    let xScale = functions.createYearsScale(dataset, WIDTH, PADDING);
    let yScale = functions.createMonthsScale(HEIGHT, PADDING);
    // Use dataset to build heatMap
    functions.addYearsAxis(svg, "years", xScale, (HEIGHT - PADDING));
    functions.addMonthsAxis(svg, "months", yScale, PADDING);
};

document.addEventListener('DOMContentLoaded', () => {
    const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
    fetch(url)
    .then(response => response.json())
    .then(dataset => showGraph(dataset.monthlyVariance, dataset.baseTemperature));
});