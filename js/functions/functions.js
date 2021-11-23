const MONTHS = [
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
];

const COLORS = [
    {
        color: "#4575B4",
        range: [1, 2.5]
    },
    {
        color: "#74ADD1",
        range: [2.5, 4]
    },
    {
        color: "#ABD9E9",
        range: [4, 5.5]
    },
    {
        color: "#E0F3F8",
        range: [5.5, 7]
    },
    {
        color: "#FFFFBF",
        range: [7, 8.5]
    },
    {
        color: "#FEE090",
        range: [8.5, 10]
    },
    {
        color: "#FDAE61",
        range: [10, 11.5]
    },
    {
        color: "#F46D43",
        range: [11.5, 13]
    },
    {
        color: "#D73027",
        range: [13, 14.5]
    }
];

const monthToNumber = (month = "january") => {
        return (MONTHS.indexOf(month));
};
    
const roundedDecimal = (number = 0) => {
    return (Math.round(number * 10) / 10);
};

const numberInRange = (number = 0, range = [0, 1]) => {
    return number >= range[0] && number < range[1];
};

const temperatureToColor = (temperature = 10) => {
    let color = "#aaa";
    let colorWasFound = false;
    let indexOfColors = 0;
    let numberOfColor = COLORS.length;
    do {
        colorWasFound = numberInRange(temperature, COLORS[indexOfColors].range);
        if(colorWasFound)
            color = COLORS[indexOfColors].color;
        indexOfColors++;
    } while(!colorWasFound && indexOfColors < numberOfColor);
    return color;
};

const temperatureFormatted = (temperature = 0) => {
    return `${temperature.toFixed(1)}°C`;
};

const temperatureVarianceFormatted = (variance = 0) => {
    return `${variance >= 0 ? "+":""}${variance.toFixed(1)}°C`;
};

export default {
    createSvgContainer: (parent = "body") => {
        return d3.select(parent).append("svg");
    },
    getSvgWidth: (svgElement = {}) => {
        return Number(svgElement.style("width").slice(0,-2));
    },
    getSvgHeight: (svgElement = {}) => {
        return Number(svgElement.style("height").slice(0,-2));
    },
    createYearsScale: (dataset, width, padding) => {
        return d3.scaleLinear()
                    .domain([d3.min(dataset, (d) => d.year) - 1, d3.max(dataset, (d) => d.year) + 1])
                    .range([padding, width - padding]);
    },
    createMonthsScale: (height, padding) => {
        return d3.scaleBand()
                    .domain(MONTHS)
                    .range([height - padding, padding / 2]);
    },
    addYearsAxis: (svgElement = {}, axisTitle, yearsScale, horizontalDisplacement) => {
        let xAxis = d3.axisBottom(yearsScale)
                        .ticks(26)
                        .tickFormat(d3.format("d"));
        
        svgElement.append("g")
                    .attr("id", "x-axis")
                    .attr("transform", `translate(0, ${horizontalDisplacement})`)
                    .call(xAxis)
                    .append("text")
                    .attr("x", "50%")
                    .attr("y", 40)
                    .attr("dominant-baseline", "middle")
                    .attr("text-anchor", "middle")
                    .attr("fill", "black")
                    .text(axisTitle);
    },
    addMonthsAxis: (svgElement = {}, axisTitle, monthsScale, verticalDisplacement) => {
        let yAxis = d3.axisLeft(monthsScale);

        svgElement.append("g")
                    .attr("id", "y-axis")
                    .attr("transform", `translate(${verticalDisplacement}, 0)`)
                    .call(yAxis)
                    .append("text")
                    .attr("x", "-18%")
                    .attr("y", -70)
                    .attr("transform", "rotate(270)")
                    .attr("fill", "black")
                    .text(axisTitle);
    },
    getGraphDataset: (dataset, baseTemperature) => {
        let graphDataset = dataset.map(element => {
            return {
                year: element.year,
                month: MONTHS[element.month - 1],
                temperature: roundedDecimal(baseTemperature + element.variance),
                variance: roundedDecimal(element.variance)
            };
        });
        return graphDataset;
    },
    buildHeatMap: (svgElement = {}, xScale, yScale, graphData) => {
        svgElement.selectAll("rect")
                    .data(graphData)
                    .enter()
                    .append("rect")
                    .attr("class", "cell")
                    .attr("data-month", (d, i) => monthToNumber(d.month))
                    .attr("data-year", (d, i) => d.year)
                    .attr("data-temp", (d, i) => d.temperature)
                    .attr("color-code", (d, i) => temperatureToColor(d.temperature))
                    .attr("x", (d, i) => xScale(d.year) - 2.5)
                    .attr("y", (d, i) => yScale(d.month))
                    .attr("width", 5)
                    .attr("height", 31)
                    .attr("fill", (d, i) => temperatureToColor(d.temperature));
    },
    addTemperatureReference: (svgElement = {}, height, padding) => {
        
        let xScale = d3.scaleLinear([0.0, 15.5], [padding, padding + (COLORS.length * 50)]);
        let xAxis = d3.axisBottom(xScale)
                        .tickValues([1, 2.5, 4, 5.5, 7, 8.5, 10, 11.5, 13, 14.5])
                        .tickFormat(t => t.toFixed(1));

        svgElement.append("g")
                    .attr("id", "legend")
                    .attr("transform", `translate(0, ${height - 40})`)
                    .call(xAxis)
                    .selectAll("rect")
                    .data([1, 2.5, 4, 5.5, 7, 8.5, 10, 11.5, 13])
                    .enter()
                    .append("rect")
                    .attr("x", (d, i) => xScale(d))
                    .attr("y", -40)
                    .attr("width", 44)
                    .attr("height", 40)
                    .attr("stroke", "black")
                    .attr("fill", (d, i) => COLORS[i]["color"]);
    }

}