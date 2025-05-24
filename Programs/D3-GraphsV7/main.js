displayArea = document.querySelector(".displayArea")
gdpButton = document.querySelector(".gdpButton")
energyButton = document.querySelector(".energyButton")
dualButton = document.querySelector(".dualButton")
yearReadOut = document.querySelector("#yearReadOut")
dataReadOut = document.querySelector("#dataReadOut")
mainTitle = document.querySelector("#mainTitle")
infoCenter = document.querySelector(".infoCenter")
graphDescription = document.querySelector("#graphDescription")

let activeChart = 0;

var margin = 80,
    padding = 10, //change for different margins/padding
    width = displayArea.clientWidth - margin * 2,
    height = displayArea.clientHeight

var xScale = d3.scaleTime(),
    yScale = d3.scaleLinear();

function removeChart() {
    while (displayArea.firstChild) { //if an svg area is present
        displayArea.lastChild.remove(); // remove it
    }
    width = displayArea.clientWidth - margin * 2
    height = displayArea.clientHeight //re-apply new width and heigth of the window
    yScale.range([height - margin, margin]);
    xScale.range([margin, width - margin]); // apply new scale range based on window size
}


function getDateRange(datesA, datesB) {

    if (d3.min(datesA) < d3.min(datesB)) {
        var startDate = d3.min(datesB)
    } else {
        var startDate = d3.min(datesA)
    }

    if (d3.max(datesA) > d3.max(datesB)) {
        var endDate = d3.max(datesB)
    } else {
        var endDate = d3.max(datesA)
    }

    var dateRange = []

    for (let i = 0; i < endDate - startDate + 1; i++) {
        dateRange.push(String(Number(startDate) + i))
    }
    return dateRange
}

function createInfoBox(year, relation, title, text) {

    const box = document.createElement("div")
    box.classList.add("infoBox")

    const _year = document.createElement("p")
    _year.innerText = year
    const _relation = document.createElement("p")
    _relation.innerText = relation
    const _title = document.createElement("h2")
    _title.innerText = title
    const _text = document.createElement("p")
    _text.innerText = text

    box.appendChild(_year)
    box.appendChild(_title)
    box.appendChild(_relation)
    box.appendChild(document.createElement("br"))
    box.appendChild(_text)
    infoCenter.appendChild(box)
}

function clearInfo() {
    while (infoCenter.firstChild) {
        infoCenter.lastChild.remove();
    }
}

function displayInfo(year, relation) {
    fetch("./data/Info.json")
        .then((response) => response.json())
        .then((data) => {
            var events = data.Info.find((entry) => entry.Year === year)
            if (events) {
                events.Events.forEach((event) => {
                    if (event.Relation == relation) {
                        createInfoBox(year, event.Relation, event.Title, event.Description)
                    }
                })
            }
        })
}

function checkInfo(year, relation) {
    fetch("./data/Info.json")
        .then((response) => response.json())
        .then((data) => {
            var events = data.Info.find((entry) => entry.Year === year)
            if (events) {
                events.Events.forEach((event, index) => {
                    if (event.Relation == relation) {
                        displayArea.style.cursor = "help"
                    }
                })
            } else {
                displayArea.style.cursor = "auto"
            }
        })
}



function loadDualChart() { // for loading upon load & re-loading upon window resize

    removeChart() // removes svg from DOM

    d3.csv("./data/gdp.csv", function (dataA) { // load gdp.csv data
        d3.csv("./data/energy.csv", function (dataB) { // loads energy data

            //vars
            var gdpYears = [],
                energyYears = dataB.columns,
                gdp = [], //create arrays to hold data
                energy = [];

            // data into arrays
            for (var i = 0; i < dataA.length; i++) { // for every data point in gdp csv
                gdpYears.push(dataA[i].Year) // year data for x-axis


            };

            // Maximum possible date range
            var dateRange = getDateRange(gdpYears, energyYears)

            for (let i = 0; i < dateRange.length; i++) {
                let cleanEnergy = Math.floor(Number((dataB[0][dateRange[i]]).replaceAll(",", "")))
                energy.push(cleanEnergy);

                for (let j = 0; j < dataA.length; j++) {
                    if (dataA[j].Year == dateRange[i]) {
                        var cleanGDP = Number(dataA[j].GDP.replaceAll(",", ""))
                        gdp.push(cleanGDP)
                    }
                }

            }

            //domain scales
            xScale.domain([new Date(d3.min(dateRange)), new Date(d3.max(dateRange))]);
            yScale.domain([d3.min(energy), d3.max(energy)]); // apply domain to x & y axis (using year & gdp arrays)

            //creating axis
            var xAxis = d3.axisBottom()
                .tickArguments([new Date(d3.min(dateRange)), new Date(d3.max(dateRange))]) // numbers applied to axis
                .ticks(dateRange.length / 3) // number of ticks on axis
                .scale(xScale)


            //creating svg area
            var svg = d3.select(".displayArea")
                .append("svg")
                .attr("width", width + 100)
                .attr("height", height + 60);

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

            svg.append("text")
                .attr("class", "axisLabels")
                .attr("text-anchor", "end")
                .attr("x", width / 2)
                .attr("y", height + 10)
                .text("Year");

            var gbpScale = d3.scaleLinear()
                .range([height - margin, margin])
                .domain([d3.min(gdp), d3.max(gdp)])

            //drawing lines
            g.append("path")
                .datum(gdp)
                .attr("fill", "none")
                .attr("stroke", "red")
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                    .x(function (d, i) { return xScale(new Date(dateRange[i])) })
                    .y(function (d) { return gbpScale(d) })
                )

            g.append("path")
                .datum(energy)
                .attr("fill", "none")
                .attr("stroke", "orange")
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                    .x(function (d, i) { return xScale(new Date(dateRange[i])) })
                    .y(function (d) { return yScale(d) })
                )


            g.append("rect")
                .attr("x", function (d, i) { return xScale(new Date(dateRange[i])) - 12 })
                .attr("y", margin)
                .attr("width", (width - 150) / dateRange.length)
                .attr("height", height - margin * 2)
                .attr("fill", "rgba(0, 0, 0, 0)")
                .on('mouseover', function (d, i) {
                    yearReadOut.innerText = `${dateRange[i]}`
                    dataReadOut.innerText = `GDP: £${gdp[i]}M\nEnergy: ${d} PJ`
                    checkInfo(Number(dateRange[i]), "GDP")
                    checkInfo(Number(dateRange[i]), "Energy")
                })
                .on("mouseout", function () {
                    checkInfo(Number(dateRange[i]), "GDP")
                    checkInfo(Number(dateRange[i]), "Energy")
                })
                .on('click', function (d, i) {
                    clearInfo()
                    displayInfo(Number(dateRange[i]), "GDP")
                    displayInfo(Number(dateRange[i]), "Energy")
                })


            //legend
            svg.append("circle")
                .attr("cx", width - padding)
                .attr("cy", height / 2)
                .attr("r", 6)
                .style("fill", "red")
            svg.append("circle")
                .attr("cx", width - padding)
                .attr("cy", height / 2 + 30)
                .attr("r", 6)
                .style("fill", "orange")
            svg.append("text")
                .attr("x", width)
                .attr("y", height / 2)
                .text("GDP")
                .style("fill", "white")
                .style("font-size", "15px")
                .attr("alignment-baseline", "middle")
            svg.append("text")
                .attr("x", width)
                .attr("y", height / 2 + 30)
                .text("Energy Usage")
                .style("fill", "white")
                .style("font-size", "15px")
                .attr("alignment-baseline", "middle")


        })
    })
}

function loadEnergyChart() {

    removeChart()

    d3.csv("./data/energy.csv", function (data) {

        var energy = [],
            energyYears = data.columns;


        for (let i = 0; i < energyYears.length; i++) {
            let cleanEnergy = Math.floor(Number((data[0][energyYears[i]]).replaceAll(",", "")))
            energy.push(cleanEnergy);
        }

        //domain scales
        xScale.domain([new Date(d3.min(energyYears)), new Date(d3.max(energyYears))]);
        yScale.domain([d3.min(energy), d3.max(energy)]); // apply domain to x & y axis

        //creating axis
        var xAxis = d3.axisBottom()
            .tickArguments([new Date(d3.min(energyYears)), new Date(d3.max(energyYears))]) // numbers applied to axis
            .ticks(21) // number of ticks on axis
            .scale(xScale)


        var yAxis = d3.axisLeft()
            .tickArguments([d3.min(energy), d3.max(energy)])
            .ticks(energy.length / 2)
            .scale(yScale)


        // //creating svg area
        var svg = d3.select(".displayArea")
            .append("svg")
            .attr("width", width)
            .attr("height", height + 60)
            .attr('role', 'img');

        var title = svg.append('title')
            .text("A line graph showing the total energy consumption of the UK from 1990 to 2021.");

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
            .attr("class", "axisLabels")
            .attr("text-anchor", "end")
            .attr("x", width / 2)
            .attr("y", height + 10)
            .text("Year");

        svg.append("text")
            .attr("class", "axisLabels")
            .attr("text-anchor", "end")
            .attr("y", 0)
            .attr("x", -height / 2 + margin / 2)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("Petajoules(PJ)");


        // appending data points - path
        g.append("path")
            .datum(energy)
            .attr("fill", "none")
            .attr("stroke", "orange")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function (d, i) { return xScale(new Date(energyYears[i])) })
                .y(function (d) { return yScale(d) })
            )

        g.append("rect") // creating each data point
            .attr("x", function (d, i) { return xScale(new Date(energyYears[i])) - 12 })
            .attr("y", margin)
            .attr("width", (width - 150) / energyYears.length)
            .attr("height", height - margin * 2)
            .attr("fill", "rgba(0, 0, 0, 0)")
            .on('mouseover', function (d, i) {
                yearReadOut.innerText = `${energyYears[i]}`
                dataReadOut.innerText = `Energy: ${d} PJ`
                checkInfo(Number(energyYears[i]), "Energy")
            })
            .on("mouseout", function () {
                checkInfo(Number(energyYears[i]), "Energy")
            })
            .on('click', function (d, i) {
                clearInfo()
                displayInfo(Number(energyYears[i]), "Energy")
            })
    })
}

function loadGDPChart() {
    d3.csv("./data/gdp.csv", function (data) {
        removeChart()

        var gdpYears = [],
            gdp = []; //create arrays to hold data

        for (var i = 0; i < data.length; i++) { // for every data point in gdp csv
            gdpYears.push(data[i].Year) // year data for x-axis
            var cleanGDP = Number(data[i].GDP.replaceAll(",", ""))
            gdp.push(cleanGDP)
        };

        //domain scales
        xScale.domain([new Date(d3.min(gdpYears)), new Date(d3.max(gdpYears))]);
        yScale.domain([d3.min(gdp), d3.max(gdp)]); // apply domain to x & y axis

        //creating axis
        var xAxis = d3.axisBottom()
            .tickArguments([new Date(d3.min(gdpYears)), new Date(d3.max(gdpYears))]) // numbers applied to axis
            .ticks(gdpYears.length / 4) // number of ticks on axis
            .scale(xScale)

        var yAxis = d3.axisLeft()
            .tickArguments([d3.min(gdp), d3.max(gdp)])
            .ticks(gdp.length / 4, ",f")
            .scale(yScale)


        //creating svg area
        var svg = d3.select(".displayArea")
            .append("svg")
            .attr("width", width)
            .attr("height", height + 60)
            .attr('role', 'img');

        var title = svg.append('title')
            .text("A line graph showing the United Kingdoms gross domestic product from 1948 to 2023");

        var g = svg.selectAll("g")
            .data(gdp)
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
            .attr("class", "axisLabels")
            .attr("text-anchor", "end")
            .attr("x", width / 2)
            .attr("y", height + 10)
            .text("Year");

        svg.append("text")
            .attr("class", "axisLabels")
            .attr("text-anchor", "end")
            .attr("y", 90)
            .attr("x", -80)
            .attr("dy", "1rem")
            .attr("transform", "rotate(-90)")
            .text("GDP (Million £)");


        // appending data points - path
        g.append("path")
            .datum(gdp)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function (d, i) { return xScale(new Date(gdpYears[i])) })
                .y(function (d) { return yScale(d) })
            )


        g.append("rect") // creating each data point
            .attr("x", function (d, i) { return xScale(new Date(gdpYears[i])) - 5 })
            .attr("y", margin)
            .attr("width", (width - 150) / gdpYears.length)
            .attr("height", height - margin * 2)
            .attr("fill", "rgba(0, 0, 0, 0)")
            .on('mouseover', function (d, i) {
                yearReadOut.innerText = `${gdpYears[i]}`
                dataReadOut.innerText = `GDP: £${d}M`
                checkInfo(Number(gdpYears[i]), "GDP")
            })
            .on("mouseout", function () {
                checkInfo(Number(gdpYears[i]), "GDP")
            })
            .on('click', function (d, i) {
                clearInfo()
                displayInfo(Number(gdpYears[i]), "GDP")
            })
    })
}

function loadTriChart() { // for loading upon load & re-loading upon window resize

    removeChart() // removes svg from DOM

    d3.csv("./data/gdp.csv", function (dataA) { // load gdp.csv data
        d3.csv("./data/energy.csv", function (dataB) { // loads energy data
            d3.csv("./data/energyPrice.csv", function (dataC) {
                //vars
                var gdpYears = [],
                    energyYears = dataB.columns,
                    energyPriceYears = []
                gdp = [], //create arrays to hold data
                    energy = [],
                    energyPrice = [];

                // data into arrays
                for (var i = 0; i < dataA.length; i++) { // for every data point in gdp csv
                    gdpYears.push(dataA[i].Year) // year data for x-axis
                };

                for (var i = 0; i < dataC.length; i++) { // for every data point in gdp csv
                    if (Number(dataC[i].Year) <= d3.max(energyYears)) {
                        energyPriceYears.push(Number(dataC[i].Year)) // year data for x-axis
                    }
                };
                // Maximum possible date range
                var dateRange = getDateRange(energyPriceYears, energyPriceYears)

                for (let i = 0; i < dateRange.length; i++) {
                    let cleanEnergy = Math.floor(Number((dataB[0][dateRange[i]]).replaceAll(",", "")))
                    energy.push(cleanEnergy);

                    for (let j = 0; j < dataA.length; j++) {
                        if (dataA[j].Year == dateRange[i]) {
                            var cleanGDP = Number(dataA[j].GDP.replaceAll(",", ""))
                            gdp.push(cleanGDP)
                        }
                    }
                    for (let k = 0; k < dataC.length; k++) {
                        if (dataC[k].Year == dateRange[i]) {
                            energyPrice.push(dataC[k]["3,600 kWh/year"])

                        }
                    }
                }

                //domain scales
                xScale.domain([new Date(d3.min(dateRange)), new Date(d3.max(dateRange))]);
                yScale.domain([d3.min(energyPrice), d3.max(energyPrice)]); // apply domain to x & y axis (using year & gdp arrays)

                //creating axis
                var xAxis = d3.axisBottom()
                    .tickArguments([new Date(d3.min(dateRange)), new Date(d3.max(dateRange))]) // numbers applied to axis
                    .ticks(dateRange.length / 3) // number of ticks on axis
                    .scale(xScale)

                var yAxis = d3.axisLeft()
                    .tickArguments([d3.min(energyPrice), d3.max(energyPrice)]) // numbers applied to axis
                    .ticks(energyPrice.length / 3) // number of ticks on axis
                    .scale(yScale)

                //creating svg area
                var svg = d3.select(".displayArea")
                    .append("svg")
                    .attr("width", width + 100)
                    .attr("height", height + 60)
                    .attr('role', 'img');

                var title = svg.append('title')
                    .text("A line graph showing the average domestic energy bill price in the united kingdom from 2010 to 2021 compared to gross domestic product and energy consumption.");

                var g = svg.selectAll("g")
                    .data(dateRange)
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
                    .attr("class", "axisLabels")
                    .attr("text-anchor", "end")
                    .attr("x", width / 2)
                    .attr("y", height + 10)
                    .text("Year");

                var gbpScale = d3.scaleLinear()
                    .range([height - margin, margin])
                    .domain([d3.min(gdp), d3.max(gdp)])

                var energyScale = d3.scaleLinear()
                    .range([height - margin, margin])
                    .domain([d3.min(energy), d3.max(energy)])

                //drawing lines
                g.append("path")
                    .datum(gdp)
                    .attr("fill", "none")
                    .attr("stroke", "rgba(255,0,0,0.1)")
                    .attr("stroke-width", 1.5)
                    .attr("d", d3.line()
                        .x(function (d, i) { return xScale(new Date(dateRange[i])) })
                        .y(function (d) { return gbpScale(d) })
                    )

                g.append("path")
                    .datum(energy)
                    .attr("fill", "none")
                    .attr("stroke", "rgba(0,255,0,0.1)")
                    .attr("stroke-width", 1.5)
                    .attr("d", d3.line()
                        .x(function (d, i) { return xScale(new Date(dateRange[i])) })
                        .y(function (d) { return energyScale(d) })
                    )

                g.append("path")
                    .datum(energyPrice)
                    .attr("fill", "none")
                    .attr("stroke", "cyan")
                    .attr("stroke-width", 1.5)
                    .attr("d", d3.line()
                        .x(function (d, i) { return xScale(new Date(dateRange[i])) })
                        .y(function (d) { return yScale(d) })
                    )

                g.append("rect")
                    .attr("x", function (d, i) { return xScale(new Date(dateRange[i])) - 12 })
                    .attr("y", margin)
                    .attr("width", (width - 150) / dateRange.length)
                    .attr("height", height - margin * 2)
                    .attr("fill", "rgba(0, 0, 0, 0)")
                    .on('mouseover', function (d, i) {
                        yearReadOut.innerText = `${dateRange[i]}`
                        dataReadOut.innerText = `GDP: £${gdp[i]}M\nEnergy: ${energy[i]} PJ\nAvg price: £${energyPrice[i]}`
                        checkInfo(Number(dateRange[i]), "GDP")
                        checkInfo(Number(dateRange[i]), "Energy")
                    })
                    .on("mouseout", function () {
                        checkInfo(Number(dateRange[i]), "GDP")
                        checkInfo(Number(dateRange[i]), "Energy")
                    })
                    .on('click', function (d, i) {
                        clearInfo()
                        displayInfo(Number(dateRange[i]), "GDP")
                        displayInfo(Number(dateRange[i]), "Energy")
                    })


                svg.append("text")
                    .attr("class", "axisLabels")
                    .attr("text-anchor", "end")
                    .attr("y", 0)
                    .attr("x", -height / 2 + margin / 2)
                    .attr("dy", ".75em")
                    .attr("transform", "rotate(-90)")
                    .text("Avg Energy Price (£)");


                //legend
                svg.append("circle")
                    .attr("cx", width - padding)
                    .attr("cy", height / 2 + 60)
                    .attr("r", 6)
                    .style("fill", "rgba(255,0,0,0.4)")
                svg.append("circle")
                    .attr("cx", width - padding)
                    .attr("cy", height / 2 + 30)
                    .attr("r", 6)
                    .style("fill", "rgba(0,255,0,0.4)")
                svg.append("circle")
                    .attr("cx", width - padding)
                    .attr("cy", height / 2)
                    .attr("r", 6)
                    .style("fill", "cyan")
                svg.append("text")
                    .attr("x", width)
                    .attr("y", height / 2 + 60)
                    .text("GDP")
                    .style("fill", "white")
                    .style("font-size", "15px")
                    .attr("alignment-baseline", "middle")
                svg.append("text")
                    .attr("x", width)
                    .attr("y", height / 2 + 30)
                    .text("Energy Usage")
                    .style("fill", "white")
                    .style("font-size", "15px")
                    .attr("alignment-baseline", "middle")
                svg.append("text")
                    .attr("x", width)
                    .attr("y", height / 2)
                    .text("Energy Price")
                    .style("fill", "white")
                    .style("font-size", "15px")
                    .attr("alignment-baseline", "middle")

            })
        })
    })
}


function loadActiveChart() {
    if (activeChart == 0) {
        mainTitle.innerText = "UK Gross Domestic Product (1948 - 2023)"
        graphDescription.innerText = "GDP: Gross Domestic Product\n=\nThe total monetary value of goods produced and services provided in a country (in this case the UK) during one year.\n\nGDP is often used as a health indicator for an economy - more specifically, a high rate of growth indicates a healthy economy and vice versa."
        return loadGDPChart();
    } else if (activeChart == 1) {
        mainTitle.innerText = "UK Total Energy Consumption (1990 - 2021)"
        graphDescription.innerText = "Total energy consumption of primary fuels and equivalents\n=\nThe total amount of energy consumed by domestic (households) and industrial sectors. Energy consumption is calculated via the total use of oil, coal, peat, natural gas, nuclear as well as renewable energy sources.\n\nThe term \"energy\" encompasses all energy use, not just electricity."
        return loadEnergyChart()
    } else if (activeChart == 2) {
        mainTitle.innerText = "UK Average Energy Price per Household (2010 - 2021)"
        graphDescription.innerText = "Average energy price for 3,600 kWh of energy used per year.\n3,600 kWh is the average energy usage for a small household in the UK.\n\nEnergy prices are one of the main factors that directly affect the cost of living for individuals. They are also a factor that impacts scalability and competitiveness in industry."
        return loadTriChart()
    }
}


loadActiveChart()
createInfoBox("", "", "Graph Interaction", "Whilst hovering over the graph a prompt may appear. Clicking whilst the promt is active will display some information about the chosen year in this area.")

window.addEventListener("resize", loadActiveChart)

gdpButton.addEventListener("click", () => {
    activeChart = 0;
    loadActiveChart()
})

energyButton.addEventListener("click", () => {
    activeChart = 1;
    loadActiveChart()
})

dualButton.addEventListener("click", () => {
    activeChart = 2;
    loadActiveChart()
})
