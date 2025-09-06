let allSoldiers = [];

function initCCTVTable() {
  const saved = JSON.parse(localStorage.getItem(CCTV_KEY) || "[]");
  const dayRow = document.getElementById("dayRow");
  const nightRow = document.getElementById("nightRow");
  dayRow.innerHTML = "<td>주간</td>";
  nightRow.innerHTML = "<td>야간</td>";
  for (let i = 0; i < 4; i++) dayRow.appendChild(createCCTVCell(saved[i]));
  for (let i = 4; i < 8; i++) nightRow.appendChild(createCCTVCell(saved[i]));
}

function createCCTVCell(data = { active: false, name: "" }) {
  const td = document.createElement("td");
  td.innerHTML = `
    <input type="checkbox" ${data.active ? 'checked' : ''} onchange="onCheckChange(this)">
    <br>
    <input type="text" value="${data.name}" placeholder="이름" ${data.active ? '' : 'disabled'} oninput="updateUnitAndBarracks(this)">
    <span class="unitDisplay"></span> <span class="barracksDisplay"></span>
  `;
  return td;
}

function onCheckChange(cb) {
  const input = cb.parentElement.querySelector("input[type=text]");
  input.disabled = !cb.checked;
  if (!cb.checked) {
    input.value = "";
    cb.parentElement.querySelector(".unitDisplay").innerText = "";
    cb.parentElement.querySelector(".barracksDisplay").innerText = "";
  }
}

function updateUnitAndBarracks(input) {
  const name = input.value.trim();
  const soldiers = JSON.parse(localStorage.getItem(SOLDIER_KEY) || "[]");
  const found = soldiers.find(s => s.name === name);
  input.parentElement.querySelector(".unitDisplay").innerText = found ? found.unit : "";
  input.parentElement.querySelector(".barracksDisplay").innerText = found ? found.barracks : "";
}

function saveCCTV() {
  const data = [];
  document.querySelectorAll("#cctvTable td").forEach(td => {
    const cb = td.querySelector("input[type=checkbox]");
    const input = td.querySelector("input[type=text]");
    if (cb) {
      data.push({ active: cb.checked, name: input.value.trim() });
    }
  });
  localStorage.setItem(CCTV_KEY, JSON.stringify(data));
  closeModal("cctvModal");
}
