import { csv } from "d3-fetch";
import { select, selectAll } from "d3-selection";
import { mean, min, max, range, extent, ascending, histogram } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import { scaleLinear, scaleOrdinal, scaleBand } from "d3-scale";
import { line, symbol, symbolStar } from "d3-shape";
import { schemeSet2 } from "d3-scale-chromatic";
import { transition } from "d3-transition";
import { drawPlanetPhase } from "./Moon.js";
import scrollama from "scrollama";

const grapheUn = document.querySelector("#graphe-1");
const grapheDeux = document.querySelector("#graphe-2");
const grapheQuatre = document.querySelector("#graphe-4");

const dessin = select("svg");

csv("/data/Sleep_Efficiency.csv")
  .then(function (data) {
    data.map(
      (d) => (
        (d.Age = +d.Age),
        (d.id = +d.id),
        (d.Awakenings = +d.Awakenings),
        (d.Sleep_efficiency = +d.Sleep_efficiency),
        (d.Alcohol_consumption = +d.Alcohol_consumption),
        (d.Caffeine_consumption = +d.Caffeine_consumption),
        (d.Deep_sleep_percentage = +d.Deep_sleep_percentage / 100),
        (d.Exercise_frequency = +d.Exercise_frequency),
        (d.Light_sleep_percentage = +d.Light_sleep_percentage / 100),
        (d.REM_sleep_percentage = +d.REM_sleep_percentage / 100),
        (d.Sleep_duration = +d.Sleep_duration),
        (d.Sleep_efficiency = +d.Sleep_efficiency),
        d.Smoking_status === "Yes"
          ? (d.Smoking_status = true)
          : (d.Smoking_status = false)
      )
    );

    return data;
  })

  .then(function (cleanData) {
    console.log(cleanData);

    //graphe 1
    const male =
      cleanData.filter((d) => d.Gender === "Male").length / cleanData.length;

    const maleGraph = {
      malePercentage: male,
      femalePercentage: 1 - male,
    };

    //graphe 2
    let nuitTotal = 0;
    cleanData.map((d) => (nuitTotal += d.Sleep_duration));
    var nuitMoyenne = (nuitTotal / cleanData.length) * 60 * 60;

    var hours = Math.floor(nuitMoyenne / (60 * 60));
    nuitMoyenne = nuitMoyenne - hours * 60 * 60;
    var minutes = Math.floor(nuitMoyenne / 60);
    const nuitMoyenneGraphe = {
      hours: hours,
      minutes: minutes,
    };
    //console.log(`nuit moyenne: 0${hours}:${minutes}`);

    //graphe 3

    var ages = [];
    cleanData.map((d) => ages.push(d.Age));
    const ageGraphe = {
      ageAxeMin: min(ages),
      ageAxeMax: max(ages),
      data: { name: "Age des testés", class: "ageGraph", values: [] },
    };

    ages = [...new Set(ages)];

    // <20
    ageGraphe.data.values.push({
      age: "<20",
      value: cleanData.filter((d) => d.Age <= 20).length,
      star: [],
    });

    for (let i = 30; i < 65; i += 10) {
      ageGraphe.data.values.push({
        age: `${i - 10}-${i}`,
        value: cleanData.filter((d) => i - 10 < d.Age && d.Age <= i).length,
        star: [],
      });
    }
    // 65<
    ageGraphe.data.values.push({
      age: "65<",
      value: cleanData.filter((d) => 65 <= d.Age).length,
      star: [],
    });

    ageGraphe.data.values.forEach((element) => {
      for (let i = 0; i < element.value; i += 10) {
        element.star.push({});
      }
    });

    console.log(ageGraphe);

    //graphe 4
    const caffeine = cleanData.filter((d) => d.Caffeine_consumption > 0);
    const noCaffeine = cleanData.filter((d) => d.Caffeine_consumption === 0);
    let sommeSommeilCaffeine = 0;
    let sommeSommeilNoCaffeine = 0;

    caffeine.map((d) => (sommeSommeilCaffeine += d.Sleep_efficiency));
    noCaffeine.map((d) => (sommeSommeilNoCaffeine += d.Sleep_efficiency));
    const moyenneSommeilCaffeine = sommeSommeilCaffeine / caffeine.length;
    const moyenneSommeilNoCaffeine = sommeSommeilNoCaffeine / noCaffeine.length;
    const caffeineGraphe =
      (moyenneSommeilCaffeine - moyenneSommeilNoCaffeine) * 100;

    //graphe 5

    const fumeur = cleanData.filter((d) => d.Smoking_status === true);
    const nonFumeur = cleanData.filter((d) => d.Smoking_status === false);
    let sommeSommeilFumeur = 0;
    let sommeSommeilNonFumeur = 0;

    fumeur.map((d) => (sommeSommeilFumeur += d.Sleep_efficiency));
    nonFumeur.map((d) => (sommeSommeilNonFumeur += d.Sleep_efficiency));
    const moyenneSommeilFumeur = sommeSommeilFumeur / fumeur.length;
    const moyenneSommeilNonFumeur = sommeSommeilNonFumeur / nonFumeur.length;
    const fumeurGraphe = (moyenneSommeilFumeur - moyenneSommeilNonFumeur) * 100;

    //graphe 6
    var alcool = [];
    cleanData.map((d) => alcool.push(d.Alcohol_consumption));
    const alcoolData = cleanData.filter((d) => d.Alcohol_consumption > 0);

    const alcoolGraphe = {
      alcoolAxeMin: min(alcool),
      alcoolAxeMax: max(alcool),
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

    for (var i = 0; i < max(alcool); i++) {
      var tabEfficiency = [];
      var tabDeep = [];
      cleanData
        .filter((d) => d.Alcohol_consumption === i)
        .map(function (d) {
          tabEfficiency.push(d.Sleep_efficiency);
          tabDeep.push(d.Deep_sleep_percentage);
        });

      alcoolGraphe.data[0].values.push({
        value: mean(tabEfficiency) * 100,
        alcool: i,
      });
      alcoolGraphe.data[1].values.push({
        value: mean(tabDeep) * 100,
        alcool: i,
      });
    }

    console.log("là", alcoolGraphe);
    44;

    //graphe 7
    var sport = [];
    cleanData.map((d) => sport.push(d.Exercise_frequency));

    const sportGraphe = {
      sportAxeMax: max(sport),
      data: {
        name: "Fréquence de sport",
        class: "sportFrequency",
        values: [],
      },
    };

    for (let i = 0; i < max(sport); i++) {
      var tab = [];
      cleanData
        .filter((d) => d.Exercise_frequency === i)
        .map(function (d) {
          tab.push(d.Awakenings);
        });

      sportGraphe.data.values.push({
        value: mean(tab),
        sport: i,
      });
    }
    console.log("sport", sportGraphe);
    //graphe 8
    let sommeReveilAlcool = 0;
    let sommeReveilNoAlcool = 0;

    const noAlcool = cleanData.filter((d) => d.Alcohol_consumption === 0);
    alcoolData.map((d) => (sommeReveilAlcool += d.Awakenings));
    noAlcool.map((d) => (sommeReveilNoAlcool += d.Awakenings));
    const moyenneReveilAlcool = sommeReveilAlcool / alcoolData.length;
    const moyenneReveilNoAlcool = sommeReveilNoAlcool / noAlcool.length;
    const alcoolReveilGraphe = {
      alcool: moyenneReveilAlcool,
      noAlcool: moyenneReveilNoAlcool,
    };
    console.log(alcoolReveilGraphe);

    //graphe 9 cafeine
    var caffeines = [];
    cleanData.map((d) => caffeines.push(d.Caffeine_consumption));

    caffeines = [...new Set(caffeines)].sort((x, y) => x - y);

    const caffeineGraphe2 = {
      caffeineAxeMax: max(caffeines),
      data: {
        name: "Efficacité de sommeil",
        class: "sleepEfficiency",
        values: [],
      },
    };

    caffeines.forEach((caffeineConsumption) => {
      var tab = [];
      cleanData
        .filter((d) => d.Caffeine_consumption === caffeineConsumption)
        .map(function (d) {
          tab.push(d.Sleep_efficiency);
        });

      caffeineGraphe2.data.values.push({
        value: mean(tab) * 100,
        caffeine: caffeineConsumption,
      });
    });

    console.log("caffeines", caffeineGraphe2);

    return [
      maleGraph,
      nuitMoyenneGraphe,
      ageGraphe,
      caffeineGraphe,
      fumeurGraphe,
      alcoolGraphe,
      sportGraphe,
      caffeineGraphe2,
    ];
  })
  .then(function (graphes) {
    //margin
    const margin = { top: 10, right: 40, bottom: 40, left: 50 },
      width = 1200 - margin.left - margin.right,
      height = 600 + margin.top + margin.bottom;

    //graphe 1
    drawPlanetPhase(grapheUn, graphes[0].malePercentage, true);
    document.querySelector("#men-text").innerText = `il y'a ${Math.round(
      graphes[0].malePercentage * 100
    )}% d'hommes et de femmes`;

    grapheUn.addEventListener("mouseover", function (e) {
      document.querySelector("#men-text").style.opacity = 1;
    });
    grapheUn.addEventListener("mouseout", function (e) {
      document.querySelector("#men-text").style.opacity = 0;
    });

    //graphe 2
    document.querySelector(
      "#graphe-2 #myText h2"
    ).innerText = `${graphes[1].hours}h${graphes[1].minutes}`;

    //graphe 3
    const figure = select("#graphe-3")
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
    const yScale = scaleLinear().range([height, 0]).domain([0, 130]);

    const yAxis = axisLeft(yScale);
    figure.append("g").call(yAxis);
    const xScale = scaleBand()
      .range([0, width])
      .domain(graphes[2].data.values.map((d) => d.age))
      .padding("0.2");
    figure
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(axisBottom(xScale));

    //tooltip
    var Tooltip2 = select("#graphe-3")
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
      .data(graphes[2].data.values)
      .enter()
      .append("g")
      .attr("class", "gBin")
      .attr(
        "transform",
        (d) => `translate(${xScale(d.age) + margin.left + 8}, ${height})`
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
        return "translate(0," + -48 * (d.idx + 1) + ")";
      });

    //name to axis

    console.log("graphe3", graphes[2]);

    //graphe 4
    document.querySelector("#graphe-4 #myText h2").innerText = `+${
      Math.round(graphes[3] * 100) / 100
    }%`;

    //graphe 5
    document.querySelector("#graphe-5 #myText h2").innerText = `${
      Math.round(graphes[4] * 100) / 100
    }%`;

    //graphe 6

    const figure3 = select("#graphe-6")
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

    var allGroup = [graphes[5].data[0].name, graphes[5].data[1].name];

    const yScale3 = scaleLinear().range([height, 0]).domain([0, 100]);
    figure3.append("g").call(axisLeft(yScale3));

    const xScale3 = scaleLinear()
      .range([0, width])
      .domain([0, graphes[5].alcoolAxeMax]);

    figure3
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(axisBottom(xScale3));

    const myColor = scaleOrdinal().domain(allGroup).range(schemeSet2);

    const line2 = line()
      .x((d) => xScale3(+d.alcool))
      .y((d) => yScale3(+d.value));

    figure3
      .selectAll("myLines")
      .data(graphes[5].data)
      .join("path")
      .attr("class", (d) => d.class)
      .attr("d", (d) => line2(d.values))
      .attr("stroke", (d) => myColor(d.name))
      .style("stroke-width", 4)
      .style("fill", "none");

    //tooltip
    var Tooltip = select("#graphe-6")
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
    figure3
      .selectAll("myDots")
      .data(graphes[5].data)
      .join("g")
      .style("fill", (d) => myColor(d.name))
      .attr("class", (d) => d.class)
      // Second we need to enter in the 'values' part of this group
      .selectAll("myPoints")
      .data((d) => d.values)
      .join("circle")
      .attr("cx", (d) => xScale3(d.alcool))
      .attr("cy", (d) => yScale3(d.value))
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
    figure3
      .selectAll("myLabels")
      .data(graphes[5].data)
      .join("g")
      .attr("class", (d) => d.class)
      .append("text")
      .datum((d) => {
        return { name: d.name, value: d.values[d.values.length - 1] };
      }) // keep only the last value of each time series
      .attr(
        "transform",
        (d) => `translate(${xScale3(d.value.alcool)},${yScale3(d.value.value)})`
      ) // Put the text at the position of the last point
      .attr("x", 12) // shift the text a bit more right
      .text((d) => d.name)
      .style("fill", (d) => myColor(d.name))
      .style("font-size", 15);

    //légende intéractive

    figure3
      .selectAll("myLegend")
      .data(graphes[5].data)
      .join("g")
      .append("text")
      .attr("x", (d, i) => 60 + i * 260)
      .attr("y", 30)
      .text((d) => d.name)
      .style("fill", (d) => myColor(d.name))
      .style("font-size", 15)
      .on("click", function (event, d) {
        // is the element currently visible ?
        var currentOpacity = selectAll("." + d.class).style("opacity");
        // Change the opacity: from 0 to 1 or from 1 to 0
        selectAll("." + d.class)
          .transition()
          .style("opacity", currentOpacity == 1 ? 0.3 : 1);
      });

    //axis labels

    //graphe 7

    const figure4 = select("#graphe-7")
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

    const yScale4 = scaleLinear().range([height, 0]).domain([0, 3]);
    figure4.append("g").call(axisLeft(yScale4));

    const xScale4 = scaleLinear()
      .range([0, width])
      .domain([0, graphes[6].sportAxeMax]);

    figure4
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(axisBottom(xScale4));
    console.log(graphes[6]);

    const line3 = line()
      .x((d) => xScale4(+d.sport))
      .y((d) => yScale4(+d.value));

    figure4
      .append("path")
      .datum(graphes[6].data)
      .attr("fill", "none")
      .attr("stroke", "#69b3a2")
      .attr("stroke-width", 4)
      .attr("d", (d) => line3(d.values));

    //Tooltip
    var Tooltip2 = select("#graphe-7")
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
    figure4
      .append("g")
      .selectAll("dot")
      .data(graphes[6].data.values)
      .join("circle")
      .attr("cx", (d) => xScale4(d.sport))
      .attr("cy", (d) => yScale4(d.value))
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

    //graphe 8

    const figure5 = select("#graphe-8")
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

    const yScale5 = scaleLinear().range([height, 0]).domain([0, 100]);
    figure5.append("g").call(axisLeft(yScale5));

    const xScale5 = scaleLinear()
      .range([0, width])
      .domain([0, graphes[7].caffeineAxeMax]);

    figure5
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(axisBottom(xScale5));

    const line4 = line()
      .x((d) => xScale5(+d.caffeine))
      .y((d) => yScale5(+d.value));

    var Tooltip3 = select("#graphe-8")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")
      .style("position", "absolute");

    const path = figure5
      .append("path")
      .datum(graphes[7].data)
      .attr("fill", "none")
      .attr("stroke", "#69b3a2")
      .attr("stroke-width", 4)
      .attr("d", (d) => line4(d.values));

    const length = path.node().getTotalLength();
    console.log("length", length);

    path
      .attr("stroke-dasharray", length + " " + length)
      .attr("stroke-dashoffset", length);

    console.log(graphes[7].data.values[0].caffeine);

    //points
    figure5
      .append("g")
      .attr("class", "points")
      .attr("opacity", "0")
      .selectAll("dot")
      .data(graphes[7].data.values)
      .join("circle")
      .attr("cx", (d) => xScale5(d.caffeine))
      .attr("cy", (d) => yScale5(d.value))
      .attr("r", 7)
      .attr("fill", "#69b3a2")
      .on("mouseover", function (event, d) {
        return Tooltip3.style("opacity", 1);
      })
      .on("mousemove", function (event, d) {
        return Tooltip3.html(`Valeur exacte: ${Math.round(d.value)}%`)
          .style("left", `${event.layerX + 10}px`)
          .style("top", `${event.layerY}px`);
      })
      .on("mouseleave", function (event, d) {
        return Tooltip3.style("opacity", 0);
      });

    // instantiate the scrollama
    const scroller = scrollama();

    // setup the instance, pass callback functions
    scroller
      .setup({
        step: ".graphe-line",
      })
      .onStepEnter((response) => {
        // { element, index, direction }
        console.log();
        document.querySelector("#graphe-8").style.opacity = 1;
        path.transition().attr("stroke-dashoffset", 0).duration(2000);
        figure5.select(".points").transition().delay(2000).attr("opacity", "1");
      })
      .onStepExit((response) => {
        document.querySelector("#graphe-8").style.opacity = 0.2;
        path
          .attr("stroke-dasharray", length + " " + length)
          .attr("stroke-dashoffset", length);
        figure5.select(".points").transition().attr("opacity", "0");
        // { element, index, direction }
        // response.element.style.opacity = 0;
      });

    //FIN METTRE AVANT
  });

/*

exemple d'implémentation
figure
  .selectAll()
  .data(goals)
  .enter()
  .append("rect")
  .attr("x", (s) => xScale(s.language))
  .attr("y", (s) => yScale(s.value))
  .attr("height", (s) => height - yScale(s.value))
  .attr("width", xScale.bandwidth());


//test

function resize() {
  var width = parseInt(select("#graphe-3").style("width"));
  select("#graphe-3").attr("width", width);
  select("#graphe-3").attr("height", (width * height) / width);

  select(window).on("resize", resize);
}
*/
