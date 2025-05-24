displayArea = document.querySelector(".displayArea")

var margin = 70,
    padding = 30, //change for different margins/padding
    width = displayArea.clientWidth - margin * 2,
    height = displayArea.clientHeight

var xScale = d3.scaleLinear()
    .range([margin, width - margin]);

var yScale = d3.scaleLinear()
    .range([height - margin, margin]);

function loadChart(){ // for loading upon load & re-loading upon window resize

    try{ // try catch incase chart does not exist.
        while(displayArea.firstChild){ //if svg is present
            displayArea.lastChild.remove(); // remove it
        }
        width = displayArea.clientWidth - margin * 2
        height = displayArea.clientHeight //re-apply new width and heigth of the window
        yScale.range([height - margin, margin]);
        xScale.range([margin, width - margin]); // apply new scale range based on window size
    } catch (e) {
        console.error();
    }

    d3.csv("./data/gdp.csv", function(data){ // load gdp.csv data



        var year = [],
            gdp = []; //create arrays to hold data

        for(var i = 0; i < data.length; i ++){ // for every data point in gdp csv
            year.push(data[i].Year) // year data for x-axis

            let cleanGDP = Number((data[i].GDP).replaceAll(",", "")) // cleans and coverts gdp data e.g("300,000" --> 300000)
            gdp.push(cleanGDP) // gdp data for y-axis
        };


        xScale.domain([d3.min(year), d3.max(year)]);
        yScale.domain([d3.min(gdp), d3.max(gdp)]); // apply domain to x & y axis (using year & gdp arrays)


        var xAxis = d3.axisBottom()
            .tickArguments([d3.min(year), d3.max(year)]) // numbers applied to axis
            .ticks(year.length/4) // number of ticks on axis
            .scale(xScale);

        var yAxis = d3.axisLeft()
            .tickArguments([d3.min(gdp), d3.max(gdp)])
            .ticks(gdp.length/6)
            .scale(yScale)


        var svg = d3.select(".displayArea")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        var g = svg.selectAll("g")
            .data(gdp)
            .enter()
            .append("g")
            .attr("transform", function () {
                return `translate(${padding},0)`; //adds padding to data points
            })
        
        svg.append("g")
            .attr("transform", `translate(${padding}, ${height - margin + padding})`) //applys margins and padding to axis
            .call(xAxis);

        svg.append("g")
            .attr("transform", `translate(${margin},0)`)
            .call(yAxis);

        g.append("rect")
        .attr("x", function (d, i) {
            return xScale(year[i]) - 4; // x for each data point
        })
        .attr("y", function (d) {
            return yScale(d) - 4; // y for each data point ~ -4 to center each rect as w and h is 8 as set below
        })
        .attr("height", 8)
        .attr("width", 8)
        .attr("fill", "none")
        .attr("stroke", "green");

    });
}
loadChart()

window.addEventListener("resize", loadChart)


