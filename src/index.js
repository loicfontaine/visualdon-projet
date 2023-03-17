import { csv } from "d3-fetch";
import { select } from "d3-selection";
import { mean } from "d3-array";

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

    const malePercentage =
      cleanData.filter((d) => d.Gender === "Male").length / cleanData.length;

    const femalePercentage = 1 - malePercentage;

    console.log(
      `Dans les données, il y'a ${malePercentage * 100}% d'hommes et ${
        femalePercentage * 100
      }% de femmes`
    );

    const age = cleanData.map((d) => d.Age);

    console.log(mean(age));

    dessin
      .selectAll("rect")
      .data(cleanData)
      .join((enter) =>
        enter
          .append("g")
          .append("rect")
          .attr("width", "20")
          .attr("height", (d) => d.Age)
          .attr("x", (d, i) => i * 30)
          .attr("y", (d) => 500 - d * 10)
      );
  });

//data.map((d) => (sommeAge += d.Age));
