viewof keyz = {
  const form = html`<form>${Object.assign(html`<select name=select>${keys.map(key => Object.assign(html`<option>`, {value: key, textContent: key}))}</select>`, {value: " New_cases"})} <i style="font-size:smaller;">color encoding</i>`;
  form.select.onchange = () => (form.value = form.select.value, form.dispatchEvent(new CustomEvent("input")));
  form.select.onchange();
  return form;
}


chart = {
  const svg = d3.select(DOM.svg(width, height));

  svg.append("g")
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
    .selectAll("path")
    .data(data.slice().sort((a, b) => d3.ascending(a[keyz], b[keyz])))
    .join("path")
      .attr("stroke", d => z(d[keyz]))
      .attr("stroke-opacity", 0.4)
      .attr("d", d => d3.line()
          .defined(([, value]) => value != null)
          .x(([key, value]) => x.get(key)(value))
          .y(([key]) => y(key))
        (d3.cross(keys, [d], (key, d) => [key, d[key]])))
    .append("title")
      .text(d => d.name);

  svg.append("g")
    .selectAll("g")
    .data(keys)
    .join("g")
      .attr("transform", d => `translate(0,${y(d)})`)
      .each(function(d) { d3.select(this).call(d3.axisBottom(x.get(d))); })
      .call(g => g.append("text")
        .attr("x", margin.left)
        .attr("y", -6)
        .attr("text-anchor", "start")
        .attr("fill", "currentColor")
        .text(d => d))
      .call(g => g.selectAll("text")
        .clone(true).lower()
        .attr("fill", "none")
        .attr("stroke-width", 5)
        .attr("stroke-linejoin", "round")
        .attr("stroke", "white"));

  
  
  return svg.node();
}


import {slider} from "@jashkenas/inputs"

viewof month = slider({
  min: 1, 
  max: 7, 
  step: 1, 
  value: 3, 
  title: "Months", 
  description: "Month from 1 to 7"
})

viewof day = slider({
  min: 1, 
  max: 31, 
  step: 1, 
  value: 1, 
  title: "Days", 
  description: "Day from 1 to 31"
})

data = d3.csvParse(await FileAttachment("COVID.csv").text(), d3.autoType)

// typeof(data[0]["Date_reported"])
// parase(data[0]["Date_reported"])
data[0]["Date_reported"]
temp = data.filter((d,i) => d["Date_reported"]== new String("2020/4/2"))
// temp = data.filter(function(d) {return d[" New_cases"]==1});
d3.extent(data, d => d[data.columns.slice(0,1)])
parase = d3.timeParse("%Y-%m-%d")
parase("2020-02-2")
// typeof(parase("2020-2-2"))

// keys = data.columns.slice(0,1).concat(data.columns.slice(4))
keys = data.columns.slice(4)
x = new Map(
  Array.from(
    keys,
    key => [key, d3.scaleLinear(d3.extent(data, d => d[key]), [margin.left, width - margin.right])]
  )
)

y = d3.scalePoint(keys, [margin.top, height - margin.bottom])
z = d3.scaleSequential(x.get(keyz).domain().reverse(), d3.interpolateBrBG)
margin = ({top: 20, right: 10, bottom: 20, left: 10})
height = keys.length * 120

d3 = require("d3@5")