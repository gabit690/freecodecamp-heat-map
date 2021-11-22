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
                    .attr("transform", `translate(0, ${horizontalDisplacement})`)
                    .call(xAxis);
    
        svgElement.append("text")
                    .attr("x", "50%")
                    .attr("y", horizontalDisplacement + 40)
                    .attr("dominant-baseline", "middle")
                    .attr("text-anchor", "middle")
                    .text(axisTitle);
    },
    addMonthsAxis: (svgElement = {}, axisTitle, monthsScale, verticalDisplacement) => {
        let yAxis = d3.axisLeft(monthsScale);

        svgElement.append("g")
                    .attr("transform", `translate(${verticalDisplacement}, 0)`)
                    .call(yAxis);
    
        svgElement.append("text")
                    .attr("x", "-20%")
                    .attr("y", verticalDisplacement - 70)
                    .attr("transform", "rotate(270)")
                    .text(axisTitle);
    }

}