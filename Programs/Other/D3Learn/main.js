const width = 800;
const height = 800;

var data = [10, 15, 20, 25, 30];
var colours = ["red", "green", "blue", "magenta", "pink"];

var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var g = svg.selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .attr("transform", function (d, i) {
        return "translate(100,100)";
    })

g.append("circle")
    .attr("cx", function (d, i) {
        return i * 50;
    })

    .attr("cy", function (d, i) {
        return i * 10 + 100;
    })

    .attr("r", function (d) {
        return d;
    })

    .attr("fill", function (d, i) {
        return colours[i];
    })

g.append("text")
    .attr("x", function (d, i) {
        return i * 50 + 15;
    })
    .attr("y", 10)
    .attr("stroke", "teal")
    .attr("font-size", "12px")
    .attr("font-family", "sans-serif")
    .text(function (d) {
        return d;
    });


