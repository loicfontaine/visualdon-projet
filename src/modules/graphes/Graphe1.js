import * as d3 from "/import.js";

var data;
const graphe = document.querySelector("#graphe-1");
function setData(dataR) {
  data = dataR;
}

var draw = (function () {
  "use strict";
  /*jslint browser: true, forin: true, white: true */

  function calcInner(outerDiameter, semiPhase) {
    var innerRadius,
      absPhase = Math.abs(semiPhase),
      n = ((1 - absPhase) * outerDiameter) / 2 || 0.01;

    innerRadius = n / 2 + (outerDiameter * outerDiameter) / (8 * n);

    return {
      d: innerRadius * 2,
      o:
        semiPhase > 0
          ? outerDiameter / 2 - n
          : -2 * innerRadius + outerDiameter / 2 + n,
    };
  }

  function setCss(el, props) {
    var p;
    for (p in props) {
      el.style[p] = props[p];
      el.classList.add("moon-container");
    }
  }
  function drawDiscs(outer, inner, blurSize) {
    var blurredDiameter, blurredOffset;
    setCss(outer.box, {
      position: "relative",
      height: outer.diameter + "px",
      width: outer.diameter + "px",
      //border: "1px solid black",
      backgroundColor: outer.colour,
      borderRadius: outer.diameter / 2 + "px",
      overflow: "hidden",
      zIndex: "-100",
    });

    blurredDiameter = inner.diameter - blurSize;
    blurredOffset = inner.offset + blurSize / 2;

    setCss(inner.box, {
      position: "absolute",
      backgroundColor: inner.colour,
      borderRadius: blurredDiameter / 2 + "px",
      height: blurredDiameter + "px",
      width: blurredDiameter + "px",
      left: blurredOffset + "px",
      top: (outer.diameter - blurredDiameter) / 2 + "px",
      boxShadow:
        "0px 0px " + blurSize + "px " + blurSize + "px " + inner.colour,
      opacity: inner.opacity,
    });
  }
  function makeDiv(container) {
    var div = document.createElement("div");
    container.appendChild(div);
    return div;
  }
  function setPhase(outerBox, phase, isWaxing, config) {
    var innerBox = makeDiv(outerBox),
      outerColour,
      innerColour,
      innerVals;

    if (phase < 0.5) {
      outerColour = config.lightColour;
      innerColour = config.shadowColour;
      if (isWaxing) {
        phase *= -1;
      }
    } else {
      outerColour = config.shadowColour;
      innerColour = config.lightColour;
      phase = 1 - phase;
      if (!isWaxing) {
        phase *= -1;
      }
    }

    innerVals = calcInner(config.diameter, phase * 2);

    drawDiscs(
      {
        box: outerBox,
        diameter: config.diameter,
        colour: outerColour,
      },
      {
        box: innerBox,
        diameter: innerVals.d,
        colour: innerColour,
        offset: innerVals.o,
        opacity: 1 - config.earthshine,
      },
      config.blur
    );
  }

  var defaultConfig = {
    shadowColour: "#0b0431", // CSS background-colour value for the shaded part of the disc
    lightColour: "#9CABE0", // CSS background-colour value for the illuminated part of the disc
    diameter: 180, // diameter of the moon/planets disc in pixels
    earthshine: 0, // between 0 and 1, the amount of light falling on the shaded part of the disc 0=none, 1=full illumination
    blur: 4, // amount of blur on the terminator in pixels, 0=no blur
  };

  function populateMissingConfigValues(config) {
    var p;
    for (p in defaultConfig) {
      config[p] = config[p] === undefined ? defaultConfig[p] : config[p];
    }
    return config;
  }

  return function (containerEl, phase, isWaxing, config) {
    config = populateMissingConfigValues(Object.create(config || {}));
    var el = makeDiv(containerEl);
    setPhase(el, phase, isWaxing, config);
  };
})();

function scrollOn() {
  document
    .querySelector("#moon-text")
    .classList.add("cssanimation", "sequence", "fadeInBottom");
  graphe.style.opacity = 1;

  var timer = setInterval(myFunction, 30);
  var moonCount = 0.2;
  function myFunction() {
    if (moonCount >= data) {
      //draw(graphe, data, true);
      clearInterval(timer);

      return;
    } else {
      let oldMoon = document.querySelector(".moon-container");
      if (oldMoon != null) {
        oldMoon.remove();
      }

      draw(graphe, moonCount, true);
      moonCount += 0.013;
    }
  }
}
function scrollOut() {
  document.querySelector(".moon-container").remove();
  draw(graphe, 0.2, true);
  document.querySelector("#graphe-1").style.opacity = 0.2;
  document
    .querySelector("#moon-text")
    .classList.remove("cssanimation", "sequence", "fadeInBottom");
  document.querySelector("#moon-text").style.opacity = 0;
}

export { draw, scrollOut, scrollOn, setData };
