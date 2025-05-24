var margin = { top: 30, right: 30, bottom: 70, left: 60 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom,
    textArea = document.querySelector("#text_area");

var data = [
    { hair_colour: "Dark_Brown", value: 8 },
    { hair_colour: "Grey", value: 1 },
    { hair_colour: "Brown", value: 4 },
    { hair_colour: "Blonde", value: 4 },
    { hair_colour: "NA", value: 1 }
]

var colours = ["#574324", "#948a7b", "#a67f46", "#a39746", "#e79be8"]


// append the svg object to the body of the page
var svg = d3.select("#chart_area")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// X axis
var x = d3.scaleBand()
    .range([0, width])
    .domain(data.map(function (d) { return d.hair_colour; }))
    .padding(0.2);
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

// Add Y axis
var y = d3.scaleLinear()
    .domain([0, 8])
    .range([height, 0]);
svg.append("g")
    .call(d3.axisLeft(y));

// Bars
svg.selectAll("mybar")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function (d) { return x(d.hair_colour); })
    .attr("y", function (d) { return y(d.value); })
    .attr("width", x.bandwidth())
    .attr("height", function (d) { return height - y(d.value); })
    .attr("fill", function (d, i) { return colours[i] })
    .attr("class", function (d) { return d.hair_colour })

    .on('mouseover', function (d, i) {
        textArea.innerText = `${d.hair_colour}`
    })


// function displayData() {
//     textArea = document.querySelector("#text_area")
// }

// svg.addEventListener("hover", displayData);

