/* 
ANALYSIS 2: 
Mortality Frequency of Cancer of Bronchus across White Americans by Age Group and Gender

VISUAL CHART TYPE - BAR CHART

Query Parameters: 
race=White
$where=UPPER(ccs_diagnosis_description)like '%25CANCER_OF_BRONCHUS%25'
patient_disposition=Expired
orderBy=age_group
limit 1000

*/

const labelsBronchus = [];

const bronchusCanvas = document
  .getElementById('bar-chart-bronchus')
  .getContext('2d');

const dataBronchusChart = {
  labels: labelsBronchus,
  datasets: [
    {
      label: 'Male',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 2,
      data: [],
    },
    {
      label: 'Female',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 2,
      data: [],
    },
  ],
};

const configBronchus = {
  type: 'bar',
  data: dataBronchusChart,
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
        text:
          'Mortality Frequency of Cancer of Bronchus across White Americans by Age Group and Gender',
        font: {
          size: 18,
          lineHeight: 1.1,
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Age Group',
          font: {
            size: 15,
            weight: 'bold',
          },
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Occurrences',
          font: {
            style: 'normal',
            size: 15,
            weight: 'bold',
          },
        },
      },
    },
  },
};

/* 
Create cancerBronchusData an Immediately Invoked Function Expression  (IIFE)
*/
(async function cancerBronchusData() {
  try {
    /* Fetch data and parse JSON */
    let response = await fetch(
      `https://health.data.ny.gov/resource/gnzp-ekau.json?$where=UPPER(ccs_diagnosis_description)like%20%27%25CANCER_OF_BRONCHUS%25%27&discharge_year=2016&patient_disposition=Expired&race=White&$order=age_group&$limit=1000&$$app_token=rLzurqxb20r44o3brEQHib86b`
    );
    let dataParsed = await response.json();
    console.log(dataParsed);

    /* 
    Create a new array based on different age groups from  dataset
    Array of Age Groups --> 
    [ "18 to 29", "30 to 49", "50 to 69", "70 or Older" ]
    */
    let distinctAgeGroup = await [
      ...new Set(dataParsed.map((item) => item.age_group)),
    ];

    /* Populate items from distinctAgeGroup to labels array */
    for (let i = 0; i < distinctAgeGroup.length; i++) {
      await labelsBronchus.push(distinctAgeGroup[i]);
    }
    await cancerBronchusDataGender('M', distinctAgeGroup, 0);
    await cancerBronchusDataGender('F', distinctAgeGroup, 1);
    /* 
    Target element in HTML with id
    Create Chart with inputs
     */
    await new Chart(bronchusCanvas, configBronchus);
  } catch (err) {
    console.log(err);
  }
})();

async function cancerBronchusDataGender(gender, distinctAgeGroup, dataSetNum) {
  try {
    let response = await fetch(
      `https://health.data.ny.gov/resource/gnzp-ekau.json?$where=UPPER(ccs_diagnosis_description)like%20%27%25CANCER_OF_BRONCHUS%25%27&discharge_year=2016&patient_disposition=Expired&race=White&$order=age_group&$limit=1000&gender=${gender}&$$app_token=rLzurqxb20r44o3brEQHib86b`
    );
    let dataParsedGender = await response.json();
    /* 
    Run for loop using distinct age group's length Create a new array using filter method based on distinct age group 
    Push different array length to corresponding dataset 
    (Example: 
      dataBronchusChart.data[0] = Male
      dataBronchusChart.data[1] = Female)
    */

    for (let i = 0; i < distinctAgeGroup.length; i++) {
      await dataBronchusChart.datasets[dataSetNum].data.push(
        dataParsedGender.filter(
          (item) => item.age_group === distinctAgeGroup[i]
        ).length
      );
    }
  } catch (err) {
    console.log(err);
  }
}
