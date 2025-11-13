import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const NetworkGraph = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || !data.nodes || !data.links || data.nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 400;

    svg.attr("width", width).attr("height", height);

    // Create color scale for groups
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Create simulation
    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(data.links).id(d => d.id).distance(80))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    // Add links
    const link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(data.links)
      .enter().append("line")
      .attr("class", "link")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", d => Math.sqrt(d.value) * 2);

    // Add nodes
    const node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(data.nodes)
      .enter().append("circle")
      .attr("class", "node")
      .attr("r", d => d.size || 8)
      .attr("fill", d => color(d.group))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Add labels
    const label = svg.append("g")
      .attr("class", "labels")
      .selectAll("text")
      .data(data.nodes)
      .enter().append("text")
      .text(d => d.id)
      .style("font-size", "12px")
      .style("fill", "#374151")
      .style("text-anchor", "middle")
      .style("pointer-events", "none");

    // Add hover effects
    node.on("mouseover", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", (d.size || 8) + 3)
          .attr("stroke-width", 3);
        
        const tooltip = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);
        
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
          
        tooltip.html(`Node: ${d.id}<br/>Group: ${d.group}<br/>Size: ${d.size || 8}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", d.size || 8)
          .attr("stroke-width", 2);
        d3.selectAll(".tooltip").remove();
      });

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      label
        .attr("x", d => d.x)
        .attr("y", d => d.y + 5);
    });

    // Drag functions
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Cleanup function
    return () => {
      simulation.stop();
    };

  }, [data]);

  return (
    <div className="chart-container">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default NetworkGraph;