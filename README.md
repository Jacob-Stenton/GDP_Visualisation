# Visualisation-Sensing

#### Dev Log

[Current site](https://git.arts.ac.uk/pages/21026540/Visualisation-Sensing/)

The goal of this project is to create a visualisation using D3 to present to corrolation between overall [energy usage](/Data/energyconsumptionbyindustry.xlsx) and [gross domestic product](/Data/statistic_id281744_gdp-of-the-uk-1948-2023.xlsx) in the UK.

## [V1](/Programs/D3-FormativeV1/main.js) - Understanding D3

![D3 chart with random data.](/imgs/ChartOneD3.PNG "First D3 Chart")
This is a basic chart made with d3, using hard coded random data.
The purpose of this was to help grasp d3 a little better.
During development I did try and use d3's csv parser, however I ran into a few issues. I was attempting to load yearly GDP (Gross Dometic Product) data into an array. I beleive my issue was that the d3.csv function is asynchronous - meaning I couldn't update the global gdp array until the function was complete.
I tried I few methods to fix this but couldn't get them to work.

Link(s): <br>
[Learn JS Data](http://learnjsdata.com/read_data.html) --> Outdated? <br>
[D3 Docs](https://d3js.org/d3-fetch) <br>
[stackoverflow](https://stackoverflow.com/questions/9491885/csv-to-array-in-d3-js) <br>

In version two I am going to focus on reading csv data, however I am expecting to have issues with reading multiple csv files for one graph. - If this is the case, using python, I am going to create a new sigle csv file with all the data points required for making the graph.

## [V2](/Programs/D3-FormativeV2/main.js) - Still Understanding D3

![D3 chart with UK GDP data](/imgs/Chartv2.PNG "Updated d3 chart")

- In version two the new chart doesn't look much different, but has a few notable changes. First of all, the chart now uses the data from [gdp.csv](/Data/gdp.csv). The years and GDP data has been implomented on the X and Y axis respectively.
- The entire chart has now been made resposive - A change in window size is refelcted in the size of the chart.
- Each singular data point have been changed from cirlces to rectangles. This is for v3, where rectangle sizes can be used to display data.

Link(s): <br>
[Observble D3](https://observablehq.com/@d3) <br>

Version three will include all the relevant data to create the full visualisation. - Years, GDP(£) and Energy Usage(PJ). The issue with this is that energy and GDP are from different charts and have differing data ranges. GDP data is recorded from 1948 to 2023, where energy usage is recorded from 1990 to 2021. This will mean ignoring nearly half of data for the final chart.

## [V3](/Programs/D3-GraphsV3/main.js) - Energy & GDP data

![D3 chart with energy and GDP data](/imgs/Chartv3.PNG "Complete Chart")

- Version three incorporated both data sets
- Styling changes
- Reading the chart is now a little difficult. Reading PJ does not give an exact number and each orange bar cannot give an exact reading of GDP. This indicates that the chart I'm using is not apropriate for the type of data it is trying to display.

For version four I will create two other seperate charts displaying GDP and energy individually. I am also going to research other chart types to visualise the final graph (e.g converging line graph).

- I would also like to add hover event to data points that indicates a possible turning point in each year

## [V4](/Programs/D3-GraphsV4/main.js) - Individual Charts

![D3 chart for energy](/imgs/EnergyGrpahv4.PNG "Energy Chart") ![D3 chart for GDP](/imgs/GDPGraphv4.PNG "GDP Chart") ![D3 chart for GDP and Energy](/imgs/GDPnEnergyGraphv4.PNG "GDP Chart")

- Version four now includes three different line graphs to display GDP, Energy and then GDP/Energy together.
- I've also added a function to switch between all three graphs without reloading the page.
- Having GDP and energy charted individually make the information much more readable.
- For the correlation graph I decided to keep the x axis (years) and remove the y axis as it is useless and confusing to read.

Link(s): <br>
[Observble D3 line/path](https://d3-graph-gallery.com/graph/line_basic.html) <br>

- Version four will focus a little more on funtionality and aesthetics. This inlcudes adding buttons to change graphs and perhaps some information on each charts data (where the data is from/ its ranges ect).
- I will also look into placing informational hover points along each line to refer to important finacial/energy events. To start I will simply have the data points display their exact values on the graph.
- As a stretch I may also look into animating between each graph, however I expect to have some issues with this with how I have designed each chart individually. (Will have to save this for a later version)

## [V5](/Programs/D3-GraphsV5/main.js) - UI and Interaction

![UI menu](/imgs/GDPEnergyv5.PNG "Converging chart with menu")

- I've had a very persistant issue with one of the graphs where sometiems two SVGs are created. - not 100% sure why this happens but I think it is to do with d3.csv being an async function.
- Added titles to each graph.
- Created a menu system to switch between data visualisations.
- Used .on("mouseover") event on invisible rects to easily read data from each graph and display it below the graph menu. - This has made each graph extremely easy to read.
- Swapped X axis from a linear scale to a time scale to remove the comma from each date.
- Added a legend to the GDP and Energy graph. (Also swapped line colours around as they were previously opposite to their respective graphs)

Link(s) <br>
[D3JS Time scales](https://d3js.org/d3-scale/time)<br>

- I'm reasonably happy with each graph in their current states, so moving forward they should mosty stay the same.
- Version six will include major historical events that may have affected each data point's trajectory.
- I may also add some smaller graphs, related to the energy section, displaying how different industrial sector's energy consumption has changed over time.

## [V6](/Programs/D3-GraphsV6/main.js) - UI and Interaction

![site information tabs](/imgs/InfoTabsv6.PNG "Information tabs")

- In version six I have added information tabs that are displayed when a year is selected on the graph.
- Not all years have inforamtion connected to them which can create some confusion. To fix this I have added a ? promt on the cursor to inform when there is information connected to a data point.
- I created some functions to read the information from a local JSON file and then populate the data into some DOM elements.

### ChatGPT use

- To complete this information stage I used chatGPT 3.5 from OpenAI to gather the mass of information quickly.
- I asked it to collate information relating to the UKs GDP and total energy consumtion between the years of 1948 and 2021.
- As chatGPT 3.5 does not have full access to the internet I was unable to get details from 2022-2024. There might also be some inaccuracies in the info gathered.
- I also asked it to write the data in a JSON format - I gave the file below as a template to how I wanted it structured.
  ![JSON Structure](/imgs/ChatGPTJSONFormat.PNG "Incomplete JSON data")<br>

Link(s) <br>
[Cursor properties](https://www.w3schools.com/jsref/prop_style_cursor.asp)<br>
[Creating DOM elements](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement)<br>
[Fetching JSON data](https://www.freecodecamp.org/news/how-to-read-json-file-in-javascript/)<br>

- For version seven I need to make a landing page for the entire site with hyperlinks to each graph.
- I am also going to add more information on what the graph shows.
- I'll also be adding some data about the average price of energy in each year.

## [V7](/Programs/D3-GraphsV7/main.js) - Landing page & extra info

- Version 7 introduced a new [Energy price](/Data/energyPrice.csv) dataset.
- Energy price has been layered on top GDP and energy usage in the third graph.
- I've added some descriptions to each graph which simply lays out some important information for each dataset.
- I also added an initial info card at the bottom of the page, giving instruction on how to interact with the graph.
  ![New Chart - Energy Price](/imgs/EnergyPriceGraph.PNG "Energy price data")
  ![Chart Description](/imgs/ChartDescription.PNG "description of each graph")
  ![graph interaction](/imgs/infoCardDefault.PNG "card describing graph interactions")<br>

- I also completed a landing page with an imediate link to the graphs and an area for extra information about the project.

  ![Landing page](/imgs/LandingPage.PNG "Link to graphs")
  ![Ectra information](/imgs/LandingPageInfo.PNG "blocks describing extra information about the project")<br>

### Accessibility Changes
I checked the site using some accessbibility tools shown in this [d3 accessibility example](https://observablehq.com/@9a849ed5a351d187/adventures-in-d3-accessibility) and found a few small issues which have now been altered:
- Increased font-size of landing page text and graph text to make it more readable.
- Added title tags to SVGs as to help screen readers understand what they are.
- Changed colours in the final graph to accomodate for people who are colour blind.

- This project is mostly complete and probably wont change until i've been given extra feedback.
- In the mean time I am going to work on version 8 which will attempt to streamline the code a little.
- At the moment main.js in version 7 is a very long file and can be reduced. This will also give me an opportunity to add animations to the project as the way code is currently structures does not allow for them.
- These changes should not make any difference to the functionality of the project.

