import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const displayArea = document.querySelector(".displayArea"),
        gdpButton = document.querySelector(".gdpButton"),
        energyButton = document.querySelector(".energyButton"),
        dualButton = document.querySelector(".dualButton"),
        yearReadOut = document.querySelector("#yearReadOut"),
        dataReadOut = document.querySelector("#dataReadOut"),
        mainTitle = document.querySelector("#mainTitle"),
        infoCenter = document.querySelector(".infoCenter"),
        graphDescription = document.querySelector("#graphDescription")

// Data from csv
const gdpData = await d3.csv("./data/gdp.csv");
const energyUsageData = await d3.csv("./data/energy.csv");
const energyPriceData = await d3.csv("./data/energyPrice.csv");

var GDP = {name: "GDP", data : [], years : [], yLabel : "", colour : "red"},
    energyUsage = {name: "EU", data : [], years : [], yLabel : "", colour : "orange"},
    energyPrice = {name: "EP", data : [], years : [], yLabel : "", colour : "cyan"};

// GDP
for (var i = 0; i < gdpData.length; i++){
    var data = Number(gdpData[i].GDP.replaceAll(",", ""))
    GDP.data.push(data)
    GDP.years.push(gdpData[i].Year)
}

// Energy Usage
energyUsage.years = energyUsageData.columns
for (var i = 0; i < energyUsage.years.length; i++) {
    var data = Math.floor(Number(energyUsageData[0][energyUsage.years[i]].replaceAll(",", "")))
    energyUsage.data.push(data);
}

// Energy Price
for (var i = 0; i < energyPriceData.length; i++) {
    energyPrice.data.push(Number(energyPriceData[i]["3,600 kWh/year"]))
    energyPrice.years.push(energyPriceData[i].Year)
}

var activeData = GDP
 
var margin = 80,
    padding = 10, //change for different margins/padding
    width = displayArea.clientWidth - margin * 2,
    height = displayArea.clientHeight

var xScale = d3.scaleTime()
        .range([margin, width - margin])
        .domain([new Date(d3.min(activeData.years)), new Date(d3.max(activeData.years))]),
    yScale = d3.scaleLinear()
        .range([height - margin, margin])
        .domain([d3.min(activeData.data), d3.max(activeData.data)]);

var xAxis = d3.axisBottom()
        .tickArguments([new Date(d3.min(activeData.years)), new Date(d3.max(activeData.years))]) // numbers applied to axis
        .ticks(activeData.years.length / 4) // number of ticks on axis
        .scale(xScale)

var yAxis = d3.axisLeft()
        .tickArguments([d3.min(activeData.data), d3.max(activeData.data)]) // numbers applied to axis
        .ticks(activeData.data.length / 3) // number of ticks on axis
        .scale(yScale)

var svg = d3.select(".displayArea")
        .append("svg")
        .attr("width", width + 100)
        .attr("height", height + 60);

var g = svg.selectAll("g")
        .data(activeData.data)
        .enter()
        .append("g")
        .attr("transform", function () {
            return `translate(10,0)`; //adds padding to data points
        })

svg.append("g")
    .attr("class", "xAxis")
    .attr("transform", `translate(10, ${height - margin + padding})`) //applys margins and padding to axis
    .call(xAxis);

svg.append("g")
    .attr("class", "yAxis")
    .attr("transform", `translate(${margin},0)`)
    .call(yAxis);

var path = g.append("path")
.datum(activeData.data)
.attr("fill", "none")
.attr("stroke", activeData.colour)
.attr("stroke-width", 1.5)
.attr("d", d3.line()
    .x(function (d, i) { return xScale(new Date(activeData.years[i])) })
    .y(function (d) { return yScale(d) })
)

function updateChart(newData) {
    xScale.domain([new Date(d3.min(newData.years)), new Date(d3.max(newData.years))]);
    yScale.domain([d3.min(newData.data), d3.max(newData.data)]);

    svg.select(".xAxis")
        .transition()
        .duration(1000)
        .call(d3.axisBottom(xScale).ticks(newData.years.length / 4));

    svg.select(".yAxis")
        .transition()
        .duration(1000)
        .call(d3.axisLeft(yScale).ticks(newData.data.length / 3));

    path
        .datum(newData.data)
        .transition()
        .duration(1000)
        .ease(d3.easeCubic)
        .attr("stroke", newData.colour)
        .attr("d", d3.line()
            .x((d, i) => xScale(new Date(newData.years[i])))
            .y(d => yScale(d))
        );

}

gdpButton.addEventListener("click", () => updateChart(GDP));
energyButton.addEventListener("click", () => updateChart(energyUsage));
dualButton.addEventListener("click", () => updateChart(energyPrice));