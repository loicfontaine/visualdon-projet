import { csv } from "d3-fetch";
import * as d3 from "/import";
import { select, selectAll } from "d3-selection";

import scrollama from "scrollama";
//import my graph

import * as graphe1 from "./modules/graphes/Graphe1.js";
import * as graphe2 from "./modules/graphes/Graphe2";
import * as graphe3 from "./modules/graphes/Graphe3";
import * as graphe4 from "./modules/graphes/Graphe4";
import * as graphe5 from "./modules/graphes/Graphe5";
import * as graphe6 from "./modules/graphes/Graphe6";
import * as graphe7 from "./modules/graphes/Graphe7";
import * as graphe8 from "./modules/graphes/Graphe8";
import * as clouds from "./modules/Clouds";

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
        (d.Alcohol_consumption = +d.Alcohol_consumption * 29.5735),
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
    graphe1.draw(grapheUn, 0.2, true);
    graphe1.setData(graphes[0].malePercentage);

    /*
    document.querySelector("#men-text").innerText = `il y'a ${Math.round(
      graphes[0].malePercentage * 100
    )}% d'hommes et de femmes`;

    console.log(graphes[0].malePercentage);

    grapheUn.addEventListener("mouseover", function (e) {
      document.querySelector("#men-text").style.opacity = 1;
    });
    grapheUn.addEventListener("mouseout", function (e) {
      document.querySelector("#men-text").style.opacity = 0;
    });
*/
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
        step: ".scroll-action",
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
      break;
    case "graphe-2":
      return graphe2;
      break;
    case "graphe-3":
      return graphe3;
      break;
    case "graphe-4":
      return graphe4;
      break;
    case "graphe-5":
      return graphe5;
      break;
    case "graphe-6":
      return graphe6;
      break;
    case "graphe-7":
      return graphe7;
      break;
    case "graphe-8":
      return graphe8;
      break;
  }
}

//animation try
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

window.addEventListener("load", (e) => {
  clouds.moveFirst();
  //clouds.move();
});

window.onscroll = function (ev) {
  if (window.innerHeight + window.scrollY + 20 >= document.body.offsetHeight) {
    document
      .querySelector("#flex-bot")
      .classList.add("cssanimation", "sequence", "fadeInBottom");
  }
  if (window.innerHeight + window.scrollY + 20 < document.body.offsetHeight) {
    //alert("you're at the bottom of the page");
    document
      .querySelector("#flex-bot")
      .classList.remove("cssanimation", "sequence", "fadeInBottom");
  }
};

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
