import * as d3 from "/import.js";

const margin = { top: 10, right: 40, bottom: 40, left: 50 },
  width = 1200 - margin.left - margin.right,
  height = 600 + margin.top + margin.bottom;

var path;
var figure;
var length;

function getData(rawData) {
  var caffeines = [];
  rawData.map((d) => caffeines.push(d.Caffeine_consumption));

  caffeines = [...new Set(caffeines)].sort((x, y) => x - y);

  const data = {
    caffeineAxeMax: d3.max(caffeines),
    data: {
      name: "Efficacité de sommeil",
      class: "sleepEfficiency",
      values: [],
    },
  };

  caffeines.forEach((caffeineConsumption) => {
    var tab = [];
    rawData
      .filter((d) => d.Caffeine_consumption === caffeineConsumption)
      .map(function (d) {
        tab.push(d.Sleep_efficiency);
      });

    data.data.values.push({
      value: d3.mean(tab) * 100,
      caffeine: caffeineConsumption,
    });
  });

  return data;
}

//DRAW

function draw(data) {
  figure = d3
    .select("#graphe-8")
    .append("svg")
    .attr("overflow", "visible")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr(
      "viewBox",
      "0 0 " +
        (width + margin.left + margin.right) +
        " " +
        (height + margin.top + margin.bottom)
    )
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const y = d3.scaleLinear().range([height, 0]).domain([0, 100]);
  figure.append("g").call(d3.axisLeft(y));

  const x = d3.scaleLinear().range([0, width]).domain([0, data.caffeineAxeMax]);

  figure
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  const line = d3
    .line()
    .x((d) => x(+d.caffeine))
    .y((d) => y(+d.value));

  var Tooltip = d3
    .select("#graphe-8")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("position", "absolute");

  path = figure
    .append("path")
    .datum(data.data)
    .attr("fill", "none")
    .attr("stroke", "#69b3a2")
    .attr("stroke-width", 4)
    .attr("d", (d) => line(d.values));

  length = path.node().getTotalLength();

  path
    .attr("stroke-dasharray", length + " " + length)
    .attr("stroke-dashoffset", length);

  //points
  figure
    .append("g")
    .attr("class", "points")
    .attr("opacity", "0")
    .selectAll("dot")
    .data(data.data.values)
    .join("circle")
    .attr("cx", (d) => x(d.caffeine))
    .attr("cy", (d) => y(d.value))
    .attr("r", 7)
    .attr("fill", "#69b3a2")
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

  //name to axis

  figure
    .append("text")
    .attr("class", "label")
    .attr("x", width - 530)
    .attr("y", height + 100)
    .style("fill", "white")
    .style("text-anchor", "middle")
    .text("Caféine consommée sur une journée (mg)");

  figure
    .append("text")
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .attr("y", -130)
    .attr("x", -310)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .style("fill", "white")
    .text("Efficacité du sommeil (%)");
}

function scrollOn() {
  document.querySelector("#graphe-8").style.opacity = 1;
  path
    .attr("opacity", 1)
    .transition()
    .ease(d3.easeLinear)
    .attr("stroke-dashoffset", 0)
    .duration(2000);
  figure.select(".points").transition().delay(1500).attr("opacity", 1);
}

function scrollOut() {
  document.querySelector("#graphe-8").style.opacity = 0.2;
  path
    .transition()
    .attr("opacity", 0)
    .attr("stroke-dasharray", length + " " + length)
    .attr("stroke-dashoffset", length);

  figure.select(".points").transition().attr("opacity", "0");
}

export { getData, draw, scrollOn, scrollOut };
