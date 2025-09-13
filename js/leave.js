const LEAVE_KEY = "leaveData";
let allLeaves = [];

/* 모달 열기 */
function openLeaveModal() {
  document.getElementById("leaveModal").style.display = "flex";
  allLeaves = JSON.parse(localStorage.getItem(LEAVE_KEY) || "[]");
  renderLeaves();
}

/* 모달 닫기 */
function closeLeaveModal() {
  document.getElementById("leaveModal").style.display = "none";
}

/* 휴가 테이블 렌더링 */
function renderLeaves() {
  const tbody = document.querySelector("#leaveTable tbody");
  tbody.innerHTML = "";

  const maintenanceData = JSON.parse(localStorage.getItem("maintenanceData") || "[]");
  const soldiers = JSON.parse(localStorage.getItem("soldierData") || "[]");

  allLeaves.forEach((leave, idx) => {
    const tr = document.createElement("tr");

    // 이름 input
    const tdName = document.createElement("td");
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = leave.name || "";
    nameInput.oninput = () => {
      leave.name = nameInput.value;
      const sel = soldiers.find(s => s.name === nameInput.value);
      if (sel) {
        leave.unit = sel.unit;
        leave.barracks = sel.barracks;
        renderLeaves(); // 자동 갱신
      }
    };
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
      if (comp.company === leave.unit) opt.selected = true;
      unitSelect.appendChild(opt);
    });
    unitSelect.onchange = () => {
      leave.unit = unitSelect.value;
      leave.barracks = "";
      renderLeaves();
    };
    tdUnit.appendChild(unitSelect);
    tr.appendChild(tdUnit);

    // 생활관 select
    const tdBarracks = document.createElement("td");
    const barracksSelect = document.createElement("select");
    barracksSelect.innerHTML = "<option value=''>생활관 선택</option>";
    if (leave.unit) {
      const comp = maintenanceData.find(c => c.company === leave.unit);
      if (comp) {
        comp.rooms.forEach(r => {
          const opt = document.createElement("option");
          opt.value = r;
          opt.textContent = r;
          if (r === leave.barracks) opt.selected = true;
          barracksSelect.appendChild(opt);
        });
      }
    }
    barracksSelect.onchange = () => {
      leave.barracks = barracksSelect.value;
    };
    tdBarracks.appendChild(barracksSelect);
    tr.appendChild(tdBarracks);

    // 휴가 시작
    const tdStart = document.createElement("td");
    const startInput = document.createElement("input");
    startInput.type = "date";
    startInput.value = leave.startDate || "";
    startInput.oninput = () => leave.startDate = startInput.value;
    tdStart.appendChild(startInput);
    tr.appendChild(tdStart);

    // 휴가 종료
    const tdEnd = document.createElement("td");
    const endInput = document.createElement("input");
    endInput.type = "date";
    endInput.value = leave.endDate || "";
    endInput.oninput = () => leave.endDate = endInput.value;
    tdEnd.appendChild(endInput);
    tr.appendChild(tdEnd);

    // 삭제 체크박스
    const tdDel = document.createElement("td");
    const delCheckbox = document.createElement("input");
    delCheckbox.type = "checkbox";
    delCheckbox.className = "deleteLeaveCheckbox";
    tdDel.appendChild(delCheckbox);
    tr.appendChild(tdDel);

    tbody.appendChild(tr);
  });

  renderLeaveSummary();
}

/* 행 추가 */
function addLeaveRow() {
  allLeaves.push({ name: "", unit: "", barracks: "", startDate: "", endDate: "" });
  renderLeaves();
}

/* 체크된 행 삭제 */
function deleteLeaveRows() {
  if (!confirm("선택된 행을 삭제하시겠습니까?")) return;
  allLeaves = allLeaves.filter((_, idx) => {
    const tbody = document.querySelector("#leaveTable tbody");
    const row = tbody.children[idx];
    const cb = row.querySelector(".deleteLeaveCheckbox");
    return !(cb && cb.checked);
  });
  renderLeaves();
}

/* 저장 */
function saveLeave() {
  localStorage.setItem(LEAVE_KEY, JSON.stringify(allLeaves));
  closeLeaveModal();
  renderLeaveSummary();
}

/* 휴가 요약 테이블 렌더링 */
function renderLeaveSummary() {
  const tbody = document.querySelector("#leaveSummary tbody");
  tbody.innerHTML = "";

  allLeaves.forEach(l => {
    if (!l.name) return;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${l.name}</td>
      <td>${l.unit}</td>
      <td>${l.barracks}</td>
      <td>${l.startDate}</td>
      <td>${l.endDate}</td>
    `;
    tbody.appendChild(tr);
  });
}

/* 페이지 로드 시 */
document.addEventListener("DOMContentLoaded", () => {
  allLeaves = JSON.parse(localStorage.getItem(LEAVE_KEY) || "[]");
  renderLeaveSummary();

  document.getElementById("btnAddLeave").addEventListener("click", addLeaveRow);
  document.getElementById("btnDeleteLeave").addEventListener("click", deleteLeaveRows);
  document.getElementById("btnSaveLeave").addEventListener("click", saveLeave);
});
