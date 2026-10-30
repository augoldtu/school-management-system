// ฟังก์ชันสลับเมนูหลักของระบบ
function switchTab(tabId) {
  const tabs = ['dashboard', 'attendance', 'academic', 'history', 'admin', 'info'];
  tabs.forEach(t => {
    const section = document.getElementById(`view-${t}`);
    const menuBtn = document.getElementById(`menu-${t}`);
    if (section) section.classList.add('hidden');
    if (menuBtn) {
      menuBtn.classList.remove('bg-blue-600', 'text-white');
      menuBtn.classList.add('text-slate-300');
    }

// ใน js/dashboard.js ฟังก์ชัน switchTab(tabId)
  if (tabId === 'academic') {
    if (typeof updateSubjectOptions === 'function') {
      updateSubjectOptions();
    } else if (typeof renderAcademicRoster === 'function') {
      renderAcademicRoster();
    }
  }

  });

  const targetSection = document.getElementById(`view-${tabId}`);
  const targetMenuBtn = document.getElementById(`menu-${tabId}`);
  if (targetSection) targetSection.classList.remove('hidden');
  if (targetMenuBtn) {
    targetMenuBtn.classList.add('bg-blue-600', 'text-white');
    targetMenuBtn.classList.remove('text-slate-300');
  }

  // เรียกโหลดข้อมูลเฉพาะหน้าเมื่อเปิดใช้งาน
  if (tabId === 'history') renderHistoryReport();
  if (tabId === 'academic') renderAcademicRoster();
}

// อัปเดตตัวเลขสรุปบนแดชบอร์ดผู้บริหาร
function updateDashboardSummary() {
  const activeStudents = globalStudents.filter(s => s.status !== 'transferred_out');
  const total = activeStudents.length;
  let present = 0;
  let absent = 0;

  activeStudents.forEach(s => {
    if (attendanceState[s.id] === 'present') present++;
    else absent++;
  });

  document.getElementById('dash-total').innerHTML = `${total} <span class="text-sm font-normal text-slate-500">คน</span>`;
  document.getElementById('dash-present').innerHTML = `${present} <span class="text-sm font-normal text-slate-500">คน</span>`;
  document.getElementById('dash-absent').innerHTML = `${absent} <span class="text-sm font-normal text-slate-500">คน</span>`;

  const percent = total > 0 ? ((present / total) * 100).toFixed(1) : 0;
  document.getElementById('dash-percent').textContent = `${percent}%`;
}

// แสดงรายการตัวเลือกภาคเรียนบน Navbar ส่วนกลาง
function renderGlobalTermSelector() {
  const select = document.getElementById('global-term-select');
  if (!select) return;
  select.innerHTML = '';

  if (globalTerms.length === 0) {
    select.innerHTML = '<option value="">ไม่มีข้อมูลภาคเรียน</option>';
    return;
  }

  const activeTerm = globalTerms.find(t => t.is_active) || globalTerms[0];
  if (!currentActiveTermId) currentActiveTermId = activeTerm.id;

  globalTerms.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t.id;
    opt.textContent = `${t.term_name} ${t.is_active ? '★ (ปัจจุบัน)' : ''}`;
    if (t.id === currentActiveTermId) opt.selected = true;
    select.appendChild(opt);
  });

  updateTermLabel();
}

function updateTermLabel() {
  const current = globalTerms.find(t => t.id === currentActiveTermId);
  const label = document.getElementById('dash-active-term-label');
  if (current && label) {
    label.textContent = `${current.term_name} (${formatDateThai(current.start_date)} - ${formatDateThai(current.end_date)})`;
  }
}

window.handleGlobalTermChange = function(termId) {
  currentActiveTermId = termId;
  updateTermLabel();
  renderHistoryReport();
};