const SOLDIER_KEY = "soldierData";
const LEAVE_KEY = "leaveData";

// 공통 모달
function openModal(id) {
  document.getElementById(id).style.display = "flex";
  if(id === "soldierModal") {
    allSoldiers = JSON.parse(localStorage.getItem(SOLDIER_KEY) || "[]");
    renderSoldiers();
  }
}

function closeModal(id) {
  document.getElementById(id).style.display = "none";
  renderBarracksSummary();
}

// 생활관 요약
function renderBarracksSummary() {
  const tbody = document.querySelector("#barracksSummary tbody");
  tbody.innerHTML = "";

  const soldiers = JSON.parse(localStorage.getItem(SOLDIER_KEY) || "[]");
  const leaves = JSON.parse(localStorage.getItem(LEAVE_KEY) || "[]");

  const summary = {};

  // 근무자 집계
  soldiers.forEach(s => {
    if (!s.barracks) return;
    if (!summary[s.barracks]) summary[s.barracks] = { active: 0, leave: 0 };
    summary[s.barracks].active += 1;
  });

  // 휴가자 집계
  leaves.forEach(l => {
    if (!l.barracks) return;
    if (!summary[l.barracks]) summary[l.barracks] = { active: 0, leave: 0 };
    summary[l.barracks].leave += 1;
  });

  Object.keys(summary).forEach(b => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${b}</td><td>${summary[b].active}</td><td>${summary[b].leave}</td>`;
    tbody.appendChild(tr);
  });
}

// 모든 요약 업데이트
function renderAllSummaries() {
  renderBarracksSummary();
  renderLeaveSummary();
}

// 페이지 로드 시
window.addEventListener("DOMContentLoaded", renderBarracksSummary);
