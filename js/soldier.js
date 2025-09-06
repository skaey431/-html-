// soldier.js
const SOLDIER_KEY = "soldierData";
let allSoldiers = [];

/* 모달 열기 */
function openSoldierModal() {
  document.getElementById("soldierModal").style.display = "flex";
  allSoldiers = JSON.parse(localStorage.getItem(SOLDIER_KEY) || "[]");
  renderSoldiers();
  updateSoldierSelects();
}

/* 모달 닫기 */
function closeSoldierModal() {
  document.getElementById("soldierModal").style.display = "none";
}

/* Soldier select 갱신 */
function updateSoldierSelects() {
  const companySelect = document.getElementById("soldierCompany");
  const roomSelect = document.getElementById("soldierRoom");
  if (!companySelect || !roomSelect) return;

  companySelect.innerHTML = "<option value=''>중대 선택</option>";
  roomSelect.innerHTML = "<option value=''>생활관 선택</option>";
  roomSelect.disabled = true;

  const maintenanceData = JSON.parse(localStorage.getItem("maintenanceData") || '[]');
  maintenanceData.forEach(comp => {
    const opt = document.createElement("option");
    opt.value = comp.company;
    opt.textContent = comp.company;
    companySelect.appendChild(opt);
  });
}

/* 중대 선택 시 생활관 활성화 */
function onCompanyChange() {
  const companySelect = document.getElementById("soldierCompany");
  const roomSelect = document.getElementById("soldierRoom");
  const selectedCompany = companySelect.value;

  roomSelect.innerHTML = "<option value=''>생활관 선택</option>";
  roomSelect.disabled = true;

  if (!selectedCompany) return;

  const maintenanceData = JSON.parse(localStorage.getItem("maintenanceData") || '[]');
  const comp = maintenanceData.find(c => c.company === selectedCompany);
  if (comp) {
    comp.rooms.forEach(room => {
      const opt = document.createElement("option");
      opt.value = room;
      opt.textContent = room;
      roomSelect.appendChild(opt);
    });
    roomSelect.disabled = false;
  }
}

/* Soldier 테이블 렌더링 */
function renderSoldiers() {
  const tbody = document.querySelector("#soldierTable tbody");
  tbody.innerHTML = "";

  const maintenanceData = JSON.parse(localStorage.getItem("maintenanceData") || '[]');

  allSoldiers.forEach((s, idx) => {
    const tr = document.createElement("tr");

    // 삭제 체크박스
    const tdDel = document.createElement("td");
    const delCheckbox = document.createElement("input");
    delCheckbox.type = "checkbox";
    delCheckbox.className = "deleteCheckbox";
    tdDel.appendChild(delCheckbox);
    tr.appendChild(tdDel);

    // 이름
    const tdName = document.createElement("td");
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = s.name;
    nameInput.oninput = () => updateCCTVNameDisplay(nameInput);
    tdName.appendChild(nameInput);
    tr.appendChild(tdName);

    // 중대 select
    const tdUnit = document.createElement("td");
    const unitSelect = document.createElement("select");
    unitSelect.innerHTML = "<option value=''>중대 선택</option>";
    maintenanceData.forEach(comp => {
      const opt = document.createElement("option");
      opt.value = comp.company;
      opt.textContent = comp.company;
      if (comp.company === s.unit) opt.selected = true;
      unitSelect.appendChild(opt);
    });
    tdUnit.appendChild(unitSelect);
    tr.appendChild(tdUnit);

    // 생활관 select
    const tdBarracks = document.createElement("td");
    const barracksSelect = document.createElement("select");
    barracksSelect.innerHTML = "<option value=''>생활관 선택</option>";
    const rooms = maintenanceData.find(c => c.company === s.unit)?.rooms || [];
    rooms.forEach(r => {
      const opt = document.createElement("option");
      opt.value = r;
      opt.textContent = r;
      if (r === s.barracks) opt.selected = true;
      barracksSelect.appendChild(opt);
    });
    tdBarracks.appendChild(barracksSelect);
    tr.appendChild(tdBarracks);

    // 입대일
    const tdEnlist = document.createElement("td");
    const enlistInput = document.createElement("input");
    enlistInput.type = "month";
    enlistInput.value = s.enlistDate || "";
    tdEnlist.appendChild(enlistInput);
    tr.appendChild(tdEnlist);

    tbody.appendChild(tr);
  });
}

/* 행 추가 */
function addSoldierRow() {
  allSoldiers.push({ name: "", unit: "", barracks: "", enlistDate: "" });
  renderSoldiers();
}

/* 체크된 행 삭제 */
function deleteCheckedSoldiers() {
  if (!confirm("선택된 행을 삭제하시겠습니까?")) return;
  const tbody = document.querySelector("#soldierTable tbody");
  const rows = Array.from(tbody.querySelectorAll("tr"));
  rows.forEach((row, idx) => {
    const cb = row.querySelector(".deleteCheckbox");
    if (cb && cb.checked) {
      allSoldiers.splice(idx, 1);
    }
  });
  renderSoldiers();
}

/* 저장 */
function saveSoldiers() {
  const rows = document.querySelectorAll("#soldierTable tbody tr");
  allSoldiers = [];
  rows.forEach(row => {
    const inputs = row.querySelectorAll("input[type=text], input[type=month], select");
    allSoldiers.push({
      name: inputs[0].value.trim(),
      unit: inputs[1].value,        // select
      barracks: inputs[2].value,    // select
      enlistDate: inputs[3].value
    });
  });
  localStorage.setItem(SOLDIER_KEY, JSON.stringify(allSoldiers));
  closeSoldierModal();
  renderCCTV();
}

/* 이름 검색 */
function filterSoldiers() {
  const query = document.getElementById("soldierSearch").value.trim();
  const saved = JSON.parse(localStorage.getItem(SOLDIER_KEY) || "[]");
  allSoldiers = saved.filter(s => s.name.includes(query));
  renderSoldiers();
}

/* CCTV 연동 */
function updateCCTVNameDisplay(input) {
  const name = input.value.trim();
  const soldiers = JSON.parse(localStorage.getItem(SOLDIER_KEY) || "[]");
  const found = soldiers.find(s => s.name === name);
  const parent = input.parentElement.parentElement;
  if (!parent) return;

  const tdUnit = parent.querySelector("td:nth-child(3) select");
  const tdBarracks = parent.querySelector("td:nth-child(4) select");
  if (found) {
    tdUnit.value = found.unit;
    tdBarracks.value = found.barracks;
  }
}

/* 페이지 로드 시 데이터 */
document.addEventListener("DOMContentLoaded", () => {
  allSoldiers = JSON.parse(localStorage.getItem(SOLDIER_KEY) || "[]");
});
