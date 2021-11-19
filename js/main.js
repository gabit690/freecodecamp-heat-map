import functions from './functions/functions.js';

const showGraph = (dataset, baseTemperature) => {
    let svg = d3.select("main").append("svg");
    const WIDTH = Number(svg.style("width").slice(0,-2));
    const HEIGHT = Number(svg.style("height").slice(0,-2));
    const PADDING = 140;

    let xScale = d3.scaleLinear()
                    .domain([d3.min(dataset, (d) => d.year), d3.max(dataset, (d) => d.year)])
                    .range([PADDING, WIDTH - PADDING]);

    let yScale = d3.scaleBand()
                    .domain([
                        "january", 
                        "february", 
                        "march",
                        "april", 
                        "may", 
                        "june",
                        "july",
                        "august",
                        "september",
                        "october",
                        "november",
                        "december"
                    ])
                    .range([HEIGHT - PADDING, PADDING / 2]);

    let xAxis = d3.axisBottom(xScale).ticks(26);
    let yAxis = d3.axisLeft(yScale);

    svg.append("g")
        .attr("transform", `translate(0, ${HEIGHT - PADDING})`)
        .call(xAxis);

    svg.append("text")
        .attr("x", "50%")
        .attr("y", HEIGHT - PADDING + 40)
        .attr("dominant-baseline", "middle")
        .attr("text-anchor", "middle")
        .text("years");

    svg.append("g")
        .attr("transform", `translate(${PADDING}, 0)`)
        .call(yAxis);

    svg.append("text")
        .attr("x", "-20%")
        .attr("y", PADDING - 70)
        .attr("transform", "rotate(270)")
        .text("months");
};

document.addEventListener('DOMContentLoaded', () => {
    const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
    fetch(url)
    .then(response => response.json())
    .then(dataset => showGraph(dataset.monthlyVariance, dataset.baseTemperature));
});