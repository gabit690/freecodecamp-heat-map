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

const temperatureFormatted = (temperature) => {
    return `${Number(temperature).toFixed(1)}°C`;
};

const temperatureVarianceFormatted = (variance) => {
    return `${Number(variance) >= 0 ? "+":""}${Number(variance).toFixed(1)}°C`;
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
                    .attr("data-variance", (d, i) => d.variance)
                    .attr("x", (d, i) => xScale(d.year) - 2.5)
                    .attr("y", (d, i) => yScale(d.month))
                    .attr("width", 3.7)
                    .attr("height", 31)
                    .attr("fill", (d, i) => temperatureToColor(d.temperature))
                    .on("mouseover", (event) => {
                        let rect = event.target;
                        console.log(rect);
                        rect.setAttribute("stroke", "black");
                        d3.select("#tooltip")
                            .attr("data-year", event.target.getAttribute("data-year"))
                            .style("display", "block")
                            .style("top", `${rect.getAttribute("y") - 80}px`)
                            .style("left", `${Math.round(rect.getAttribute("x")) + 110}px`);
                        d3.select("#tooltip p:nth-child(1)")
                            .text(`${rect.getAttribute("data-year")} - ${MONTHS[rect.getAttribute("data-month")]}`);
                        d3.select("#tooltip p:nth-child(2)")
                        .text(temperatureFormatted(rect.getAttribute("data-temp")));
                        d3.select("#tooltip p:nth-child(3)")
                        .text(temperatureVarianceFormatted(rect.getAttribute("data-variance")));
                    })
                    .on("mouseout", (event) => {
                        let rect = event.target;
                        rect.setAttribute("stroke", "none");
                        d3.select("#tooltip")
                            .style("display", "none");
                    });
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
                    .attr("id", "legend")
                    .attr("transform", `translate(0, ${height - 40})`)
                    .call(xAxis)
                    .selectAll("rect")
                    .data([1, 2.4, 3.8, 5.2, 6.6, 8, 9.4, 10.8, 12.2, 13.6])
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