import * as d3 from "/import.js";

var figure;

function randombetween(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

//A enlever après
const margin = { top: 10, right: 40, bottom: 40, left: 50 },
  width = 1200 - margin.left - margin.right,
  height = 600 + margin.top + margin.bottom;

function getData(rawData) {
  var ages = [];
  rawData.map((d) => ages.push(d.Age));
  const data = {
    ageAxeMin: d3.min(ages),
    ageAxeMax: d3.max(ages),
    data: { name: "Age des testés", class: "ageGraph", values: [] },
  };

  ages = [...new Set(ages)];

  // <20
  data.data.values.push({
    age: "<20",
    value: rawData.filter((d) => d.Age <= 20).length,
    star: [],
  });

  for (let i = 30; i < 65; i += 10) {
    data.data.values.push({
      age: `${i - 10}-${i}`,
      value: rawData.filter((d) => i - 10 < d.Age && d.Age <= i).length,
      star: [],
    });
  }
  // 65<
  data.data.values.push({
    age: "65<",
    value: rawData.filter((d) => 65 <= d.Age).length,
    star: [],
  });

  data.data.values.forEach((element) => {
    for (let i = 0; i < element.value; i += 10) {
      element.star.push({});
    }
  });

  return data;
}

//DRAW

function draw(data) {
  figure = d3
    .select("#graphe-3")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr(
      "viewBox",
      "0 0 " +
        (width + margin.left + margin.right) +
        " " +
        (height + margin.top + margin.bottom)
    )
    .attr("overflow", "visible")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  const yScale = d3.scaleLinear().range([height, 0]).domain([0, 130]);

  const yAxis = d3.axisLeft(yScale).ticks(7);
  figure.append("g").call(yAxis);
  const xScale = d3
    .scaleBand()
    .range([0, width])
    .domain(data.data.values.map((d) => d.age))
    .padding("0.2");
  figure
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale));

  //tooltip
  var Tooltip2 = d3
    .select("#graphe-3")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("position", "absolute");

  //code
  figure
    .selectAll(".gBin")
    .data(data.data.values)
    .enter()
    .append("g")
    .attr("class", "gBin")
    .attr(
      "transform",
      (d) => `translate(${xScale(d.age) + margin.left}, ${height})`
    )
    .on("mouseover", function (event, d) {
      return Tooltip2.style("opacity", 1);
    })
    .on("mousemove", function (event, d) {
      return Tooltip2.html(`Valeur exacte: ${d.value} personnes`)
        .style("left", `${event.layerX + 10}px`)
        .style("top", `${event.layerY}px`);
    })
    .on("mouseleave", function (event, d) {
      return Tooltip2.style("opacity", 0);
    })
    .selectAll("path")
    .data((d) =>
      d.star.map((p, i) => {
        return { idx: i };
      })
    )
    .enter()
    .append("path")
    .attr("class", "enter")
    .attr(
      "d",
      "m47.776 21.864-9.86 8.748 2.954 13.024c.156.68.112 1.393-.128 2.048a3.551 3.551 0 0 1-1.22 1.636 3.454 3.454 0 0 1-3.863.17L24.486 40.6l-11.149 6.89a3.454 3.454 0 0 1-3.863-.17 3.55 3.55 0 0 1-1.22-1.636 3.612 3.612 0 0 1-.128-2.048l2.949-13.01-9.862-8.762A3.564 3.564 0 0 1 .13 20.13a3.613 3.613 0 0 1 .042-2.056 3.557 3.557 0 0 1 1.154-1.688 3.466 3.466 0 0 1 1.88-.757l12.998-1.145L21.277 2.18A3.533 3.533 0 0 1 22.56.595a3.446 3.446 0 0 1 3.867 0c.572.388 1.02.94 1.284 1.585l5.09 12.303 12.993 1.145c.687.059 1.34.322 1.88.757.54.435.941 1.022 1.154 1.688.213.666.227 1.382.042 2.056a3.564 3.564 0 0 1-1.084 1.735h-.011Z"
    )
    .attr("fill", "#E8EA7D")
    .attr("transform", function (d) {
      return `translate(${randombetween(
        -1000,
        3000
      )}, ${randombetween(-1000, 3000)})`;
    });

  //name to axis

  figure
    .append("text")
    .attr("class", "label")
    .attr("x", width - 530)
    .attr("y", height + 100)
    .style("fill", "white")
    .style("text-anchor", "middle")
    .text("Répartition des âges de l'échantillon");

  figure
    .append("text")
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .attr("y", -130)
    .attr("x", -310)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .style("fill", "white")
    .text("Nombre de personnes");
}

function scrollOn() {
  document.querySelector("#graphe-3").style.opacity = 1;

  figure
    .selectAll(".gBin")
    .selectAll("path")
    .transition()
    .ease(d3.easeLinear)
    .duration(2000)
    .attr("transform", function (d) {
      return "translate(0," + -48 * (d.idx + 1) + ")";
    });
}

function scrollOut() {
  document.querySelector("#graphe-3").style.opacity = 0.2;
}

export { getData, draw, scrollOn, scrollOut };
