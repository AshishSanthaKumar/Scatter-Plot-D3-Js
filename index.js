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
var svg = d3.select(".center").append("svg")
                           .attr("width", width + margin.left + margin.right)
                           .attr("height", height + margin.top + margin.bottom)
                           .append("g")
                           .attr("transform", `translate(${margin.left},${margin.top})`);    

//Adding Legend
svg.append('rect')
    .attr("x",670)
    .attr("y",10)
    .attr("height",20)
    .attr("width",30)
    .style("fill", '#1f77b4');

svg.append('rect')
    .attr("x",670)
    .attr("y",40)
    .attr("height",20)
    .attr("width",30)
    .style("fill", '#ff7f0e');

svg.append("text")
    .attr("x", 710)
    .attr("y", 23)
    .text("1952")
    .style("font-size", "11px")
    .style("font-family","sans-serif")
    .attr("alignment-baseline","middle");

svg.append("text")
    .attr("x", 710)
    .attr("y", 53)
    .text("2007")
    .style("font-size", "11px")
    .style("font-family","sans-serif")
    .attr("alignment-baseline","middle");

//Adding a Title

svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 2)
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("font-family","sans-serif")
        .style("font-weight","700")
        .style("text-decoration", "underline")  
        .text("GDP vs Life Expectancy (1952, 2007)");


// Get the data
d3.tsv("data/gapminderDataFiveYear.tsv").then(data => {

    // format the data such that strings are converted to their appropriate types
    data.forEach(function(d) {
        d.lifeExp = +d.lifeExp;
        d.gdpPercap = +d.gdpPercap;
        d.year = +d.year
        d.pop = +d.pop;
    });
  
    var rad = d3.scaleLinear()
        .domain([d3.min(data, function(d) { return d.pop; } ),d3.max(data, function(d) { return d.pop; } )])
        .range([4,10]);    

    // Set scale domains based on the loaded data
    //xScale.domain(d3.extent(data, function(d) { return d.gdpPercap; }));
    yScale.domain([d3.min(data, function(d) { return d.lifeExp; }),d3.max(data, function(d) { return d.lifeExp; })]);
    xScale.domain([d3.min(data, function(d) { return d.gdpPercap; }),d3.max(data, function(d) { return d.gdpPercap; })]);
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
        .attr("r", function(d) { return rad(d.pop); })
        .attr("cx", function(d) { return xScale(d.gdpPercap); })
        .attr("cy", function(d) { return yScale(d.lifeExp); })
        .style("fill", function(d) { return color(d.year); })
        .style("opacity", 0.8);
        
 
    // Add the axes
    const yAxis = d3.axisLeft(yScale);
    
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height/1.65))
        .attr("dy", "1em")
        .style("sans-serif", "middle")
        .text("Life Expectancy")
        .style("font-size","14px")
        .style("font-weight","700");   

    svg.append("g")
        .call(yAxis);
        
    const xAxis = d3.axisBottom(xScale)
        .tickValues([300,400,1000,2000,3000,4000,10000,20000,30000,40000,100000])
        .ticks(11)
        .tickFormat(d3.format(".0s"));
    
    
    svg.append("text")         
        .attr("transform",
              "translate(" + (width/2.25) + " ," + 
                             (height + margin.top + 30) + ")")
        .style("sans-serif", "middle")
        .text("GDP per Capita")
        .style("font-size","14px")
        .style("font-weight","700");
    
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .render();


        
    });

    





