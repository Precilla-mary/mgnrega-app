const API_URL =
  "https://api.data.gov.in/resource/656cdf9e-cd82-4778-b99b-79593dd4f456?api-key=579b464db66ec23bdd000001e7f1ad8f149f40634fb4eafeae308aba&format=json&limit=1000";

const districtSelect = document.getElementById("districtSelect");
const detailsDiv = document.getElementById("details");

async function fetchData() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    console.log("Data fetched:", data);
    console.log("Records:", data.records); // for checking the api fetch

    // Extract all districts (removing duplicates)
    const districts = [
      ...new Set(
        data.records.map(
          (record) => record["name_of_the_district___department"]
        )
      ),
    ];

    // Populate dropdown
    districts.forEach((district) => {
      const option = document.createElement("option");
      option.value = district;
      option.textContent = district;
      districtSelect.appendChild(option);
    });

    // When district selected → show details
    districtSelect.addEventListener("change", () => {
      const selectedDistrict = districtSelect.value;
      const districtData = data.records.filter(
        (record) =>
          record["name_of_the_district___department"] === selectedDistrict
      );

      if (districtData.length === 0) {
        detailsDiv.innerHTML = "<p>No data found for this district.</p>";
        return;
      }

      // Display results in a table
      let html = `
        <table border="1" cellpadding="8">
          <tr>
            <th>S.No</th>
            <th>Backward Block</th>
            <th>Project Name</th>
            <th>Type of Indicator</th>
            <th>Number of Projects</th>
            <th>Amount</th>
          </tr>
      `;

      districtData.forEach((record) => {
        html += `
          <tr>
            <td>${record["_s__no_"] || ""}</td>
            <td>${record["name_of_the_backward_blocks"] || ""}</td>
            <td>${record["name_of_the_project"] || ""}</td>
            <td>${record["type_of_indicator"] || ""}</td>
            <td>${record["number_of_projects_"] || ""}</td>
            <td>${record["amount"] || ""}</td>
          </tr>
        `;
      });

      html += "</table>";
      detailsDiv.innerHTML = html;
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchData();
