chart = {
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);

  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);

  svg.append("g")
      .call(grid);

  svg.append("g")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("fill", "none")
    .selectAll("circle")
    .data(data)
    .join("circle")
      .attr("cx", d => x(d.x))
      .attr("cy", d => y(d.y))
      .attr("r", 3);

  svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
    .selectAll("text")
    .data(data)
    .join("text")
      .attr("dy", "0.35em")
      .attr("x", d => x(d.x) + 7)
      .attr("y", d => y(d.y))
      .text(d => d.name);

  return svg.node();
}


data = Object.assign(d3.csvParse(await FileAttachment("COVID@1.csv").text(), ({ Country, New_cases: x, New_deaths: y}) => ({ Country, x: +x, y: +y})), {x: "New_cases →", y: "↑ New_deaths"}).filter((d,i) => d["Country"] == "Afghanistan")

Object.keys(data[0])

data.filter((d,i) => d["x"] == 1)

x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.x)).nice()
    .range([margin.left, width - margin.right])

y = d3.scaleLinear()
    .domain(d3.extent(data, d => d.y)).nice()
    .range([height - margin.bottom, margin.top])

xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80))
    .call(g => g.select(".domain").remove())
    .call(g => g.append("text")
        .attr("x", width)
        .attr("y", margin.bottom - 4)
        .attr("fill", "currentColor")
        .attr("text-anchor", "end")
        .text(data.x))

yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
    .call(g => g.append("text")
        .attr("x", -margin.left)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text(data.y))

grid = g => g
    .attr("stroke", "currentColor")
    .attr("stroke-opacity", 0.1)
    .call(g => g.append("g")
      .selectAll("line")
      .data(x.ticks())
      .join("line")
        .attr("x1", d => 0.5 + x(d))
        .attr("x2", d => 0.5 + x(d))
        .attr("y1", margin.top)
        .attr("y2", height - margin.bottom))
    .call(g => g.append("g")
      .selectAll("line")
      .data(y.ticks())
      .join("line")
        .attr("y1", d => 0.5 + y(d))
        .attr("y2", d => 0.5 + y(d))
        .attr("x1", margin.left)
        .attr("x2", width - margin.right));

margin = ({top: 25, right: 20, bottom: 35, left: 40})
height = 600
d3 = require("d3@5")