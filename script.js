import { Chart, registerables } from "https://cdn.skypack.dev/chart.js@4.4.7";
Chart.register(...registerables);

const processData = (d, c, b) => {
  const target = d.find((item) => item.category === c && item.bow === b);
  const rawData = target.scores.map((score) => ({
    x: Number(score.score),
    y: Number(score.handicap),
  }));
  console.log(JSON.stringify(rawData, 2, null));
  return {
    datasets: [
      {
        label: `${b} ${c}`,
        data: rawData,
        backgroundColor: "rgb(255, 99, 132)",
      },
    ],
  };
};
const config = {
  type: "scatter",
  data: null,
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
  console.log(select, data, baseItem);
  select.options.length = 0;
  select.options.add(new Option("Please choose...", ""));
  data.forEach((item) => {
    if (item === baseItem) {
      select.options.add(new Option(item, item, null, true));
    } else {
      select.options.add(new Option(item, item));
    }
  });
};
const uniq = (items) => [...new Set(items)];

(async () => {
  const select = document.getElementById("round");
  const bowSelect = document.getElementById("bow");
  const categorySelect = document.getElementById("category");
  let round = select.value;
  let roundData = await fetch(`./data/${round}`).then((res) => res.json());
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
    roundData = await fetch(`./data/${round}`).then((res) => res.json());
    uniqBows = uniq(roundData.map((item) => item.bow));
    uniqCategories = uniq(roundData.map((item) => item.category));
    populateSelect(bowSelect, uniqBows, currentBow);
    populateSelect(categorySelect, uniqCategories, currentCategory);
    config.data = processData(roundData, currentCategory, currentBow);
    chart.update();
  });
  let chart = new Chart(document.getElementById("chart"), config);
})();
