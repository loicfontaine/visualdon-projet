import { csv } from "d3-fetch";
import { select } from "d3-selection";
import { mean, min, max, extent, ascending } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import { scaleLinear, scaleOrdinal } from "d3-scale";
import { line } from "d3-shape";
import { schemeSet2 } from "d3-scale-chromatic";

const grapheUn = document.querySelector("#graphe-1");
const grapheDeux = document.querySelector("#graphe-2");
const grapheTrois = document.querySelector("#graphe-3");
const grapheQuatre = document.querySelector("#graphe-4");
const grapheCinq = document.querySelector("#graphe-5");

select("body").append("div").attr("id", "monSvg");
select("#monSvg").append("svg").attr("width", "500").attr("height", "500");

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

    var age = [];
    cleanData.map((d) => age.push(d.Age));

    const ageGraphe = {
      ageAxeMin: min(age),
      ageAxeMax: max(age),
    };

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
      data: alcoolData,
      SleepData: [],
    };

    for (var i = 0; i < max(alcool); i++) {
      var tab = [];
      cleanData
        .filter((d) => d.Alcohol_consumption === i)
        .map((d) => tab.push(d.Sleep_efficiency));
      alcoolGraphe.SleepData.push({ moyenneSleep: mean(tab), alcool: i });
    }
    console.log("là", alcoolGraphe);

    //graphe 7
    var sport = [];
    cleanData.map((d) => sport.push(d.Exercise_frequency));

    const sportGraphe = {
      sportAxeMin: min(sport),
      sportAxeMax: max(sport),
      data: cleanData,
    };

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

    return [
      maleGraph,
      nuitMoyenneGraphe,
      ageGraphe,
      caffeineGraphe,
      fumeurGraphe,
      alcoolGraphe,
      sportGraphe,
    ];
  })
  .then(function (graphes) {
    //margin
    const margin = { top: 10, right: 40, bottom: 20, left: 40 },
      width = 0.8 * window.innerWidth - margin.left - margin.right,
      height = 0.7 * window.innerHeight + margin.top + margin.bottom;

    //graphe 1

    grapheUn.innerText = `Hommes: ${graphes[0].malePercentage}
Femmes: ${graphes[0].femalePercentage}`;

    //graphe 2
    grapheDeux.innerText = `Nuit moyenne: ${graphes[1].hours}h${graphes[1].minutes}`;

    //graphe 3 définir comment gérer les pourcentages vu que tous les ages ne peuvent être affiché
    const figure = select("#graphe-3")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const yScale = scaleLinear().range([height, 0]).domain([0, 100]);
    figure.append("g").call(axisLeft(yScale));

    const xScale = scaleLinear()
      .range([0, width])
      .domain([graphes[2].ageAxeMin, graphes[2].ageAxeMax]);
    figure
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(axisBottom(xScale));

    //graphe 4

    grapheQuatre.innerText = `+${graphes[3]}% d'efficacité de sommeil lorsque de la cafféine est consommée`;

    //graphe 5
    grapheCinq.innerText = `${graphes[4]}% d'efficacité de sommeil pour les fumeurs`;

    //graphe 6
    console.log(graphes[5]);
    const figure2 = select("#graphe-6")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const yScale2 = scaleLinear().range([height, 0]).domain([0, 100]);
    figure2.append("g").call(axisLeft(yScale2));

    const xScale2 = scaleLinear()
      .range([0, width])
      .domain([graphes[5].alcoolAxeMin, graphes[5].alcoolAxeMax]);
    figure2
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(axisBottom(xScale2));

    var x = scaleLinear()
      .domain(
        extent(graphes[5].data, function (d) {
          return d.Alcohol_consumption;
        })
      )
      .range([0, width]);
    figure2
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(axisBottom(x));

    var y = scaleLinear()
      .domain([
        0,
        max(graphes[5].data, function (d) {
          return d.Sleep_efficiency;
        }),
      ])
      .range([height, 0]);
    figure2.append("g").call(axisLeft(y));

    figure2
      .append("path")
      .datum(graphes[5].data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        line()
          .x(function (d) {
            return x(d.Alcohol_consumption);
          })
          .y(function (d) {
            return y(d.Sleep_efficiency);
          })
      );

    //graphe 6 test

    const grapheSixTest = graphes[5].data.sort(function (a, b) {
      return a.Alcohol_consumption - b.Alcohol_consumption;
    });

    //arry.sort(function (a, b) { return a[2] - b[2]; });

    console.log("ici", grapheSixTest);
    const figure3 = select("#graphe-6-test")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var allGroup = ["valueA", "valueB"];

    const dataReady = allGroup.map(function (grpName) {
      // .map allows to do something for each element of the list
      return {
        name: grpName,
        values: graphes[5].SleepData.map(function (d) {
          return { alcool: d.alcool, sleep: +d.moyenneSleep };
        }),
      };
    });
    console.log(graphes[5].data);
    console.log(dataReady);

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
      .y((d) => yScale3(+d.sleep * 100));

    figure3
      .selectAll("myLines")
      .data(dataReady)
      .join("path")
      .attr("d", (d) => line2(d.values))
      .attr("stroke", (d) => myColor(d.name))
      .style("stroke-width", 4)
      .style("fill", "none");
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
*/
