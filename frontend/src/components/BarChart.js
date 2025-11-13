import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BarChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous chart

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.bottom - margin.top;

    const g = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const x0 = d3.scaleBand()
      .domain(data.map(d => d.month))
      .range([0, width])
      .padding(0.1);

    const x1 = d3.scaleBand()
      .domain(['sales', 'expenses'])
      .range([0, x0.bandwidth()])
      .padding(0.05);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => Math.max(d.sales, d.expenses))])
      .range([height, 0]);

    const color = d3.scaleOrdinal()
      .domain(['sales', 'expenses'])
      .range(['#4F46E5', '#EF4444']);

    // Add X axis
    g.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x0));

    // Add Y axis
    g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y));

    // Add bars
    const months = g.selectAll(".month")
      .data(data)
      .enter().append("g")
      .attr("class", "month")
      .attr("transform", d => `translate(${x0(d.month)},0)`);

    months.selectAll("rect")
      .data(d => ['sales', 'expenses'].map(key => ({ key, value: d[key], month: d.month })))
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x1(d.key))
      .attr("y", d => y(d.value))
      .attr("width", x1.bandwidth())
      .attr("height", d => height - y(d.value))
      .attr("fill", d => color(d.key))
      .on("mouseover", function(event, d) {
        d3.select(this).style("opacity", 0.7);
        
        // Create tooltip
        const tooltip = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);
        
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
          
        tooltip.html(`${d.month}<br/>${d.key}: $${d.value.toLocaleString()}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).style("opacity", 1);
        d3.selectAll(".tooltip").remove();
      });

    // Add legend
    const legend = g.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width - 100}, 20)`);

    const legendItems = legend.selectAll(".legend-item")
      .data(['sales', 'expenses'])
      .enter().append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`);

    legendItems.append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", d => color(d));

    legendItems.append("text")
      .attr("x", 20)
      .attr("y", 12)
      .style("font-size", "12px")
      .style("fill", "#374151")
      .text(d => d.charAt(0).toUpperCase() + d.slice(1));

  }, [data]);

  return (
    <div className="chart-container">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default BarChart;