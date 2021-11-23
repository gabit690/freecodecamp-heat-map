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
    "#000080",
    "#4D55AA",
    "#9AA9D5",
    "#E7FEFF",
    "#FFFFE0",
    "#E5B5A1",
    "#CC6C61",
    "#B22222"
]

export default {
    numberToMonth: (number) => {
        if(isNaN(number) || number < 1 || number > 12)
            return "";
        return MONTHS[number - 1];
    },
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
                    .domain([d3.min(dataset, (d) => d.year), d3.max(dataset, (d) => d.year)])
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
    addTemperatureReference: (svgElement = {}, height, padding) => {
        
        let xScale = d3.scaleLinear([0.0, 17.0], [padding, padding + (COLORS.length * 50)]);
        let xAxis = d3.axisBottom(xScale)
                        .tickValues([0.0, 2.5, 4, 5.5, 7, 8.5, 10, 11.5, 13, 14.5, 17.0])
                        .tickFormat(t => t);

        svgElement.append("g")
                    .attr("id", "legend")
                    .attr("transform", `translate(0, ${height - 40})`)
                    .call(xAxis)
                    .selectAll("rect")
                    .data([2.5, 4, 5.5, 7, 8.5, 10, 11.5, 13])
                    .enter()
                    .append("rect")
                    .attr("x", (d, i) => xScale(d))
                    .attr("y", -40)
                    .attr("width", 35.5)
                    .attr("height", 40)
                    .attr("stroke", "black")
                    .attr("fill", (d, i) => COLORS[i]);
    }

}