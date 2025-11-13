import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const AreaChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const g = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Parse dates
    const parseDate = d3.timeParse("%Y-%m-%d");
    const processedData = data.map(d => ({
      ...d,
      date: parseDate(d.date)
    }));

    // Scales
    const x = d3.scaleTime()
      .domain(d3.extent(processedData, d => d.date))
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(processedData, d => d.visitors + d.page_views + d.conversions)])
      .range([height, 0]);

    const color = d3.scaleOrdinal()
      .domain(['visitors', 'page_views', 'conversions'])
      .range(['#4F46E5', '#06B6D4', '#10B981']);

    // Stack the data
    const stack = d3.stack()
      .keys(['visitors', 'page_views', 'conversions']);

    const stackedData = stack(processedData);

    // Area generator
    const area = d3.area()
      .x(d => x(d.data.date))
      .y0(d => y(d[0]))
      .y1(d => y(d[1]))
      .curve(d3.curveMonotoneX);

    // Add X axis
    g.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%m/%d")));

    // Add Y axis
    g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y));

    // Add areas
    g.selectAll(".area")
      .data(stackedData)
      .enter().append("path")
      .attr("class", "area")
      .attr("d", area)
      .attr("fill", d => color(d.key))
      .attr("opacity", 0.8)
      .on("mouseover", function(event, d) {
        d3.select(this).attr("opacity", 1);
        
        const tooltip = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);
        
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
          
        tooltip.html(`Metric: ${d.key.replace('_', ' ').toUpperCase()}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).attr("opacity", 0.8);
        d3.selectAll(".tooltip").remove();
      });

    // Add legend
    const legend = g.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width - 150}, 20)`);

    const legendItems = legend.selectAll(".legend-item")
      .data(['visitors', 'page_views', 'conversions'])
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
      .text(d => d.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()));

  }, [data]);

  return (
    <div className="chart-container">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default AreaChart;