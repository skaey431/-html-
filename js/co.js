const MAINTENANCE_KEY = "maintenanceData";
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
    maintenanceData.push({ company: '본부중대', rooms: ['정비1','정비2','취사','본부생활관'], collapsed: true });
    maintenanceData.push({ company: '심정중대', rooms: ['심정1','심정2','생활관'], collapsed: true });
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

    // 생활관 추가 버튼
    const trAdd = document.createElement('tr');
    trAdd.dataset.company = comp.company;
    trAdd.style.display = comp.collapsed ? 'none' : '';
    trAdd.innerHTML = `<td colspan="3"><button onclick="addRoom(${compIdx})">생활관 추가</button></td>`;
    tbody.appendChild(trAdd);
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
  maintenanceData.push({ company: '새 중대', rooms: ['새 생활관'], collapsed: true });
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

// 저장 시 collapsed는 제외
function saveMaintenance() {
  const dataToSave = maintenanceData.map(c => ({ company: c.company, rooms: c.rooms }));
  localStorage.setItem(MAINTENANCE_KEY, JSON.stringify(dataToSave));
  if (typeof updateSoldierSelects === 'function') updateSoldierSelects();
  closeModal('maintenanceModal');
}

// 페이지 로드 시 렌더링
document.addEventListener("DOMContentLoaded", () => { renderMaintenance(); });
