function getData(rawData) {
  const fumeur = rawData.filter((d) => d.Smoking_status === true);
  const nonFumeur = rawData.filter((d) => d.Smoking_status === false);
  let sommeSommeilFumeur = 0;
  let sommeSommeilNonFumeur = 0;

  fumeur.map((d) => (sommeSommeilFumeur += d.Sleep_efficiency));
  nonFumeur.map((d) => (sommeSommeilNonFumeur += d.Sleep_efficiency));
  const moyenneSommeilFumeur = sommeSommeilFumeur / fumeur.length;
  const moyenneSommeilNonFumeur = sommeSommeilNonFumeur / nonFumeur.length;
  const data = (moyenneSommeilFumeur - moyenneSommeilNonFumeur) * 100;

  return data;
}

function draw(data) {
  document.querySelector("#graphe-5 #myText h2").innerText = `${
    Math.round(data * 100) / 100
  }%`;
}

function scrollOn() {
  document.querySelector("#graphe-5").style.opacity = 1;
}

function scrollOut() {
  document.querySelector("#graphe-5").style.opacity = 0.2;
}

export { getData, draw, scrollOn, scrollOut };
