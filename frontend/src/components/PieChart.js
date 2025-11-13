import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const PieChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 400;
    const height = 300;
    const radius = Math.min(width, height) / 2 - 10;

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Create pie layout
    const pie = d3.pie()
      .value(d => d.value)
      .sort(null);

    // Create arc generator
    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    const outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    // Color scale
    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.category))
      .range(data.map(d => d.color));

    // Create pie slices
    const slices = g.selectAll(".pie-slice")
      .data(pie(data))
      .enter().append("g")
      .attr("class", "pie-slice");

    slices.append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.category))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("d", d3.arc()
            .innerRadius(0)
            .outerRadius(radius + 10)
          );
        
        const tooltip = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);
        
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
          
        const percentage = ((d.data.value / d3.sum(data, d => d.value)) * 100).toFixed(1);
        tooltip.html(`${d.data.category}<br/>Value: ${d.data.value}<br/>Percentage: ${percentage}%`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("d", arc);
        d3.selectAll(".tooltip").remove();
      });

    // Add labels
    slices.append("text")
      .attr("transform", d => {
        const pos = outerArc.centroid(d);
        pos[0] = radius * (midAngle(d) < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .attr("dy", ".35em")
      .style("text-anchor", d => midAngle(d) < Math.PI ? "start" : "end")
      .style("font-size", "12px")
      .style("fill", "#374151")
      .text(d => d.data.category);

    // Add polylines
    slices.append("polyline")
      .attr("stroke", "#374151")
      .attr("stroke-width", 1)
      .attr("fill", "none")
      .attr("points", d => {
        const pos = outerArc.centroid(d);
        pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
        return [arc.centroid(d), outerArc.centroid(d), pos];
      });

    function midAngle(d) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

  }, [data]);

  return (
    <div className="chart-container">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default PieChart;