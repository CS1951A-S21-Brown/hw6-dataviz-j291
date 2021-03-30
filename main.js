// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 175};

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 250;
let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 275;
let graph_3_width = (MAX_WIDTH / 2) - 10, graph_3_height = 575;

let width = 900,
    height = 350,
    NUM_EXAMPLES = 5;

// CSV filenames for artist and song data
let filenames = ["years_games.csv", "recent_years_games.csv"];

// TODO: Set up SVG object with width, height and margin
let svg = d3.select("#graph1")
    .append("svg")
    .attr("width", graph_1_width)     // HINT: width
    .attr("height", height)     // HINT: height
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top + 50})`);    // HINT: transform

// TODO: Create a linear scale for the x axis (number of occurrences)
let x = d3.scaleLinear()
    .range([0, graph_1_width - margin.left - margin.right]);

// TODO: Create a scale band for the y axis (artist)
let y = d3.scaleBand()
    .range([0, height - margin.top - margin.bottom])
    .padding(0.1);  // Improves readability
/*
    Here we will create global references to the x and y axis with a fixed range.
    We will update the domain of the axis in the setData function based on which data source
    is requested.
 */

// Set up reference to count SVG group
let countRef = svg.append("g");
// Set up reference to y axis label to update text in setData
let y_axis_label = svg.append("g");

// TODO: Add x-axis label
svg.append("text")
    .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2}, ${(height - margin.top - margin.bottom) + 12})`)       // HINT: Place this at the bottom middle edge of the graph
    .style("text-anchor", "middle")
    .text("Count");
// Since this text will not update, we can declare it outside of the setData function


// TODO: Add y-axis label
let y_axis_text = svg.append("text")
    .attr("transform", `translate(-50, ${(height - margin.top - margin.bottom) / 2})`)       // HINT: Place this at the center left edge of the graph
    .style("text-anchor", "middle");

// TODO: Add chart title
let title = svg.append("text")
    .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2}, -12)`)       // HINT: Place this at the top middle edge of the graph
    .style("text-anchor", "middle")
    .style("font-size", 15);
/*
    We declare global references to the y-axis label and the chart title to update the text when
    the data source is changed.
 */



/**
 * Sets the data on the barplot using the provided index of valid data sources and an attribute
 * to use for comparison
 */
function setData(index, attr) {
    // TODO: Load the artists CSV file into D3 by using the d3.csv() method. Index into the filenames array
    d3.csv(filenames[index]).then(function(data) {
        // TODO: Clean and strip desired amount of data for barplot
        let parsed_count = function(a,b){return (parseInt(b.count) - parseInt(a.count))};
        data = cleanData(data, parsed_count, 5);
        //data = ?;

        // TODO: Update the x axis domain with the max count of the provided data
        x.domain([0, d3.max(data, function(d){return parseInt(d.count)})]);

        // TODO: Update the y axis domains with the desired attribute
        y.domain(data.map(function(d){return d[attr] }));
        // HINT: Use the attr parameter to get the desired attribute for each data point

        // TODO: Render y-axis label
        y_axis_label.call(d3.axisLeft(y));

        /*
            This next line does the following:
                1. Select all desired elements in the DOM
                2. Count and parse the data values
                3. Create new, data-bound elements for each data value
         */
        let bars = svg.selectAll("rect").data(data);

        let color = d3.scaleOrdinal()
        .domain(data.map(function(d) { return d["year"] }))
        .range(d3.quantize(d3.interpolateHcl("#4B0082", "#9370DB"), NUM_EXAMPLES));

        // TODO: Render the bar elements on the DOM
        /*
            This next section of code does the following:
                1. Take each selection and append a desired element in the DOM
                2. Merge bars with previously rendered elements
                3. For each data point, apply styling attributes to each element

            Remember to use the attr parameter to get the desired attribute for each data point
            when rendering.
         */
        bars.enter()
            .append("rect")
            .merge(bars)
            .transition()
            .duration(1000)
            .attr("fill", function(d) { return color(d['year']) })
            .attr("x", x(0))
            .attr("y", function(d) {return y(d[attr])})               // HINT: Use function(d) { return ...; } to apply styles based on the data point
            .attr("width", function(d) {return x(parseInt(d.count))})
            .attr("height",  y.bandwidth());        // HINT: y.bandwidth() makes a reasonable display height

        /*
            In lieu of x-axis labels, we are going to display the count of the artist next to its bar on the
            bar plot. We will be creating these in the same manner as the bars.
         */
        let counts = countRef.selectAll("text").data(data);

        // TODO: Render the text elements on the DOM
        counts.enter()
            .append("text")
            .merge(counts)
            .transition()
            .duration(1000)
            .attr("x", function(d){return x(parseInt(d.count)) + 5})       // HINT: Add a small offset to the right edge of the bar, found by x(d.count)
            .attr("y", function(d){return y(d[attr]) + 25})       // HINT: Add a small offset to the top edge of the bar, found by y(d.artist)
            .style("text-anchor", "start")
            .text(function(d) {return parseInt(d.count)});           // HINT: Get the count of the artist

        y_axis_text.text(attr);
        title.text("Number of International Soccer Games, Per Year");

 
        // Remove elements not in use if fewer groups in new dataset
        bars.exit().remove();
        counts.exit().remove();


    });
}





// // append the svg object to the body of the page
// var svg = d3.select("#graph1")
//   .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform",
//           "translate(" + margin.left + "," + margin.top + ")");

// // get the data
// function setData(index, attr) {
// d3.csv(filenames[index], function(data) {

//   // X axis: scale and draw:
//   var x = d3.scaleLinear()
//       .domain([1970, 2010])     
//       .range([0, width]);
//   svg.append("g")
//       .attr("transform", "translate(0," + height + ")")
//       .call(d3.axisBottom(x));

//   // set the parameters for the histogram
//   var histogram = d3.histogram()
//       .value(function(d) { return d.count; })   // I need to give the vector of value
//       .domain(x.domain())  // then the domain of the graphic
//       .thresholds(x.ticks(5)); // then the numbers of bins

//   // And apply this function to data to get the bins
//   var bins = histogram(data);

//   // Y axis: scale and draw:
//   var y = d3.scaleLinear()
//       .range([height, 0]);
//       y.domain([0, d3.max(bins, function(d) { return d.count; })]);   // d3.hist has to be called before the Y axis obviously
//   svg.append("g")
//       .call(d3.axisLeft(y));

//   // append the bar rectangles to the svg element
//   svg.selectAll("rect")
//       .data(bins)
//       .enter()
//       .append("rect")
//         .attr("x", 1)
//         .attr("transform", function(d) { return "translate(" + 10 + "," + y(d.count) + ")"; })
//         .attr("width", function(d) { return 100 ; })
//         .attr("height", function(d) { return (height - y(d.count)); })
//         .style("fill", "#69b3a2")

// });
// }





/**
 * Cleans the provided data using the given comparator then strips to first numExamples
 * instances
 */
function cleanData(data, comparator, numExamples) {
    // TODO: sort and return the given data with the comparator (extracting the desired number of examples)
    data = data.sort(comparator);
    data = data.slice(0, numExamples);

    return data;
}

// On page load, render the barplot with the artist data
setData(0, "year");


let svg2 = d3.select("#graph2")
    .append("svg")
    .attr("width", graph_2_width)     // HINT: width
    .attr("height", height)     // HINT: height
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);    // HINT: transform

let tooltip = d3.select("#graph2")     // HINT: div id for div containing scatterplot
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


/*
    We declare global references to the y-axis label and the chart title to update the text when
    the data source is changed.
 */



/**
 * Sets the data on the barplot using the provided index of valid data sources and an attribute
 * to use for comparison
 */

    // TODO: Load the artists CSV file into D3 by using the d3.csv() method. Index into the filenames array
d3.csv("winning_percentages.csv").then(function(data) {


        // const tooltip = d3.select('body').append('div')
        // .attr('class', 'tooltip')
        // .style('opacity', 0);

        
        
        // TODO: Clean and strip desired amount of data for barplot
        let parsed_count = function(a,b){return (parseInt(b.Percentage) - parseInt(a.Percentage))};
        data = cleanData(data, parsed_count, 10);
        //data = ?;

        // TODO: Create a linear scale for the x axis (number of occurrences)
        x2 = d3.scaleLinear()
        .range([0, graph_2_width - margin.left - margin.right])
        .domain([0, d3.max(data, function(d){return parseFloat(d.Percentage * 100)})]);

        // TODO: Create a scale band for the y axis (artist)
        y2 = d3.scaleBand()
        .range([0, height - margin.top - margin.bottom]).domain(data.map(function(d){return d["Team"] }))
        .padding(0.1);  // Improves readability
        /*
        Here we will create global references to the x and y axis with a fixed range.
        We will update the domain of the axis in the setData function based on which data source
        is requested.
        */

        // Set up reference to count SVG group
        let countRef2 = svg2.append("g");
        // Set up reference to y axis label to update text in setData
        let y_axis_label2 = svg2.append("g");

        // TODO: Add x-axis label
        svg2.append("text")
        .attr("transform", `translate(${(graph_2_width - margin.left - margin.right) / 2}, ${(height - margin.top - margin.bottom) + 12})`)       // HINT: Place this at the bottom middle edge of the graph
        .style("text-anchor", "middle")
        .text("Winning Percentage");
        // Since this text will not update, we can declare it outside of the setData function


        // TODO: Add y-axis label
        let y_axis_text2 = svg2.append("text")
        .attr("transform", `translate(-75, ${(height - margin.top - margin.bottom) / 2})`)       // HINT: Place this at the center left edge of the graph
        .style("text-anchor", "middle");

        // TODO: Add chart title
        let title2 = svg2.append("text")
        .attr("transform", `translate(${(graph_2_width - margin.left - margin.right) / 2}, -12)`)       // HINT: Place this at the top middle edge of the graph
        .style("text-anchor", "middle")
        .style("font-size", 15);

        // TODO: Render y-axis label
        y_axis_label2.call(d3.axisLeft(y2));

        /*
            This next line does the following:
                1. Select all desired elements in the DOM
                2. Count and parse the data values
                3. Create new, data-bound elements for each data value
         */
        let bars2 = svg2.selectAll("rect").data(data);

        // svg2.selectAll(".bar").data(data).on('mouseover', (d) => {
        //     tooltip.transition().duration(200).style('opacity', 0.9);
        //     tooltip.html(`Percentage: <span>${d.Percentage}</span>`)
        //   })
        //   .on('mouseout', () => tooltip.transition().duration(500).style('opacity', 0));



        let color2 = d3.scaleOrdinal()
        .domain(data.map(function(d) { return d["Percentage"] }))
        .range(d3.quantize(d3.interpolateHcl("#4B0082", "#9370DB"), 10));

        // Mouseover function to display the tooltip on hover
        let mouseover_func = function(d) {
            let color_span = `<span style="color: ${color2(d.Wins)};">`;
            let html = `${d.Team}<br/> Number of Wins:
                    ${color_span}${d.Wins}<br/> Total Games: ${d.Total}</span><br/></span>`;       // HINT: Display the song here

            // Show the tooltip and set the position relative to the event X and Y location
            tooltip.html(html)
                .style("left", `${(d3.event.pageX) + 220}px`)
                .style("top", `${(d3.event.pageY) - 100}px`)
                .style("box-shadow", `2px 2px 5px ${color2(d.Percentage)}`)    // OPTIONAL for students
                .transition()
                .duration(200)
                .style("opacity", 0.9)
        };

        // Mouseout function to hide the tool on exit
        let mouseout_func = function(d) {
            // Set opacity back to 0 to hide
            tooltip.transition()
                .duration(200)
                .style("opacity", 0);
        };

        // TODO: Render the bar elements on the DOM
        /*
            This next section of code does the following:
                1. Take each selection and append a desired element in the DOM
                2. Merge bars with previously rendered elements
                3. For each data point, apply styling attributes to each element

            Remember to use the attr parameter to get the desired attribute for each data point
            when rendering.
         */
        bars2.enter()
            .append("rect")
            .on("mouseover", mouseover_func) // HINT: Pass in the mouseover and mouseout functions here
            .on("mouseout", mouseout_func)        // HINT: y.bandwidth() makes a reasonable display height
            .merge(bars2)
            .transition()
            .duration(1000)
            .attr("fill", function(d) { return color2(d['Team']) })
            .attr("x", x(0))
            .attr("y", function(d) {
                return y2(d["Team"])})               // HINT: Use function(d) { return ...; } to apply styles based on the data point
            .attr("width", function(d) {return x2(parseFloat(d.Percentage * 100))})
            .attr("height",  y2.bandwidth());
            

        /*
            In lieu of x-axis labels, we are going to display the count of the artist next to its bar on the
            bar plot. We will be creating these in the same manner as the bars.
         */
        let counts2 = countRef2.selectAll("text").data(data);

        // TODO: Render the text elements on the DOM
        counts2.enter()
            .append("text")
            .merge(counts2)
            .transition()
            .duration(1000)
            .attr("x", function(d){return x2(parseFloat(d.Percentage * 100)) + 3})       // HINT: Add a small offset to the right edge of the bar, found by x(d.count)
            .attr("y", function(d){return y2(d["Team"]) + 15})       // HINT: Add a small offset to the top edge of the bar, found by y(d.artist)
            .style("text-anchor", "start")
            .text(function(d) {return parseFloat(d.Percentage)});           // HINT: Get the count of the artist

        y_axis_text2.text("Team");
        title2.text("Top 10 Winning Percentage's of All Time, By Country");

 
        // Remove elements not in use if fewer groups in new dataset
        bars2.exit().remove();
        counts2.exit().remove();


    });

    
let svg3 = d3.select("#graph3").append("svg")
    .attr("width", graph_3_height)     // HINT: width
    .attr("height", graph_3_height)     // HINT: height
    .append("g")
    .attr("transform", `translate(${margin.left - 60}, ${margin.top + 48})`);    // HINT: transform

// Set up reference to count SVG group
let countRef3 = svg3.append("g");


// TODO: Load the artists CSV file into D3 by using the d3.csv() method
d3.csv("goal_totals.csv").then(function(data3) {
    // TODO: Clean and strip desired amount of data for barplot
    let parsed_count3 = function(a,b){return (parseInt(b.Goals) - parseInt(a.Goals))};
    data3 = cleanData(data3, parsed_count3, 20);
    /*
        HINT: use the parseInt function when looking at data from the CSV file and take a look at the
        cleanData function below.

        Use your NUM_EXAMPLES defined in d3_lab.html.
     */

    // TODO: Create a linear scale for the x axis (number of occurrences)
    let x3 = d3.scaleLinear()
        .domain([0, d3.max(data3, function(d){return parseInt(d.Goals)})])
        .range([0, graph_3_width - margin.left - margin.right]);
    /*
        HINT: The domain and range for the linear scale map the data points
        to appropriate screen space.

        The domain is the interval of the smallest to largest data point
        along the desired dimension. You can use the d3.max(data, function(d) {...})
        function to get the max value in the dataset, where d refers to a single data
        point. You can access the fields in the data point through d.count or,
        equivalently, d["count"].

        The range is the amount of space on the screen where the given element
        should lie. We want the x-axis to appear from the left edge of the svg object
        (location 0) to the right edge (width - margin.left - margin.right).
     */


    let y3 = d3.scaleBand()
        .domain(data3.map(function(d){return d['Team'] }))
        .range([0, graph_3_height - margin.top - margin.bottom])
        .padding(0.1);  // Improves readability
    /*
        HINT: For the y-axis domain, we want a list of all the artist names in the dataset.
        You might find JavaScript's map function helpful.

        Set up the range similar to that of the x-axis. Instead of going from the left edge to
        the right edge, we want the y-axis to go from the top edge to the bottom edge. How
        should we define our boundaries to incorporate margins?
     */

    // TODO: Add y-axis label
    svg3.append("g")
        .call(d3.axisLeft(y3).tickSize(0).tickPadding(10));
    // HINT: The call function takes in a d3 axis object. Take a look at the d3.axisLeft() function.
    // SECOND HINT: Try d3.axisLeft(y).tickSize(0).tickPadding(10). At check in, explain to TA
    // what this does.

    /*
        This next line does the following:
            1. Select all desired elements in the DOM
            2. Count and parse the data values
            3. Create new, data-bound elements for each data value
     */
    let bars3 = svg3.selectAll("rect").data(data3);

    // OPTIONAL: Define color scale
    let color3 = d3.scaleOrdinal()
        .domain(data3.map(function(d) { return d["Team"] }))
        .range(d3.quantize(d3.interpolateHcl("#4B0082", "#9370DB"), 20));


    // TODO: Render the bar elements on the DOM
    /*
        This next section of code does the following:
            1. Take each selection and append a desired element in the DOM
            2. Merge bars with previously rendered elements
            3. For each data point, apply styling attributes to each element
     */
    bars3.enter()
        .append("rect")
        .merge(bars3)
        .attr("fill", function(d) { return color3(d['Team']) }) // Here, we are using functin(d) { ... } to return fill colors based on the data point d
        .attr("x", x3(0))
        .attr("y", function(d) {return y3(d['Team'])})               // HINT: Use function(d) { return ...; } to apply styles based on the data point (d)
        .attr("width", function(d) {return x3(parseInt(d['Goals']))})
        .attr("height",  y3.bandwidth());        // HINT: y.bandwidth() makes a reasonable display height
    /*
        HINT: The x and y scale objects are also functions! Calling the scale as a function can be
        used to convert between one coordinate system to another.

        To get the y starting coordinates of a data point, use the y scale object, passing in a desired
        artist name to get its corresponding coordinate on the y-axis.

        To get the bar width, use the x scale object, passing in a desired artist count to get its corresponding
        coordinate on the x-axis.
     */
    /*
        In lieu of x-axis labels, we are going to display the count of the artist next to its bar on the
        bar plot. We will be creating these in the same manner as the bars.
     */
    let counts3 = countRef3.selectAll("text").data(data3);

    // TODO: Render the text elements on the DOM
    counts3.enter()
        .append("text")
        .merge(counts3)
        .attr("x", function(d){return x3(parseInt(d.Goals)) + 5})      // HINT: Add a small offset to the right edge of the bar, found by x(d.count)
        .attr("y", function(d){return y3(d.Team) + 15})       // HINT: Add a small offset to the top edge of the bar, found by y(d.artist)
        .style("text-anchor", "start")
        .text(function(d) {return parseInt(d.Goals)});           // HINT: Get the count of the artist


    // TODO: Add x-axis label
    svg3.append("text")
        .attr("transform", `translate(${(graph_3_width - margin.left - margin.right)/2}, ${graph_3_height - margin.top - margin.bottom + 30})`)       // HINT: Place this at the bottom middle edge of the graph - use translate(x, y) that we discussed earlier
        //.attr("transform", translate((width/2), 0)) 
        .style("text-anchor", "middle")
        .text("Number of Goals");

    // TODO: Add y-axis label
    svg3.append("text")
        .attr("transform", `translate(${-90}, ${(graph_3_height - margin.top - margin.bottom) / 2})`)       // HINT: Place this at the center left edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .text("Country");

    // TODO: Add chart title
    svg3.append("text")
        .attr("transform", `translate(${(graph_3_width - margin.left - margin.right) / 2}, ${-20})`)       // HINT: Place this at the top middle edge of the graph - use translate(x, y) that we discussed earlier
        .style("text-anchor", "middle")
        .style("font-size", 15)
        .text("Goals Scored Over the Past Two World Cups");
});

