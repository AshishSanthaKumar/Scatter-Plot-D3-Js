// Set the dimensions of the canvas / graph

const margin = {top: 10, right: 20, bottom: 50, left: 50};
const width = 800 - margin.left - margin.right;
const height = 470 - margin.top - margin.bottom;

// parse the date / time
const parseTime = d3.timeParse("%d-%b-%y");
  
// set the ranges
const xScale = d3.scaleLog()
                 .range([0, width]);
const yScale = d3.scaleLinear()
                  .range([height, 0]);

// define the line
const valueline = d3.line()
                    .x(function(d) { return xScale(d.date); })
                    .y(function(d) { return yScale(d.close); });

var color = d3.scaleOrdinal(d3.schemeCategory10)

// append the svg object to the body of the page
// append a g (group) element to 'svg' and
// move the g element to the top+left margin
var svg = d3.select("body").append("svg")
                           .attr("width", width + margin.left + margin.right)
                           .attr("height", height + margin.top + margin.bottom)
                           .append("g")
                           .attr("transform", `translate(${margin.left},${margin.top})`);
                          

// Get the data
d3.tsv("data/gapminderDataFiveYear.tsv").then(data => {

    // format the data such that strings are converted to their appropriate types
    data.forEach(function(d) {
        d.lifeExp = +d.lifeExp;
        d.gdpPercap = +d.gdpPercap;
        d.year = +d.year;
        d.pop = +d.pop;
    });

    // Set scale domains based on the loaded data
    xScale.domain(d3.extent(data, function(d) { return d.gdpPercap; }));
    yScale.domain([d3.min(data, function(d) { return d.lifeExp; }),d3.max(data, function(d) { return d.lifeExp; })]);

    // Add the valueline
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueline);
    
    // Add the scatterplot
    svg.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .filter(function(d) { return d['year'] == 2007 || d['year'] == 1952;})
        .attr("r", 5)
        .attr("cx", function(d) { return xScale(d.gdpPercap); })
        .attr("cy", function(d) { return yScale(d.lifeExp); })
        .style("fill", function(d) { return color(d.year); })
        .style("opacity", 0.8);
        
        
    
    // Add the axes
    const yAxis = d3.axisLeft(yScale);
    svg.append("g")
        .call(yAxis);
    const xAxis = d3.axisBottom(xScale);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

});

    







