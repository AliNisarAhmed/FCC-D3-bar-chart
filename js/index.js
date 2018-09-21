// resources referred https://stackoverflow.com/questions/10805184/show-data-on-mouseover-of-circle


const svgWidth = 900;
const svgHeight = 550;
const margin = {top: 40, left: 40};

fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
	.then(res => res.json())
	.then(data => buildGraph(data.data));

function buildGraph(incomingData) {
	console.log(incomingData.length);
	
	const rectWidth = 3;
	console.log('rectWidth', rectWidth);
	
	const svg = d3.select('#graph').append('svg')
		.attr('width', svgWidth)
		.attr('height', svgHeight)
		// .style('border', '1px solid blue');
	
	const yMax = d3.max(incomingData, d => d[1]);
	
	console.log(0, yMax)
	
	const yScale = d3.scaleLinear()
		.domain([0, yMax])
		.range([svgHeight - margin.top, 5]);
	
	const xExtent = d3.extent(incomingData, d => new Date(d[0]));
	console.log("xExtent: ", xExtent);
	
	const xScale = d3.scaleTime()
		.domain(xExtent)
		.range([0, 275 * 3])
	
	const rect = svg.selectAll('rect').data(incomingData).enter()
		.append('rect')
		.attr('x', (d, i) => margin.left + i * (rectWidth))
		.attr('y', d => yScale(d[1]))
		.attr('width', rectWidth)
		.attr('height', d => svgHeight - yScale(d[1]) - margin.top)
		.attr('class', 'bar')
		.attr('data-gdp', d => d[1])
		.attr('data-date', d => d[0])
		.style('stroke', 'white')
	
	
	const yAxis = d3.axisLeft(yScale);
	
	svg.append('g')
		.attr("transform", `translate(${margin.left}, 0)`)
		.attr('id', 'y-axis')
		.call(yAxis)
	
	const xAxis = d3.axisBottom(xScale);
	svg.append('g')
		.attr("transform", `translate(${margin.left}, ${svgHeight - margin.top})`)
		.attr('id', 'x-axis')
		.call(xAxis);
	
	// TOOLTIP
	const tooltip = d3.select('body').append('div')
		.attr('id', "tooltip")
		.style('opacity', 0)
		
	
	rect.on('mouseenter', function (d, i, node) {
		d3.select(this)
			.style('fill', 'black');
		
		const dataDate = d3.select(this).attr('data-date');
		
		tooltip.style('top', "400px")
				 .style('left', `${d3.event.x + 20}px`)
				 .style("opacity", 0.9)
				 .attr('data-date', dataDate)
				 .transition()
				 .duration(".2s")
				 .text(`GDP: $${d[1]} Billion, Year: ${d[0]}`)
				 
	});
	
	rect.on('mouseleave', function () {
		d3.select(this)
			.style('fill', 'purple');
		
		tooltip.style('opacity', 0);
	});
}