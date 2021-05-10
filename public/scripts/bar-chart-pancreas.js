/*
ANALYSIS 1 
Frequency of Black/African American patients with Cancer of Pancreas by Age Group and Gender

VISUAL CHART TYPE - BAR CHART



Query Parameters:
gender (M/F) 
race (Black/African American)
order by age group
discharge year 2016
limit 1000 
*/

const labels = [];

const data = {
  labels: labels,
  datasets: [
    {
      label: 'Male',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgb(75, 192, 192)',
      borderWidth: 2,
      data: [],
    },
    {
      label: 'Female',
      backgroundColor: 'rgba(153, 102, 255, 0.2)',
      borderColor: 'rgb(153, 102, 255)',
      borderWidth: 2,
      data: [],
    },
  ],
};

const config = {
  type: 'bar',
  data,
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
          'Frequency of Black / African American Patients with Cancer of Pancreas',
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

(async function cancerPancreasData() {
  try {
    /* Fetch data and parse JSON */

    let response = await fetch(
      `https://health.data.ny.gov/resource/gnzp-ekau.json?$where=UPPER(ccs_diagnosis_description)like%20%27%25CANCER%20OF%20PANCREAS%25%27&race=Black/African%20American&$order=age_group%20ASC&$limit=1000&discharge_year=2016&$$app_token=rLzurqxb20r44o3brEQHib86b`
    );
    let dataParsed = await response.json();

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
      await labels.push(distinctAgeGroup[i]);
    }

    /* 
    Separate function calls cancerPancreasDataGender  
    with three arguments
    arg1 = string to be inserted into endpoint's gender parameter
    arg2 = An array with all the age groups
    arg3 = Number based on datasets array from global data variable
    */
    await cancerPancreasDataGender('M', distinctAgeGroup, 0);
    await cancerPancreasDataGender('F', distinctAgeGroup, 1);
    /* 
    Target element in HTML with id
    Create Chart with inputs
     */
    await new Chart(document.getElementById('bar-chart-pancreas'), config);
  } catch (err) {
    console.log(err);
  }
})();

async function cancerPancreasDataGender(gender, distinctAgeGroup, dataSetNum) {
  try {
    let response = await fetch(
      `https://health.data.ny.gov/resource/gnzp-ekau.json?$where=UPPER(ccs_diagnosis_description)like%20%27%25CANCER%20OF%20PANCREAS%25%27&race=Black/African%20American&$order=age_group%20ASC&$limit=1000&gender=${gender}&discharge_year=2016&$$app_token=rLzurqxb20r44o3brEQHib86b`
    );
    let dataParsedGender = await response.json();
    /* 
    Run for loop using distinct age group's length Create a new array using filter method based on distinct age group 
    Push different array length to corresponding dataset
    */

    for (let i = 0; i < distinctAgeGroup.length; i++) {
      await data.datasets[dataSetNum].data.push(
        dataParsedGender.filter(
          (item) => item.age_group === distinctAgeGroup[i]
        ).length
      );
    }
  } catch (err) {
    console.log(err);
  }
}
