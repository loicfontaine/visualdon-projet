import { csv } from "d3-fetch";
import { select, selectAll } from "d3-selection";
import { mean, min, max, range, extent, ascending, histogram } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import { scaleLinear, scaleOrdinal, scaleBand } from "d3-scale";
import { line, symbol, symbolStar } from "d3-shape";
import { schemeSet2 } from "d3-scale-chromatic";
import { transition } from "d3-transition";

import scrollama from "scrollama";
//import my graph

import * as graphe1 from "./graphes/Graphe1.js";
import * as graphe2 from "./graphes/Graphe2";
import * as graphe3 from "./graphes/Graphe3";
import * as graphe4 from "./graphes/Graphe4";
import * as graphe5 from "./graphes/Graphe5";
import * as graphe6 from "./graphes/Graphe6";
import * as graphe7 from "./graphes/Graphe7";
import * as graphe8 from "./graphes/Graphe8";

const grapheUn = document.querySelector("#graphe-1");

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

    //graphe 4

    //graphe 5

    //graphe pas utilisé
    let sommeReveilAlcool = 0;
    let sommeReveilNoAlcool = 0;

    const alcoolData = cleanData.filter((d) => d.Alcohol_consumption > 0);
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

    //graphe 8 cafeine

    return [
      maleGraph,
      graphe2.getData(cleanData),
      graphe3.getData(cleanData),
      graphe4.getData(cleanData),
      graphe5.getData(cleanData),
      graphe6.getData(cleanData),
      graphe7.getData(cleanData),
      graphe8.getData(cleanData),
    ];
  })
  .then(function (graphes) {
    //margin
    const margin = { top: 10, right: 40, bottom: 40, left: 50 },
      width = 1200 - margin.left - margin.right,
      height = 600 + margin.top + margin.bottom;

    //graphe 1
    graphe1.draw(grapheUn, graphes[0].malePercentage, true);
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
    graphe2.draw(graphes[1]);

    //graphe 3
    graphe3.draw(graphes[2]);

    //graphe 4
    graphe4.draw(graphes[3]);

    //graphe 5
    graphe5.draw(graphes[4]);

    //graphe 6
    graphe6.draw(graphes[5]);

    //graphe 7

    graphe7.draw(graphes[6]);

    //graphe 8

    graphe8.draw(graphes[7]);
    // instantiate the scrollama
    const scroller = scrollama();

    // setup the instance, pass callback functions
    scroller
      .setup({
        step: ".graphe-line",
      })
      .onStepEnter((response) => {
        // { element, index, direction }
        getGraphObject(response.element.id).scrollOn();
      })
      .onStepExit((response) => {
        getGraphObject(response.element.id).scrollOut();
        // { element, index, direction }
        // response.element.style.opacity = 0;
      });

    //FIN METTRE AVANT
  });

function getGraphObject(id) {
  switch (id) {
    case "graphe-1":
      return graphe1;
    case "graphe-2":
      return graphe2;
    case "graphe-3":
      return graphe3;
    case "graphe-4":
      return graphe4;
    case "graphe-5":
      return graphe5;
    case "graphe-6":
      return graphe6;
      break;
    case "graphe-7":
      console.log("hey");
      return graphe7;
      break;
    case "graphe-8":
      return graphe8;
      break;
  }
}

//animation try

function randombetween(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}

console.log(`${randombetween(-60, 100)}vh`);
document.querySelectorAll(".cloud").forEach((cloud) =>
  cloud.animate(
    [
      {
        transform: `translateX(-60vh)`,
        visibility: "visible",
      },
      {
        transform: "translateX(100vw)",
      },
    ],
    {
      duration: randombetween(10000, 30000),
      iterations: Infinity,
      easing: "linear",
      delay: randombetween(0, 4000),
    }
  )
);

document.querySelectorAll(".cloud").forEach(function (cloud) {
  var scale = randombetween(0.3, 1);
  cloud.style.top = `${randombetween(0, 40)}vh`;
  cloud.querySelector("svg").style.transform = `scale(${scale}, ${scale})`;
});

/*
  @-webkit-keyframes move {
    from {
      transform: translateX(-60vw);
      visibility: visible;
    }
    to {
      transform: translateX(100vw);
    }
  }
  
*/

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
