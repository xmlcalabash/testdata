(function() {
  let host = `${window.location}`;
  let pos = host.indexOf("/");
  host = host.substring(0, pos);
  const pagesize = 15;
  let limit = pagesize;
  let cities = [];
  let data = {};

  let uk = {
    "wales": "Wales",
    "northern-ireland": "Northern Ireland",
    "scotland": "Scotland",
    "england": "England"
  }

  function load(country) {
    let uri = `${host}/cities/${country}.json`;
    return fetch(uri)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        for (city in json) {
          json[city]["country"] = uk[country];
        }
        return json;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function prettyPad(decnum) {
    const number = Number(decnum).toFixed(4)
    const spaces = "    "; // U+2007

    let result = number.replace(/0+$/, "")

    let pad = number.length - result.length;
    if (pad > 0) {
      result += spaces.substring(0, pad);
    }

    return result;
  }    

  function showRows() {
    let html = "<thead><tr><th>City</th><th>Country</th><th>Latitude</th><th>Longitude</th></tr></thead>";
    html += "<tbody>";

    let count = 1;
    for (city of cities) {
      html += `<tr><td>${city}</td>`;
      html += `<td>${data[city].country}</td>`;
      html += `<td>${prettyPad(data[city].lat)}</td>`;
      html += `<td>${prettyPad(data[city].lon)}</td></tr>`;
      count += 1;
      if (count > limit) {
        break;
      }
    }
    html += "</tbody>";
    let table = document.querySelector("table");
    table.innerHTML = html;
  }

  let loaded = []
  for (country in uk) {
    loaded.push(load(country))
  }

  Promise.all(loaded)
    .then(countries => {
      // Cheap and cheerful merge
      for (country of countries) {
        for (city in country) {
          cities.push(city)
          data[city] = country[city]
        }
      }
      cities.sort()

      showRows()

      document.querySelector("#more").addEventListener("click", event => {
        limit += pagesize;
        showRows();
      });
    });
})();
