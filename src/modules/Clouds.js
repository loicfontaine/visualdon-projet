import * as d3 from "/import.js";

function randombetween(min, max, dec = 1) {
  return Math.round((Math.random() * (max - min) + min) * dec) / dec;
}

function move() {
  document.querySelectorAll(".cloud").forEach((cloud) =>
    cloud.animate(
      [
        {
          transform: first
            ? `translateX(${randombetween(0, 70)}vh)`
            : `translateX(-60vw)`,
          visibility: "visible",
        },
        {
          transform: "translateX(100vw)",
          visibility: "hidden",
        },
      ],
      {
        duration: randombetween(10500, 30000),
        iterations: first ? 1 : Infinity,
        easing: "linear",
        delay: first ? 0 : randombetween(0, 4000),
      }
    )
  );

  document.querySelectorAll(".cloud").forEach(function (cloud) {
    var scale = randombetween(0.3, 1, 10);
    //cloud.style.left = `${randombetween(-20, 60)}vh`;
    cloud.querySelector("svg").style.transform = `scale(${scale}, ${scale})`;
  });
}

function moveFirst() {
  document.querySelectorAll(".cloud").forEach(function (cloud) {
    var scale = randombetween(0.3, 1, 10);
    cloud.querySelector("svg").style.transform = `scale(${scale}, ${scale})`;
  });

  document.querySelectorAll(".cloud").forEach((cloud) =>
    cloud.animate(
      [
        {
          visibility: "visible",
          transform: "translateX(-60vw)",
        },
        {
          transform: "translateX(100vw)",
          visibility: "hidden",
        },
      ],
      {
        duration: randombetween(10500, 30000),
        iterations: Infinity,
        easing: "linear",
      }
    )
  );
}

/*
  for (var i = 0; i < 5; i++) {
    clouds
      .append("div")
      .attr("class", "cloud")
      .append("svg")
      .attr("class", "svgCloud")
      .attr("width", 600)
      .attr("height", 390)
      .attr("viewbox", "0 0 348 164")
      .append("path")
      .attr(
        "d",
        "M37.138 47.557A195.97 195.97 0 0 1 164.5 0c95.327 0 174.459 70.875 183.07 162.268C403.987 170.242 448 217.48 448 275.456c0 63.645-53.085 114.356-117.404 114.356H14.989c-73.462 0-133.989-57.904-133.989-130.48 0-62.477 44.864-114.215 104.257-127.327 5.068-30.583 24.736-61.06 51.88-84.448Z"
      )
      .attr("transform", "translate(150 0)");
  }

*/

export { move, moveFirst };
