var drawPlanetPhase = (function () {
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
      el.classList.add("moon");
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
    //shadowColour: "black", // CSS background-colour value for the shaded part of the disc
    lightColour: "#9CABE0", // CSS background-colour value for the illuminated part of the disc
    diameter: 180, // diameter of the moon/planets disc in pixels
    earthshine: 0.1, // between 0 and 1, the amount of light falling on the shaded part of the disc 0=none, 1=full illumination
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
export { drawPlanetPhase };
