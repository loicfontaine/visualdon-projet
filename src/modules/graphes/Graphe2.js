function getData(rawData) {
  let nuitTotal = 0;
  rawData.map((d) => (nuitTotal += d.Sleep_duration));
  var nuitMoyenne = (nuitTotal / rawData.length) * 60 * 60;

  var hours = Math.floor(nuitMoyenne / (60 * 60));
  nuitMoyenne = nuitMoyenne - hours * 60 * 60;
  var minutes = Math.floor(nuitMoyenne / 60);
  const data = {
    hours: hours,
    minutes: minutes,
  };
  return data;
}

function draw(data) {
  document.querySelector(
    "#graphe-2 #myText h2"
  ).innerText = `${data.hours}h${data.minutes}`;
  document.querySelector("#graphe-2 #myText h2").style.marginLeft = "45px";
}

function scrollOn() {
  document.querySelector("#graphe-2").style.opacity = 1;
}

function scrollOut() {
  document.querySelector("#graphe-2").style.opacity = 0.2;
}

export { getData, draw, scrollOn, scrollOut };
