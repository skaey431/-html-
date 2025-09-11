const CCTV_KEY = "cctvData";
const SOLDIER_KEY = "soldierData";

// 공통 모달
function openModal(id) {
  document.getElementById(id).style.display = "flex";
  if(id === "cctvModal") initCCTVTable();
  if(id === "soldierModal") {
    allSoldiers = JSON.parse(localStorage.getItem(SOLDIER_KEY) || "[]");
    renderSoldiers();
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

function renderBarracksSummary() {
  const tbody = document.querySelector("#barracksSummary tbody");
  tbody.innerHTML = "";

  const soldiers = JSON.parse(localStorage.getItem(SOLDIER_KEY) || "[]");
  const cctvData = JSON.parse(localStorage.getItem(CCTV_KEY) || "[]");
  const leaves = JSON.parse(localStorage.getItem(LEAVE_KEY) || "[]");

  // 생활관별 집계
  const summary = {};

  // CCTV 근무자 집계
  cctvData.forEach(d => {
    if (!d.active || !d.name) return;
    const s = soldiers.find(s => s.name === d.name);
    if (!s || !s.barracks) return;
    if (!summary[s.barracks]) summary[s.barracks] = { cctv: 0, leave: 0 };
    summary[s.barracks].cctv += 1;
  });

  // 휴가자 집계
  leaves.forEach(l => {
    if (!l.name || !l.barracks) return;
    if (!summary[l.barracks]) summary[l.barracks] = { cctv: 0, leave: 0 };
    summary[l.barracks].leave += 1;
  });

  // 테이블에 렌더링
  Object.keys(summary).forEach(barracks => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${barracks}</td><td>${summary[barracks].cctv}</td><td>${summary[barracks].leave}</td>`;
    tbody.appendChild(tr);
  });
}

// 페이지 로드, CCTV/휴가 저장 후 갱신
window.addEventListener("DOMContentLoaded", renderBarracksSummary);
function renderAllSummaries() {
  renderCCTV();
  renderLeaveSummary();
  renderBarracksSummary();
}

window.onload = renderCCTV;
