const MAINTENANCE_KEY = "maintenanceData";
let maintenanceData = JSON.parse(localStorage.getItem(MAINTENANCE_KEY) || '[]');

function openMaintenanceModal() {
  openModal('maintenanceModal');
  renderMaintenance();
}

function renderMaintenance() {
  const tbody = document.querySelector("#maintenanceTable tbody");
  tbody.innerHTML = '';

  if(maintenanceData.length === 0){
    maintenanceData.push({ company: '본부중대', rooms: ['정비1','정비2','취사','본부생활관'] });
    maintenanceData.push({ company: '심정중대', rooms: ['심정1','심정2','생활관'] });
  }

  maintenanceData.forEach((comp, compIdx) => {
    // 중대 행
    const trCompany = document.createElement('tr');
    const th = document.createElement('th');
    th.colSpan = 3;
    th.innerHTML = `<input type="text" value="${comp.company}" oninput="updateCompanyName(${compIdx}, this)">
                    <button onclick="deleteCompany(${compIdx})">중대 삭제</button>`;
    trCompany.appendChild(th);
    tbody.appendChild(trCompany);

    // 생활관 행
    comp.rooms.forEach((room, roomIdx) => {
      const trRoom = document.createElement('tr');
      trRoom.innerHTML = `<td><input type="text" value="${room}" oninput="updateRoomName(${compIdx}, ${roomIdx}, this)"></td>
                          <td><button onclick="deleteRoom(${compIdx}, ${roomIdx})">삭제</button></td>`;
      tbody.appendChild(trRoom);
    });

    // 생활관 추가 버튼
    const trAdd = document.createElement('tr');
    trAdd.innerHTML = `<td colspan="3"><button onclick="addRoom(${compIdx})">생활관 추가</button></td>`;
    tbody.appendChild(trAdd);
  });

  if(typeof updateSoldierSelects === 'function') updateSoldierSelects();
}

// CRUD
function updateCompanyName(idx, input) { maintenanceData[idx].company = input.value.trim(); }
function updateRoomName(compIdx, roomIdx, input) { maintenanceData[compIdx].rooms[roomIdx] = input.value.trim(); }
function addCompany() { maintenanceData.push({ company: '새 중대', rooms: ['새 생활관'] }); renderMaintenance(); }
function deleteCompany(idx) { if(confirm('중대 삭제하시겠습니까?')) { maintenanceData.splice(idx,1); renderMaintenance(); } }
function addRoom(compIdx) { maintenanceData[compIdx].rooms.push('새 생활관'); renderMaintenance(); }
function deleteRoom(compIdx, roomIdx) { if(confirm('생활관 삭제하시겠습니까?')) { maintenanceData[compIdx].rooms.splice(roomIdx,1); if(maintenanceData[compIdx].rooms.length===0) maintenanceData.splice(compIdx,1); renderMaintenance(); } }

// 저장 후 닫기
function saveMaintenance() {
  localStorage.setItem(MAINTENANCE_KEY, JSON.stringify(maintenanceData));
  if(typeof updateSoldierSelects === 'function') updateSoldierSelects();
  closeModal('maintenanceModal');
}
