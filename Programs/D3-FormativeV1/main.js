var margins = 50

const width = document.querySelector(".displayArea").clientWidth - margins //gets width is displayArea class set in style.css
const height = 600;

var years = [1920, 1930, 1940, 1950, 1960, 1970],
    energy = [19, 22, 23, 27, 32, 40]; // random test data

var startDate = 2000;
var endDate = 2019; // chosing date ranges -- left for later version


// d3.csv("gdp.csv", function (data) {
//     var gdp = []
//     for (var i = 0; i < data.length; i++) {
//         gdp.push(data[i].GDP);
//     }
// }); Starting new version - async making it difficult

// Can't make GDP array outside of d3.csv function easily

var xScale = d3.scaleLinear() //linear scales for year data
    .domain([d3.min(years), d3.max(years)]) // 1920 - 1970
    .range([0, width - (margins * 2)]);

var yScale = d3.scaleLinear()
    .domain([d3.min(energy), d3.max(energy)])
    .range([height, 100]);

var xAxis = d3.axisBottom()
    .tickArguments(years.length)
    .scale(xScale);

var yAxis = d3.axisLeft()
    .scale(yScale)
    .tickSize(10)
    .tickArguments([d3.max(energy) - d3.min(energy)])
    .tickPadding(2);

var svg = d3.select(".displayArea")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var g = svg.selectAll("g")
    .data(energy) //uses energy array data
    .enter()
    .append("g")
    .attr("transform", function (d, i) {
        return "translate(10,10)";
    }) //moves data points over 10,10

svg.append("g")
    .attr("transform", `translate(${margins + 10}, ${height - 20})`)
    .call(xAxis);

svg.append("g")
    .attr("transform", `translate(30,${-margins})`)
    .call(yAxis); // appending axis to svg

g.append("circle") // creating each data point
    .attr("cx", function (d, i) {
        return xScale(years[i]) + margins; // x of circles = year index
    })

    .attr("cy", function (d) { // y of circles = energy data
        return yScale(d) - margins - 10;
    })

    .attr("r", function (d) {
        return 20; //set cirlce radius
    })

    .attr("fill", "none")
    .attr("stroke", "green");




