/* 
Analysis 3:

Mortality Count of Cancer of Colon Across all Race Groups

VISUAL CHART TYPE - DOUGHNUT CHART

Query Parameters:

$where=UPPER(ccs_diagnosis_description)like '%25CANCER OF COLON%25'
limit: 1000
discharge_year=2016
patient_disposition=Expired
$order = race

url:
https://health.data.ny.gov/resource/gnzp-ekau.json?$where=UPPER(ccs_diagnosis_description)like%20%27%25CANCER%20OF%20COLON%25%27&$limit=1000&discharge_year=2016&patient_disposition=Expired&$order=race&$$app_token=rLzurqxb20r44o3brEQHib86b

*/

const labelsColon = [];

const colonCanvas = document
  .getElementById('doughnut-chart-colon')
  .getContext('2d');

const dataColonChart = {
  labels: labelsColon,
  datasets: [
    {
      label: 'Colon Mortality Count Across Different Races',
      data: [],
      backgroundColor: ['#264653', '#2a9d8f', '#e9c46a', '#e76f51'],
      hoverOffset: 4,
    },
  ],
};

const configColon = {
  type: 'doughnut',
  data: dataColonChart,
  options: {
    responsive: true,
    layout: {
      padding: {
        top: 15,
        right: 20,
        bottom: 15,
        left: 20,
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Mortality Count of Cancer of Colon Across all Race Groups',
        font: {
          size: 18,
          lineHeight: 1.1,
        },
      },
    },
  },
};

(async function cancerColonData() {
  try {
    let response = await fetch(
      `https://health.data.ny.gov/resource/gnzp-ekau.json?$where=UPPER(ccs_diagnosis_description)like%20%27%25CANCER%20OF%20COLON%25%27&$limit=1000&discharge_year=2016&patient_disposition=Expired&$order=race&$$app_token=rLzurqxb20r44o3brEQHib86b`
    );
    let dataParsed = await response.json();

    /* 
    Separate array by different race types
    Store race values into empty array above
    Using Race value string match and filter entire array count the occurrences Mortality 
    Push number value of Colon Cancer Mortality to datasets data array
    */
    let distinctRaceGroup = [...new Set(dataParsed.map((item) => item.race))];

    for (let i = 0; i < distinctRaceGroup.length; i++) {
      labelsColon.push(distinctRaceGroup[i]);
    }

    for (let i = 0; i < distinctRaceGroup.length; i++) {
      dataColonChart.datasets[0].data.push(
        dataParsed.filter((item) => {
          return item.race === distinctRaceGroup[i];
        }).length
      );
    }
    new Chart(colonCanvas, configColon);
  } catch (err) {
    console.log(err);
  }
})();
