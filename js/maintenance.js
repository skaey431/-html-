// 유지보수 모달 열기
function openMaintenanceModal() {
  document.getElementById("maintenanceModal").style.display = "flex";
  loadCompanies(); // co.js 함수
  renderSoldiers(); // soldier.js 함수
  renderExemptions(); // exemption 관리 함수
}

// 유지보수 모달 닫기
function closeMaintenanceModal() {
  document.getElementById("maintenanceModal").style.display = "none";
}

// 저장 버튼 → co.js / soldier.js / exemption 각각 저장 호출
function saveMaintenance() {
  saveCompanies(); 
  saveSoldiers();
  saveExemptions();
  closeMaintenanceModal();
}

// 탭 전환 (main.html script에 있던 거 옮김)
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("#tabs .tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll("#tabs .tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      document.querySelectorAll(".tab-content").forEach(tc => tc.classList.remove("active"));
      document.getElementById(tab.dataset.tab).classList.add("active");
    });
  });
});
