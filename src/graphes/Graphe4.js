function getData(rawData) {
  const caffeine = rawData.filter((d) => d.Caffeine_consumption > 0);
  const noCaffeine = rawData.filter((d) => d.Caffeine_consumption === 0);
  let sommeSommeilCaffeine = 0;
  let sommeSommeilNoCaffeine = 0;

  caffeine.map((d) => (sommeSommeilCaffeine += d.Sleep_efficiency));
  noCaffeine.map((d) => (sommeSommeilNoCaffeine += d.Sleep_efficiency));
  const moyenneSommeilCaffeine = sommeSommeilCaffeine / caffeine.length;
  const moyenneSommeilNoCaffeine = sommeSommeilNoCaffeine / noCaffeine.length;
  const data = (moyenneSommeilCaffeine - moyenneSommeilNoCaffeine) * 100;

  return data;
}

function draw(data) {
  document.querySelector("#graphe-4 #myText h2").innerText = `+${
    Math.round(data * 100) / 100
  }%`;
}

function scrollOn() {
  document.querySelector("#graphe-4").style.opacity = 1;
}

function scrollOut() {
  document.querySelector("#graphe-4").style.opacity = 0.2;
}

export { getData, draw, scrollOn, scrollOut };
