const MAINTENANCE_KEY = "maintenanceData";
const ARMORY_KEY = "armoryData";
let maintenanceData = JSON.parse(localStorage.getItem(MAINTENANCE_KEY) || '[]');

function openMaintenanceModal() {
  // 모달 열 때 모든 중대 닫기
  maintenanceData.forEach(comp => comp.collapsed = true);
  openModal('maintenanceModal');
  renderMaintenance();
}

function renderMaintenance() {
  const tbody = document.querySelector("#maintenanceTable tbody");
  tbody.innerHTML = '';

  // 초기값
  if (maintenanceData.length === 0) {
    maintenanceData.push({
      company: '본부중대',
      rooms: ['정비1','정비2','취사','본부생활관'],
      specialRooms: ['행정반','지휘통제실','대대무기고'],
      roomsArmory: [],
      specialArmory: [],
      collapsed: true
    });
    maintenanceData.push({
      company: '심정중대',
      rooms: ['심정1','심정2','생활관'],
      specialRooms: ['행정반','지휘통제실','대대무기고'],
      roomsArmory: [],
      specialArmory: [],
      collapsed: true
    });
  }

  maintenanceData.forEach((comp, compIdx) => {
    // 중대 행
    const trCompany = document.createElement('tr');
    const th = document.createElement('th');
    th.colSpan = 3;

    // 접기/펼치기 버튼
    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = comp.collapsed ? "▶" : "▼";
    toggleBtn.onclick = () => toggleRooms(comp.company);
    th.appendChild(toggleBtn);

    // 중대 이름 입력
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = comp.company;
    nameInput.oninput = () => updateCompanyName(compIdx, nameInput);
    th.appendChild(nameInput);

    // 삭제 버튼
    const delBtn = document.createElement("button");
    delBtn.textContent = "중대 삭제";
    delBtn.onclick = () => deleteCompany(compIdx);
    th.appendChild(delBtn);

    trCompany.appendChild(th);
    tbody.appendChild(trCompany);

    // 생활관 행
    comp.rooms.forEach((room, roomIdx) => {
      const trRoom = document.createElement('tr');
      trRoom.dataset.company = comp.company;
      trRoom.style.display = comp.collapsed ? 'none' : '';
      trRoom.innerHTML = `
        <td><input type="text" value="${room}" 
             oninput="updateRoomName(${compIdx}, ${roomIdx}, this)"></td>
        <td><button onclick="deleteRoom(${compIdx}, ${roomIdx})">삭제</button></td>
      `;
      tbody.appendChild(trRoom);
    });

    // 생활관 추가 버튼    // 총기함 관리 버튼
    const trAdd = document.createElement('tr');
    trAdd.dataset.company = comp.company;
    trAdd.style.display = comp.collapsed ? 'none' : '';
    const trArmory = document.createElement('tr');
    trArmory.dataset.company = comp.company;
    trArmory.style.display = comp.collapsed ? 'none' : '';
    trArmory.innerHTML = `<td colspan="3"><button onclick="addRoom(${compIdx})">생활관 추가</button><button onclick="openArmoryModal(${compIdx})">총기함 관리</button></td>`;
    tbody.appendChild(trArmory);
  });
}

// 접힘/펼침
function toggleRooms(company) {
  const comp = maintenanceData.find(c => c.company === company);
  if (!comp) return;
  comp.collapsed = !comp.collapsed;
  renderMaintenance();
}

// CRUD
function updateCompanyName(idx, input) {
  maintenanceData[idx].company = input.value.trim();
}

function updateRoomName(compIdx, roomIdx, input) {
  maintenanceData[compIdx].rooms[roomIdx] = input.value.trim();
}

function addCompany() {
  maintenanceData.push({
    company: '새 중대',
    rooms: ['새 생활관'],
    specialRooms: ['행정반','지휘통제실','대대무기고'],
    roomsArmory: [],
    specialArmory: [],
    collapsed: true
  });
  renderMaintenance();
}

function deleteCompany(idx) {
  if (confirm('중대 삭제하시겠습니까?')) {
    maintenanceData.splice(idx, 1);
    renderMaintenance();
  }
}

function addRoom(compIdx) {
  const comp = maintenanceData[compIdx];
  comp.rooms.push('새 생활관');
  comp.collapsed = false; // 추가된 중대만 열림
  renderMaintenance();
}

function deleteRoom(compIdx, roomIdx) {
  if (confirm('생활관 삭제하시겠습니까?')) {
    maintenanceData[compIdx].rooms.splice(roomIdx, 1);
    if (maintenanceData[compIdx].rooms.length === 0) maintenanceData.splice(compIdx, 1);
    renderMaintenance();
  }
}

// ===== 총기함 관리 모달 =====
function openArmoryModal(companyIdx) {
  const modal = document.getElementById('armoryModal');
  modal.style.display = "flex";
  renderArmory(companyIdx);
  modal.dataset.companyIdx = companyIdx;
}

function renderArmory(companyIdx) {
  const comp = maintenanceData[companyIdx];

  // 생활관 총기함 테이블
  const tbodyRooms = document.querySelector("#armoryRoomsTable tbody");
  tbodyRooms.innerHTML = "";
  comp.rooms.forEach((room, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${room}</td>
      <td><input type="checkbox" ${comp.roomsArmory?.[idx] ? "checked" : ""} 
          onchange="toggleArmory(${companyIdx}, 'rooms', ${idx}, this)"></td>
    `;
    tbodyRooms.appendChild(tr);
  });

  // 생활관 외 총기함 테이블
  const tbodySpecial = document.querySelector("#armorySpecialTable tbody");
  tbodySpecial.innerHTML = "";
  comp.specialRooms.forEach((room, idx) => {
    const tr = document.createElement("tr");

    const nameTd = document.createElement("td");
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = room;
    nameInput.oninput = () => comp.specialRooms[idx] = nameInput.value.trim();
    nameTd.appendChild(nameInput);

    const chkTd = document.createElement("td");
    const chkInput = document.createElement("input");
    chkInput.type = "checkbox";
    chkInput.checked = comp.specialArmory?.[idx] || false;
    chkInput.onchange = () => comp.specialArmory[idx] = chkInput.checked;
    chkTd.appendChild(chkInput);

    const delTd = document.createElement("td");
    const delBtn = document.createElement("button");
    delBtn.textContent = "삭제";
    delBtn.onclick = () => { comp.specialRooms.splice(idx,1); comp.specialArmory.splice(idx,1); renderArmory(companyIdx); };
    delTd.appendChild(delBtn);

    tr.appendChild(nameTd);
    tr.appendChild(chkTd);
    tr.appendChild(delTd);

    tbodySpecial.appendChild(tr);
  });

  // 추가 버튼
  const trAdd = document.createElement("tr");
  const tdAdd = document.createElement("td");
  tdAdd.colSpan = 3;
  const addBtn = document.createElement("button");
  addBtn.textContent = "총기함 추가";
  addBtn.onclick = () => {
    comp.specialRooms.push("새 총기함");
    comp.specialArmory.push(false);
    renderArmory(companyIdx);
  };
  tdAdd.appendChild(addBtn);
  trAdd.appendChild(tdAdd);
  tbodySpecial.appendChild(trAdd);
}



function toggleArmory(companyIdx, type, idx, checkbox) {
  const comp = maintenanceData[companyIdx];
  if (!comp[type + 'Armory']) comp[type + 'Armory'] = [];
  comp[type + 'Armory'][idx] = checkbox.checked;
}

function saveArmory() {
  const modal = document.getElementById('armoryModal');
  const companyIdx = modal.dataset.companyIdx;
  // armory 상태는 이미 maintenanceData에 반영됨
  localStorage.setItem(ARMORY_KEY, JSON.stringify(maintenanceData));
  modal.style.display = "none";
}

// 저장
function saveMaintenance() {
  const dataToSave = maintenanceData.map(c => ({
    company: c.company,
    rooms: c.rooms,
    specialRooms: c.specialRooms,
    roomsArmory: c.roomsArmory || [],
    specialArmory: c.specialArmory || []
  }));
  localStorage.setItem(MAINTENANCE_KEY, JSON.stringify(dataToSave));
  closeModal('maintenanceModal');
}

// 페이지 로드 시 렌더링
document.addEventListener("DOMContentLoaded", () => { renderMaintenance(); });
