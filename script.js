const tableBody = document.getElementById("tableBody");
const summaryDiv = document.getElementById("summary");
let up = 0,
  down = 0,
  flat = 0;
let gapUp = 0,
  gapDown = 0,
  gapFlat = 0;

fetch(
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRoHEhvPDoJXVQnlNst63T0ETFWRJnAHzDTvWCocsa-rl52JYrXx6_KMDq7T0_7yz4_donHylNL_u2r/pub?output=csv"
)
  .then((response) => response.text())
  .then((csv) => {
    const rows = csv.trim().split("\n").slice(1);
    rows.forEach((row) => {
      const cols = row.split(",");
      const name = cols[0];
      const live = parseFloat(cols[2]);
      const prevClose = parseFloat(cols[3]);
      const change = parseFloat(cols[4]);
      const open = parseFloat(cols[5]);
      const volume = parseInt(cols[6]);
      const range = parseFloat(cols[8]);

      const pct = +((change / prevClose) * 100).toFixed(2);

      let status = "flat";
      if (change > 1) {
        status = "up";
        up++;
      } else if (change < -1) {
        status = "down";
        down++;
      } else {
        flat++;
      }

      let gap = +(open - prevClose).toFixed(2);
      let gapText = "FLAT";
      let gapClass = "yellow";
      if (gap > 1) {
        gapText = "GAP UP";
        gapClass = "green";
        gapUp++;
      } else if (gap < -1) {
        gapText = "GAP DOWN";
        gapClass = "red";
        gapDown++;
      } else {
        gapFlat++;
      }

      const liveClass = live > open ? "green" : "red";
      const openClass = open > prevClose ? "green" : "red";
      const changeClass = change > 1 ? "green" : change < -1 ? "red" : "yellow";
      const pctClass = pct > 1 ? "green" : pct < -1 ? "red" : "yellow";

      const row = `<tr>
        <td>${name}</td>
        <td class="${liveClass}">${live}</td>
        <td>${prevClose}</td>
        <td class="${changeClass}">${change}</td>
        <td class="${pctClass}">${pct}%</td>
        <td class="${status}">${status.toUpperCase()}</td>
        <td class="${openClass}">${open}</td>
        <td>${volume.toLocaleString()}</td>
        <td class="${gapClass}">${gapText}</td>
        <td>${range}</td>
        <td><div class="bar"><div class="bar-fill" style="width:${Math.min(
          Math.abs(pct),
          100
        )}%; background:${
        status === "up" ? "green" : status === "down" ? "red" : "orange"
      }"></div></div></td>
      </tr>`;
      tableBody.innerHTML += row;
    });

    const total = up + down + flat;
    summaryDiv.innerHTML = `
      <div><b>Total</b><br>${total}</div>
      <div><b>Up</b><br>${up} (${((up / total) * 100).toFixed(1)}%)</div>
      <div><b>Down</b><br>${down} (${((down / total) * 100).toFixed(1)}%)</div>
      <div><b>Flat</b><br>${flat} (${((flat / total) * 100).toFixed(1)}%)</div>
      <div><b>GAP UP</b><br>${gapUp}</div>
      <div><b>GAP DOWN</b><br>${gapDown}</div>
      <div><b>GAP FLAT</b><br>${gapFlat}</div>
      <div><b>Date</b><br>${new Date().toLocaleDateString()}</div>`;
  });