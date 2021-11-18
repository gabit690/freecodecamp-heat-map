import functions from './functions/functions.js';

const showGraph = () => {
    let svg = d3.select("main").append("svg");
    console.log("Graph Rendered!!!");
};

document.addEventListener('DOMContentLoaded', () => {
    showGraph();
});