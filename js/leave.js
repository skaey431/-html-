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

  const soldiers = JSON.parse(localStorage.getItem("soldierData") || "[]");

  allLeaves.forEach((leave, idx) => {
    const tr = document.createElement("tr");

    // 이름 select
    const tdName = document.createElement("td");
    const nameSelect = document.createElement("select");
    nameSelect.innerHTML = "<option value=''>이름 선택</option>";
    soldiers.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s.name;
      opt.textContent = s.name;
      if (s.name === leave.name) opt.selected = true;
      nameSelect.appendChild(opt);
    });
    nameSelect.onchange = () => {
      const sel = soldiers.find(s => s.name === nameSelect.value);
      if (sel) {
        tr.querySelector(".unitSelect").value = sel.unit;
        tr.querySelector(".barracksSelect").value = sel.barracks;
      }
    };
    tdName.appendChild(nameSelect);
    tr.appendChild(tdName);

    // 중대
    const tdUnit = document.createElement("td");
    const unitInput = document.createElement("input");
    unitInput.type = "text";
    unitInput.value = leave.unit || "";
    unitInput.className = "unitSelect";
    unitInput.readOnly = true;
    tdUnit.appendChild(unitInput);
    tr.appendChild(tdUnit);

    // 생활관
    const tdBarracks = document.createElement("td");
    const barracksInput = document.createElement("input");
    barracksInput.type = "text";
    barracksInput.value = leave.barracks || "";
    barracksInput.className = "barracksSelect";
    barracksInput.readOnly = true;
    tdBarracks.appendChild(barracksInput);
    tr.appendChild(tdBarracks);

    // 휴가 시작
    const tdStart = document.createElement("td");
    const startInput = document.createElement("input");
    startInput.type = "date";
    startInput.value = leave.startDate || "";
    tdStart.appendChild(startInput);
    tr.appendChild(tdStart);

    // 휴가 종료
    const tdEnd = document.createElement("td");
    const endInput = document.createElement("input");
    endInput.type = "date";
    endInput.value = leave.endDate || "";
    tdEnd.appendChild(endInput);
    tr.appendChild(tdEnd);

    // 삭제 버튼
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
  const tbody = document.querySelector("#leaveTable tbody");
  const rows = Array.from(tbody.querySelectorAll("tr"));
  rows.forEach((row, idx) => {
    const cb = row.querySelector(".deleteLeaveCheckbox");
    if (cb && cb.checked) {
      allLeaves.splice(idx, 1);
    }
  });
  renderLeaves();
}

/* 저장 */
function saveLeave() {
  const rows = document.querySelectorAll("#leaveTable tbody tr");
  allLeaves = [];
  rows.forEach(row => {
    const inputs = row.querySelectorAll("select, input[type=text], input[type=date]");
    allLeaves.push({
      name: inputs[0].value,
      unit: inputs[1].value,
      barracks: inputs[2].value,
      startDate: inputs[3].value,
      endDate: inputs[4].value
    });
  });
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
});
