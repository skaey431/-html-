const CCTV_KEY = "cctvData";
const SOLDIER_KEY = "soldierData";

// 공통 모달
function openModal(id) {
  document.getElementById(id).style.display = "flex";
  if(id === "cctvModal") initCCTVTable();
  if(id === "soldierModal") {
    allSoldiers = JSON.parse(localStorage.getItem(SOLDIER_KEY) || "[]");
    renderSoldiers();
    updateSoldierSelects();
  }
}

function closeModal(id) {
  document.getElementById(id).style.display = "none";
  renderCCTV();
}

// CCTV 렌더
function renderCCTV() {
  const data = JSON.parse(localStorage.getItem(CCTV_KEY) || "[]");
  const soldiers = JSON.parse(localStorage.getItem(SOLDIER_KEY) || "[]");
  const tbody = document.querySelector("#cctvSummary tbody");
  tbody.innerHTML = "";
  data.filter(d => d.active && d.name).forEach(d => {
    const soldier = soldiers.find(s => s.name === d.name);
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${d.name}</td>
                    <td>${soldier ? soldier.unit : ""}</td>
                    <td>${soldier ? soldier.barracks : ""}</td>`;
    tbody.appendChild(tr);
  });
}

window.onload = renderCCTV;
