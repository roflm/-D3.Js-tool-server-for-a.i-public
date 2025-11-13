import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ScatterPlot = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const g = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d.age))
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain(d3.extent(data, d => d.income))
      .range([height, 0]);

    const colorScale = d3.scaleSequential(d3.interpolateViridis)
      .domain(d3.extent(data, d => d.satisfaction));

    // Add X axis
    g.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Add Y axis
    g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y));

    // Add axis labels
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#374151")
      .text("Income ($)");

    g.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.bottom})`)
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#374151")
      .text("Age (years)");

    // Add dots
    g.selectAll(".scatter-dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "scatter-dot")
      .attr("cx", d => x(d.age))
      .attr("cy", d => y(d.income))
      .attr("r", 5)
      .attr("fill", d => colorScale(d.satisfaction))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1)
      .on("mouseover", function(event, d) {
        d3.select(this).attr("r", 7).attr("stroke-width", 2);
        
        const tooltip = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);
        
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
          
        tooltip.html(`Age: ${d.age}<br/>Income: $${d.income.toLocaleString()}<br/>Satisfaction: ${d.satisfaction}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).attr("r", 5).attr("stroke-width", 1);
        d3.selectAll(".tooltip").remove();
      });

    // Add color legend
    const legendWidth = 200;
    const legendHeight = 10;
    
    const legend = g.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width - legendWidth - 20}, ${height - 40})`);

    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "satisfaction-gradient");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", d3.interpolateViridis(0));

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", d3.interpolateViridis(1));

    legend.append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#satisfaction-gradient)");

    legend.append("text")
      .attr("x", 0)
      .attr("y", legendHeight + 15)
      .style("font-size", "10px")
      .style("fill", "#374151")
      .text("Low Satisfaction");

    legend.append("text")
      .attr("x", legendWidth)
      .attr("y", legendHeight + 15)
      .style("text-anchor", "end")
      .style("font-size", "10px")
      .style("fill", "#374151")
      .text("High Satisfaction");

  }, [data]);

  return (
    <div className="chart-container">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default ScatterPlot;