import { Chart, registerables } from "https://cdn.skypack.dev/chart.js@4.4.7";
Chart.register(...registerables);

const processData = (d, c, b) => {
  let polyD = {
    x: [],
    y: [],
  };
  const target = d.find((item) => item.category === c && item.bow === b);
  const rawData = target.scores.map((score) => ({
    x: Number(score.score),
    y: Number(score.handicap),
  }));
  rawData.forEach((item) => {
    polyD.x.push(item.x);
    polyD.y.push(item.y);
  });
  const poly = new Polyfit(polyD.x, polyD.y);
  const polynomeTerms = poly.computeCoefficients(30);
  const solver = poly.getPolynomial(30);
  const fittingCurve = [];
  let x_ = [];
  let y_ = [];
  const n = target.scores.length;
  const dx = (Math.max(...polyD.x) - Math.min(...polyD.x)) / n;
  for (let i = 0; i < n; i++) {
    x_[i] = Math.min(...polyD.x) + dx * i;
    y_[i] = solver(x_[i]);
    fittingCurve.push({ x: x_[i], y: y_[i] });
  }
  console.log(polynomeTerms, fittingCurve);
  return {
    datasets: [
      {
        type: "scatter",
        label: `${b} ${c}`,
        data: rawData,
        backgroundColor: "rgb(255, 99, 132)",
      },
      {
        type: "line",
        label: "Fitting Curve",
        data: fittingCurve,
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgb(54, 162, 235)",
        fill: false,
      },
    ],
  };
};
const config = {
  data: null,
  responsive: true,
  options: {
    scales: {
      y: {
        title: {
          display: true,
          text: "Handicap",
        },
      },
      x: {
        type: "linear",
        position: "bottom",
        title: {
          display: true,
          text: "Score",
        },
      },
    },
  },
};

const populateSelect = (select, data, baseItem) => {
  select.innerHTML = "";
  data.forEach((item) => {
    const option = document.createElement("wa-option");
    option.setAttribute("value", item);
    option.innerText = item;
    select.appendChild(option);
  });
};
const uniq = (items) => [...new Set(items)];

(async () => {
  const select = document.getElementById("round");
  const bowSelect = document.getElementById("bow");
  const categorySelect = document.getElementById("category");
  let round = select.value || "Portsmouth.json";
  let roundData = await fetch(`./data/${round.replaceAll("_", " ")}`).then(
    (res) => res.json(),
  );
  let uniqBows = uniq(roundData.map((item) => item.bow));
  let uniqCategories = uniq(roundData.map((item) => item.category));
  let currentBow = "Recurve";
  let currentCategory = "SNRM";
  config.data = processData(roundData, currentCategory, currentBow);
  populateSelect(bowSelect, uniqBows, currentBow);
  populateSelect(categorySelect, uniqCategories, currentCategory);
  bowSelect.addEventListener("change", (event) => {
    currentBow = event.target.value;
    config.data = processData(roundData, currentCategory, currentBow);
    chart.update();
  });
  categorySelect.addEventListener("change", (event) => {
    currentCategory = event.target.value;
    config.data = processData(roundData, currentCategory, currentBow);
    chart.update();
  });

  select.addEventListener("change", async (event) => {
    round = event.target.value;
    console.log(round);
    roundData = await fetch(`./data/${round.replaceAll("_", " ")}`).then(
      (res) => res.json(),
    );
    uniqBows = uniq(roundData.map((item) => item.bow));
    uniqCategories = uniq(roundData.map((item) => item.category));
    populateSelect(bowSelect, uniqBows, currentBow);
    populateSelect(categorySelect, uniqCategories, currentCategory);
    config.data = processData(roundData, currentCategory, currentBow);
    chart.update();
  });
  let chart = new Chart(document.getElementById("chart"), config);
})();
