// 유지보수 모달 관련 (중대/생활관 관리는 co.js로 분리)

// Soldier 탭 관련
const SOLDIER_KEY = "soldierData";
let soldierData = JSON.parse(localStorage.getItem(SOLDIER_KEY) || '[]');

function renderMaintenanceSoldiers() {
  const tbody = document.querySelector("#maintenanceSoldierTable tbody");
  tbody.innerHTML = '';

  soldierData.forEach((s, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="checkbox" data-idx="${idx}"></td>
      <td><input type="text" value="${s.name}" oninput="updateSoldier(${idx}, 'name', this)"></td>
      <td><input type="text" value="${s.company}" oninput="updateSoldier(${idx}, 'company', this)"></td>
      <td><input type="text" value="${s.room}" oninput="updateSoldier(${idx}, 'room', this)"></td>
      <td><input type="date" value="${s.enlistDate}"></td>
    `;
    tbody.appendChild(tr);
  });
}

function addSoldierRow() {
  soldierData.push({ name:'', company:'', room:'', enlistDate:'' });
  renderMaintenanceSoldiers();
}

function deleteCheckedSoldiers() {
  const checkboxes = document.querySelectorAll("#maintenanceSoldierTable tbody input[type=checkbox]:checked");
  const idxs = Array.from(checkboxes).map(cb => parseInt(cb.dataset.idx));
  soldierData = soldierData.filter((_, i) => !idxs.includes(i));
  renderMaintenanceSoldiers();
}

function updateSoldier(idx, field, input) {
  soldierData[idx][field] = input.value.trim();
}

function saveSoldiers() {
  localStorage.setItem(SOLDIER_KEY, JSON.stringify(soldierData));
  if(typeof updateSoldierSelects === 'function') updateSoldierSelects();
}

// Exemption 탭 관련
const EXEMPTION_KEY = "exemptionData";
let exemptionData = JSON.parse(localStorage.getItem(EXEMPTION_KEY) || '[]');

function renderExemptions() {
  const tbody = document.querySelector("#exemptionTable tbody");
  tbody.innerHTML = '';

  exemptionData.forEach((ex, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="checkbox" data-idx="${idx}"></td>
      <td><input type="text" value="${ex.name}" oninput="updateExemption(${idx}, 'name', this)"></td>
      <td><input type="text" value="${ex.reason}" oninput="updateExemption(${idx}, 'reason', this)"></td>
    `;
    tbody.appendChild(tr);
  });
}

function addExemptionRow() {
  exemptionData.push({ name:'', reason:'' });
  renderExemptions();
}

function deleteExemptionRows() {
  const checkboxes = document.querySelectorAll("#exemptionTable tbody input[type=checkbox]:checked");
  const idxs = Array.from(checkboxes).map(cb => parseInt(cb.dataset.idx));
  exemptionData = exemptionData.filter((_, i) => !idxs.includes(i));
  renderExemptions();
}

function updateExemption(idx, field, input) {
  exemptionData[idx][field] = input.value.trim();
}

function saveExemptions() {
  localStorage.setItem(EXEMPTION_KEY, JSON.stringify(exemptionData));
}

document.addEventListener("DOMContentLoaded", () => {
  renderMaintenanceSoldiers();
  renderExemptions();
});
