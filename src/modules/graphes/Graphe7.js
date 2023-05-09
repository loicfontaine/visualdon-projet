import * as d3 from "/import.js";

var path;
var figure;
var length;

const margin = { top: 10, right: 40, bottom: 40, left: 50 },
  width = 1200 - margin.left - margin.right,
  height = 600 + margin.top + margin.bottom;

function getData(rawData) {
  var sport = [];
  rawData.map((d) => sport.push(d.Exercise_frequency));

  const data = {
    sportAxeMax: d3.max(sport),
    data: {
      name: "Fréquence de sport",
      class: "sportFrequency",
      values: [],
    },
  };

  for (let i = 0; i < d3.max(sport); i++) {
    var tab = [];
    rawData
      .filter((d) => d.Exercise_frequency === i)
      .map(function (d) {
        tab.push(d.Awakenings);
      });

    data.data.values.push({
      value: d3.mean(tab),
      sport: i,
    });
  }
  return data;
}

//DRAW

function draw(data) {
  figure = d3
    .select("#graphe-7")
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

  const y = d3.scaleLinear().range([height, 0]).domain([0, 3]);
  figure.append("g").call(d3.axisLeft(y).ticks(6));

  const x = d3.scaleLinear().range([0, width]).domain([0, data.sportAxeMax]);

  figure
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(5));

  const line = d3
    .line()
    .x((d) => x(+d.sport))
    .y((d) => y(+d.value));

  path = figure
    .append("path")
    .datum(data.data)
    .attr("fill", "none")
    .attr("stroke", "#69b3a2")
    .attr("stroke-width", 4)
    .attr("d", (d) => line(d.values));
  console.log("path", path);

  length = path.node().getTotalLength();

  path
    .attr("stroke-dasharray", length + " " + length)
    .attr("stroke-dashoffset", length);

  //Tooltip
  var Tooltip2 = d3
    .select("#graphe-7")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("position", "absolute");

  //points
  figure
    .append("g")
    .attr("class", "points")
    .attr("opacity", 0)
    .selectAll("dot")
    .data(data.data.values)
    .join("circle")
    .attr("cx", (d) => x(d.sport))
    .attr("cy", (d) => y(d.value))
    .attr("r", 7)
    .attr("fill", "#69b3a2")
    .on("mouseover", function (event, d) {
      return Tooltip2.style("opacity", 1);
    })
    .on("mousemove", function (event, d) {
      return Tooltip2.html(
        `${Math.round(d.value * 10) / 10} réveils moyen par nuit`
      )
        .style("left", `${event.layerX + 10}px`)
        .style("top", `${event.layerY}px`);
    })
    .on("mouseleave", function (event, d) {
      return Tooltip2.style("opacity", 0);
    });

  //name to axis

  figure
    .append("text")
    .attr("class", "label")
    .attr("x", width - 530)
    .attr("y", height + 100)
    .style("fill", "white")
    .style("text-anchor", "middle")
    .text("Séance de sport par semaine");

  figure
    .append("text")
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .attr("y", -130)
    .attr("x", -310)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .style("fill", "white")
    .text("Réveils durant une nuit");
}

function scrollOn() {
  document.querySelector("#graphe-7").style.opacity = 1;
  path
    .attr("opacity", 1)
    .transition()
    .ease(d3.easeLinear)
    .attr("stroke-dashoffset", 0)
    .duration(2000);
  figure.select(".points").transition().delay(1500).attr("opacity", "1");
}

function scrollOut() {
  document.querySelector("#graphe-7").style.opacity = 0.2;
  path
    .transition()
    .attr("opacity", 0)
    .attr("stroke-dasharray", length + " " + length)
    .attr("stroke-dashoffset", length);
  figure.select(".points").transition().attr("opacity", "0");
}

export { getData, draw, scrollOn, scrollOut };
