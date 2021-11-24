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
        range: [1, 2.4]
    },
    {
        color: "#74ADD1",
        range: [2.4, 3.8]
    },
    {
        color: "#ABD9E9",
        range: [3.8, 5.2]
    },
    {
        color: "#E0F3F8",
        range: [5.2, 6.6]
    },
    {
        color: "#FFFFBF",
        range: [6.6, 8]
    },
    {
        color: "#FEE090",
        range: [8, 9.4]
    },
    {
        color: "#FDAE61",
        range: [9.4, 10.8]
    },
    {
        color: "#F46D43",
        range: [10.8, 12.2]
    },
    {
        color: "#D73027",
        range: [12.2, 13.6]
    },
    {
        color: "#A50000",
        range: [13.6, 15]
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

const temperatureToColor = (temperature = 0) => {
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

const temperatureFormatted = (temperature) => {
    return `${Number(temperature).toFixed(1)}°C`;
};

const temperatureVarianceFormatted = (variance) => {
    return `${Number(variance) >= 0 ? "+":""}${Number(variance).toFixed(1)}°C`;
};

const addMouseOverEvent = (target = {}) => {
    target.setAttribute("stroke", "black");
    d3.select("#tooltip")
        .attr("data-year", target.getAttribute("data-year"))
        .style("display", "block")
        .style("top", `${target.getAttribute("y") - 80}px`)
        .style("left", `${Math.round(target.getAttribute("x")) + 110}px`);
    d3.select("#tooltip p:nth-child(1)")
        .text(`${target.getAttribute("data-year")} - ${MONTHS[target.getAttribute("data-month")]}`);
    d3.select("#tooltip p:nth-child(2)")
    .text(temperatureFormatted(target.getAttribute("data-temp")));
    d3.select("#tooltip p:nth-child(3)")
    .text(temperatureVarianceFormatted(target.getAttribute("data-variance")));
};

const addMouseOutEvent = (target = {}) => {
    target.setAttribute("stroke", "none");
    d3.select("#tooltip")
        .style("display", "none");
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
                    .attrs({
                        id: "x-axis",
                        transform: `translate(0, ${horizontalDisplacement})`
                    })
                    .call(xAxis)
                    .append("text")
                    .attrs({
                        x: "50%",
                        y: 40,
                        fill: "black"
                    })
                    .attr("dominant-baseline", "middle")
                    .attr("text-anchor", "middle")
                    .text(axisTitle);
    },
    addMonthsAxis: (svgElement = {}, axisTitle, monthsScale, verticalDisplacement) => {
        let yAxis = d3.axisLeft(monthsScale);
        svgElement.append("g")
                    .attrs({
                        id: "y-axis",
                        transform: `translate(${verticalDisplacement}, 0)`
                    })
                    .call(yAxis)
                    .append("text")
                    .attrs({
                        x: "-18%",
                        y: -70,
                        transform: "rotate(270)",
                        fill: "black"
                    })
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
    addCellsOfTemperature: (svgElement = {}, xScale, yScale, graphData) => {
        svgElement.selectAll("rect")
                    .data(graphData)
                    .enter()
                    .append("rect")
                    .attrs({
                        class: "cell",
                        x: (d, i) => xScale(d.year) - 2.5,
                        y: (d, i) => yScale(d.month),
                        width: 0,
                        height: 31,
                        fill: (d, i) => temperatureToColor(d.temperature)
                    })
                    .attr("data-month", (d, i) => monthToNumber(d.month))
                    .attr("data-year", (d, i) => d.year)
                    .attr("data-temp", (d, i) => d.temperature)
                    .attr("data-variance", (d, i) => d.variance)
                    .on("mouseover", (event) => addMouseOverEvent(event.target))
                    .on("mouseout", (event) => addMouseOutEvent(event.target))
                    .transition()
                    .delay((d, i) => (d.year - 1753) * 20)
                    .duration(100)
                    .attr("width", 3.7);
    },
    addTooltip: () => {
        d3.select("main")
            .append("div")
            .attr("id", "tooltip")
            .attr("data-year", 0)
            .selectAll("p")
            .data(["date", "temperature", "variance"])
            .enter()
            .append("p")
            .style("text-transform", "capitalize")
            .text((d, i) => d);
    },
    addTemperatureReference: (svgElement = {}, height, padding) => {
        let xScale = d3.scaleLinear([0, 16], [padding, padding + (COLORS.length * 50)]);
        let xAxis = d3.axisBottom(xScale)
                        .tickValues([1, 2.4, 3.8, 5.2, 6.6, 8, 9.4, 10.8, 12.2, 13.6, 15])
                        .tickFormat(t => t.toFixed(1));
        svgElement.append("g")
                    .attrs({
                        id: "legend",
                        transform: `translate(0, ${height - 40})`
                    })
                    .call(xAxis)
                    .selectAll("rect")
                    .data([1, 2.4, 3.8, 5.2, 6.6, 8, 9.4, 10.8, 12.2, 13.6])
                    .enter()
                    .append("rect")
                    .attrs({
                        x: (d, i) => xScale(d),
                        y: -40,
                        width: 44,
                        height: 40,
                        stroke: "black",
                        fill: (d, i) => COLORS[i]["color"]
                    });
    }
}