displayArea = document.querySelector(".displayArea")

var margin = 70,
    padding = 70, //change for different margins/padding
    width = displayArea.clientWidth - margin * 2,
    height = displayArea.clientHeight 

var xScale = d3.scaleLinear(),
    yScale = d3.scaleLinear();

function removeChart (){
    try{ // try catch incase chart does not exist.
        while(displayArea.firstChild){ //if an svg area is present
            displayArea.lastChild.remove(); // remove it
        }
        width = displayArea.clientWidth - margin * 2
        height = displayArea.clientHeight //re-apply new width and heigth of the window
        yScale.range([height - margin, margin]);
        xScale.range([margin, width - margin]); // apply new scale range based on window size
    } catch (e) {
        console.error();
    }
}

function check(){
    while(displayArea.firstChild !== displayArea.lastChild){ //if more than one svg area is present
        displayArea.lastChild.remove(); // remove it
    }
}

function getDateRange(datesA, datesB){
    
    if (d3.min(datesA) < d3.min(datesB)){
        var startDate = d3.min(datesB)
    } else {
        var startDate = d3.min(datesA)
    }

    if (d3.max(datesA) > d3.max(datesB)){
        var endDate = d3.max(datesB)
    } else {
        var endDate = d3.max(datesA)
    }

    var dateRange = []

    for(let i = 0; i < endDate-startDate+1; i++){
        dateRange.push(String(Number(startDate)+i))
    }
    return dateRange
}


function loadChart(){ // for loading upon load & re-loading upon window resize

    removeChart() // removes svg from DOM

    d3.csv("./data/gdp.csv", function(dataA){ // load gdp.csv data
        d3.csv("./data/energy.csv", function(dataB){
        
        //vars
        var gdpYears = [],
            energyYears = dataB.columns,
            gdp = [], //create arrays to hold data
            energy = [];
            
            

        // data into arrays
        for(var i = 0; i < dataA.length; i ++){ // for every data point in gdp csv
            gdpYears.push(dataA[i].Year) // year data for x-axis

            
        };

        // Maximum possible date range
        var dateRange = getDateRange(gdpYears, energyYears)

        for(let i = 0; i < dateRange.length; i++){
            let cleanEnergy = Math.floor(Number((dataB[0][dateRange[i]]).replaceAll(",", "")))
            energy.push(cleanEnergy);

            for(let j = 0; j < dataA.length; j++){
                if (dataA[j].Year == dateRange[i]){
                    var cleanGDP = Number(dataA[j].GDP.replaceAll(",", ""))
                    gdp.push(cleanGDP)
                }
            }
            
        }
        
        //domain scales
        xScale.domain([d3.min(dateRange), d3.max(dateRange)]);
        yScale.domain([d3.min(energy), d3.max(energy)]); // apply domain to x & y axis (using year & gdp arrays)

        //creating axis
        var xAxis = d3.axisBottom()
            .tickArguments([d3.min(dateRange), d3.max(dateRange)]) // numbers applied to axis
            .ticks(gdpYears.length/4) // number of ticks on axis
            .scale(xScale)
            
            

        var yAxis = d3.axisLeft()
            .tickArguments([d3.min(energy), d3.max(energy)])
            .ticks(energy.length/2 ,",f")
            .scale(yScale)
            

        //creating svg area
        var svg = d3.select(".displayArea")
            .append("svg")
            .attr("width", width)
            .attr("height", height + 100);

        var g = svg.selectAll("g")
            .data(energy)
            .enter()
            .append("g")
            .attr("transform", function () {
                return `translate(10,0)`; //adds padding to data points
            })
        
        //appending axis to svg
        svg.append("g")
            .attr("transform", `translate(10, ${height - margin + padding})`) //applys margins and padding to axis
            .call(xAxis);

        svg.append("g")
            .attr("transform", `translate(${margin},0)`)
            .call(yAxis);

        svg.append("text")
            .attr("class","axisLabels")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height + 10)
            .text("Year");

        svg.append("text")
        .attr("class", "axisLabels")
        .attr("text-anchor", "end")
        .attr("y", 0)
        .attr("x", -height/2 + margin)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Petajoules(PJ)");


        var gbpScale = d3.scaleLinear()
            .range([5,85])
            .domain([d3.min(gdp), d3.max(gdp)])

        // appending data points - rect - to groups
        g.append("rect")
        .attr("x", function (d, i) {
            return xScale(dateRange[i]) - 5; // x for each data point
        })
        .attr("y", function (d) {
            return yScale(d) // y for each data point ~ -4 to center each rect as w and h is 8 as set below
        })
        .attr("height", function(d, i){
            return gbpScale(gdp[i])
        })
        .attr("width", 10)
        .attr("fill", "rgb(255, 102, 0")

        })
    })
    check() // checks there is only one svg -- doesnt work very well :/
}

loadChart()

window.addEventListener("resize", loadChart)


