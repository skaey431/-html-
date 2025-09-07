/* 모달 열기 */
function openSoldierModal() {
  document.getElementById("soldierModal").style.display = "flex";
  allSoldiers = JSON.parse(localStorage.getItem(SOLDIER_KEY) || "[]");
  renderSoldiers();
}

/* 모달 닫기 */
function closeSoldierModal() {
  document.getElementById("soldierModal").style.display = "none";
}

/* Soldier 테이블 렌더링 */
function renderSoldiers() {
  const tbody = document.querySelector("#soldierTable tbody");
  tbody.innerHTML = "";

  const maintenanceData = JSON.parse(localStorage.getItem("maintenanceData") || "[]");

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

    // 생활관 select 미리 만들어둠 (중대 onchange 안에서 접근해야 하므로)
    const tdBarracks = document.createElement("td");
    const barracksSelect = document.createElement("select");
    barracksSelect.innerHTML = "<option value=''>생활관 선택</option>";
    tdBarracks.appendChild(barracksSelect);

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

    // 중대 선택 시 그 행의 생활관 select 갱신
    unitSelect.onchange = () => {
      const selectedCompany = unitSelect.value;
      barracksSelect.innerHTML = "<option value=''>생활관 선택</option>";
      if (!selectedCompany) return;
      const comp = maintenanceData.find(c => c.company === selectedCompany);
      if (comp) {
        comp.rooms.forEach(r => {
          const opt = document.createElement("option");
          opt.value = r;
          opt.textContent = r;
          barracksSelect.appendChild(opt);
        });
      }
    };

    tdUnit.appendChild(unitSelect);
    tr.appendChild(tdUnit);

    // 기존 데이터 반영 (행 로드 시)
    const rooms = maintenanceData.find(c => c.company === s.unit)?.rooms || [];
    rooms.forEach(r => {
      const opt = document.createElement("option");
      opt.value = r;
      opt.textContent = r;
      if (r === s.barracks) opt.selected = true;
      barracksSelect.appendChild(opt);
    });
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
      name: inputs[0].value.trim(),   // 이름
      unit: inputs[1].value,          // 중대 select
      barracks: inputs[2].value,      // 생활관 select
      enlistDate: inputs[3].value     // 입대일
    });
  });
  localStorage.setItem(SOLDIER_KEY, JSON.stringify(allSoldiers));
  closeSoldierModal();
  renderCCTV(); // CCTV 현황 업데이트
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
