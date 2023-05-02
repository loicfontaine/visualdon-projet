import * as d3 from "/import.js";

var path;
var figure;
var length;

const margin = { top: 10, right: 40, bottom: 40, left: 50 },
  width = 1200 - margin.left - margin.right,
  height = 600 + margin.top + margin.bottom;

function getData(rawData) {
  var alcool = [];
  rawData.map((d) => alcool.push(d.Alcohol_consumption));
  const alcoolData = rawData.filter((d) => d.Alcohol_consumption > 0);

  const data = {
    alcoolAxeMin: d3.min(alcool),
    alcoolAxeMax: d3.max(alcool),
    data: [
      {
        name: "Efficacité de sommeil",
        class: "sleepEfficiency",
        values: [],
      },
      {
        name: "Sommeil profond",
        class: "deepSleep",
        values: [],
      },
    ],
  };

  for (var i = 0; i < d3.max(alcool); i++) {
    var tabEfficiency = [];
    var tabDeep = [];
    rawData
      .filter((d) => d.Alcohol_consumption === i)
      .map(function (d) {
        tabEfficiency.push(d.Sleep_efficiency);
        tabDeep.push(d.Deep_sleep_percentage);
      });

    data.data[0].values.push({
      value: d3.mean(tabEfficiency) * 100,
      alcool: i,
    });
    data.data[1].values.push({
      value: d3.mean(tabDeep) * 100,
      alcool: i,
    });
  }

  return data;
}

//DRAW

function draw(data) {
  figure = d3
    .select("#graphe-6")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "auto")
    .attr(
      "viewBox",
      "0 0 " +
        (width + margin.left + margin.right) +
        " " +
        (height + margin.top + margin.bottom)
    )
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var allGroup = [data.data[0].name, data.data[1].name];

  const y = d3.scaleLinear().range([height, 0]).domain([0, 100]);
  figure.append("g").call(d3.axisLeft(y));

  const x = d3.scaleLinear().range([0, width]).domain([0, data.alcoolAxeMax]);

  figure
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  const myColor = d3.scaleOrdinal().domain(allGroup).range(d3.schemeSet2);

  const line = d3
    .line()
    .x((d) => x(+d.alcool))
    .y((d) => y(+d.value));

  path = figure
    .selectAll("myLines")
    .data(data.data)
    .join("path")
    .attr("class", (d) => d.class)
    .attr("d", (d) => line(d.values))
    .attr("stroke", (d) => myColor(d.name))
    .style("stroke-width", 4)
    .style("fill", "none");

  length = path.node().getTotalLength();

  path
    .attr("stroke-dasharray", length + " " + length)
    .attr("stroke-dashoffset", length);

  //tooltip
  var Tooltip = d3
    .select("#graphe-6")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("position", "absolute");

  // rajoute les points
  figure
    .selectAll("myDots")
    .data(data.data)
    .join("g")
    .attr("opacity", 0)
    .style("fill", (d) => myColor(d.name))
    .attr("class", (d) => `${d.class} points`)
    // Second we need to enter in the 'values' part of this group
    .selectAll("myPoints")
    .data((d) => d.values)
    .join("circle")
    .attr("cx", (d) => x(d.alcool))
    .attr("cy", (d) => y(d.value))
    .attr("r", 7)
    .attr("stroke", "white")
    .on("mouseover", function (event, d) {
      return Tooltip.style("opacity", 1);
    })
    .on("mousemove", function (event, d) {
      return Tooltip.html(`Valeur exacte: ${Math.round(d.value)}%`)
        .style("left", `${event.layerX + 10}px`)
        .style("top", `${event.layerY}px`);
    })
    .on("mouseleave", function (event, d) {
      return Tooltip.style("opacity", 0);
    });

  // Add a legend at the end of each line
  figure
    .selectAll("myLabels")
    .data(data.data)
    .join("g")
    .attr("class", (d) => `${d.class} legend2`)
    .attr("opacity", 0)
    .append("text")
    .datum((d) => {
      return { name: d.name, value: d.values[d.values.length - 1] };
    }) // keep only the last value of each time series
    .attr(
      "transform",
      (d) => `translate(${x(d.value.alcool)},${y(d.value.value)})`
    ) // Put the text at the position of the last point
    .attr("x", 12) // shift the text a bit more right
    .text((d) => d.name)
    .style("fill", (d) => myColor(d.name))
    .style("font-size", 15);

  //légende intéractive

  figure
    .selectAll("myLegend")
    .data(data.data)
    .join("g")
    .attr("class", "legend")
    .attr("opacity", 0)
    .append("text")
    .attr("x", (d, i) => 60 + i * 260)
    .attr("y", 30)
    .text((d) => d.name)
    .style("fill", (d) => myColor(d.name))
    .style("font-size", 15)
    .on("click", function (event, d) {
      // is the element currently visible ?
      var currentOpacity = d3.selectAll("." + d.class).style("opacity");
      // Change the opacity: from 0 to 1 or from 1 to 0
      d3.selectAll("." + d.class)
        .transition()
        .style("opacity", currentOpacity == 1 ? 0.2 : 1);
    });
}

function scrollOn() {
  document.querySelector("#graphe-6").style.opacity = 1;
  path.transition().attr("stroke-dashoffset", 0).duration(2000);
  figure.selectAll(".points").transition().delay(2000).attr("opacity", "1");
  figure.selectAll(".legend").transition().attr("opacity", "1");
  figure.selectAll(".legend2").transition().delay(2100).attr("opacity", "1");
}

function scrollOut() {
  document.querySelector("#graphe-6").style.opacity = 0.2;
  path
    .attr("stroke-dasharray", length + " " + length)
    .attr("stroke-dashoffset", length);
  figure.selectAll(".points").transition().attr("opacity", "0");
  figure.selectAll(".legend").transition().attr("opacity", "0");
  figure.selectAll(".legend2").transition().attr("opacity", "0");
}

export { getData, draw, scrollOut, scrollOn };
