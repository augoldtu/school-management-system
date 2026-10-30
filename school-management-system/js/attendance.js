// ========================================================
// js/attendance.js: ระบบเช็คชื่อหน้าแถวสำหรับครู (Mobile-First)
// โรงเรียนวัดใหญ่(นากประสุตประชานุสรณ์)
// ========================================================

// 1. กำหนดค่าวันที่ปัจจุบันลงใน Date Picker อัตโนมัติ
window.initAttendanceDatePicker = function() {
  const dateInput = document.getElementById('attendance-date-picker');
  if (dateInput && !dateInput.value) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.value = `${yyyy}-${mm}-${dd}`;
  }
};

// 2. ดึงประวัติการเช็คชื่อตามวันที่และภาคเรียนที่เลือกจาก Supabase
window.loadAttendanceByDate = async function() {
  const dateInput = document.getElementById('attendance-date-picker');
  if (!dateInput || !dateInput.value || !currentActiveTermId) return;

  try {
    const { data, error } = await db
      .from('attendance')
      .select('student_id, status')
      .eq('term_id', currentActiveTermId)
      .eq('attendance_date', dateInput.value);

    if (!error && data && data.length > 0) {
      // โหลดสถานะเดิมที่เคยบันทึกไว้เข้าตัวแปร attendanceState
      data.forEach(item => {
        attendanceState[item.student_id] = item.status;
      });
    } else {
      // หากยังไม่มีการบันทึกในวันนี้ ให้ตั้งค่าเริ่มต้นเป็น "มา" สำหรับนักเรียนทุกคน
      if (typeof globalStudents !== 'undefined') {
        globalStudents.forEach(s => {
          if (s.status !== 'transferred_out') {
            attendanceState[s.id] = 'present';
          }
        });
      }
    }
  } catch (err) {
    console.warn("ไม่สามารถโหลดข้อมูลการเช็คชื่อประจำวันได้:", err);
  }

  renderAttendanceList();
};

// 3. วาดการ์ดรายชื่อนักเรียนสำหรับกดเช็คชื่อ (UI สไตล์ Mobile-First)
window.renderAttendanceList = function() {
  const container = document.getElementById('student-list');
  const gradeFilterEl = document.getElementById('grade-filter');
  if (!container) return;

  const gradeFilter = gradeFilterEl ? gradeFilterEl.value : 'all';
  container.innerHTML = '';

  const studentList = (typeof globalStudents !== 'undefined' ? globalStudents : []).filter(s => {
    if (s.status === 'transferred_out') return false;
    return gradeFilter === 'all' || s.grade_level === gradeFilter;
  });

  if (studentList.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
        <i class="fa-solid fa-user-slash text-2xl mb-2 text-slate-300"></i>
        <p class="text-sm">ไม่พบรายชื่อนักเรียนในระดับชั้นที่เลือก</p>
      </div>`;
    return;
  }

  studentList.forEach((s, idx) => {
    const currentStatus = attendanceState[s.id] || 'present';
    const card = document.createElement('div');
    card.className = "bg-white border border-slate-200 p-3.5 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition hover:border-slate-300";
    
    card.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-mono font-bold text-xs text-slate-500">
          ${idx + 1}
        </span>
        <div>
          <div class="font-bold text-slate-800 text-sm">${s.first_name} ${s.last_name}</div>
          <div class="text-[11px] text-slate-500 flex items-center gap-2">
            <span>รหัส: <span class="font-mono">${s.student_code}</span></span>
            <span>&bull;</span>
            <span class="text-indigo-600 font-semibold">${s.grade_level}</span>
          </div>
        </div>
      </div>
      
      <!-- ปุ่มกดเลือกสถานะ 4 ตัวเลือก -->
      <div class="grid grid-cols-4 gap-1.5 w-full sm:w-auto">
        <button type="button" onclick="setAttendanceStatus('${s.id}', 'present')" 
          class="px-3 py-1.5 rounded-lg text-xs font-bold transition ${currentStatus === 'present' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'}">
          มา
        </button>
        <button type="button" onclick="setAttendanceStatus('${s.id}', 'late')" 
          class="px-3 py-1.5 rounded-lg text-xs font-bold transition ${currentStatus === 'late' ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'}">
          สาย
        </button>
        <button type="button" onclick="setAttendanceStatus('${s.id}', 'leave')" 
          class="px-3 py-1.5 rounded-lg text-xs font-bold transition ${currentStatus === 'leave' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'}">
          ลา
        </button>
        <button type="button" onclick="setAttendanceStatus('${s.id}', 'absent')" 
          class="px-3 py-1.5 rounded-lg text-xs font-bold transition ${currentStatus === 'absent' ? 'bg-rose-600 text-white shadow-sm' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'}">
          ขาด
        </button>
      </div>
    `;
    container.appendChild(card);
  });
};

// 4. สลับสถานะของนักเรียนรายบุคคล
window.setAttendanceStatus = function(studentId, status) {
  attendanceState[studentId] = status;
  renderAttendanceList();
};

// 5. บันทึกข้อมูลการเช็คชื่อทั้งหมดลงฐานข้อมูล Supabase
window.saveAttendanceData = async function() {
  const saveBtn = document.getElementById('save-btn');
  const dateInput = document.getElementById('attendance-date-picker');
  const gradeFilterEl = document.getElementById('grade-filter');

  if (!dateInput || !dateInput.value) {
    alert('กรุณาระบุวันที่ทำการเช็คชื่อ');
    return;
  }

  if (!currentActiveTermId) {
    alert('ไม่พบข้อมูลภาคเรียนปัจจุบัน กรุณาตรวจสอบการตั้งค่าปีการศึกษา');
    return;
  }

  const gradeFilter = gradeFilterEl ? gradeFilterEl.value : 'all';
  const targetStudents = (typeof globalStudents !== 'undefined' ? globalStudents : []).filter(s => {
    if (s.status === 'transferred_out') return false;
    return gradeFilter === 'all' || s.grade_level === gradeFilter;
  });

  if (targetStudents.length === 0) {
    alert('ไม่มีรายชื่อนักเรียนสำหรับบันทึก');
    return;
  }

  saveBtn.disabled = true;
  saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>กำลังบันทึกข้อมูล...';

  const records = targetStudents.map(s => ({
    student_id: s.id,
    term_id: currentActiveTermId,
    attendance_date: dateInput.value,
    status: attendanceState[s.id] || 'present'
  }));

  try {
    const { error } = await db.from('attendance').upsert(records, {
      onConflict: 'student_id, attendance_date, term_id'
    });

    if (error) {
      alert('เกิดข้อผิดพลาดในการบันทึก: ' + error.message);
    } else {
      alert(`บันทึกข้อมูลการเช็คชื่อประจำวันที่ ${dateInput.value} เรียบร้อยแล้ว!`);
      if (typeof updateDashboardSummary === 'function') {
        updateDashboardSummary();
      }
    }
  } catch (err) {
    alert('เกิดข้อผิดพลาดในการเชื่อมต่อ: ' + err.message);
  } finally {
    saveBtn.disabled = false;
    saveBtn.innerHTML = 'บันทึกข้อมูลการเช็คชื่อ';
  }
};