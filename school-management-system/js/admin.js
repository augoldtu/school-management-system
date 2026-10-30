function switchAdminSubTab(sub) {
  ['term', 'student', 'teacher'].forEach(s => {
    document.getElementById(`admin-${s}-sec`).classList.add('hidden');
    document.getElementById(`sub-btn-${s}`).className = "px-4 py-2 text-sm font-medium text-slate-500";
  });

  document.getElementById(`admin-${sub}-sec`).classList.remove('hidden');
  document.getElementById(`sub-btn-${sub}`).className = "px-4 py-2 text-sm font-bold border-b-2 border-blue-600 text-blue-600";
}

function renderAdminStudentsTable(list) {
  const tbody = document.getElementById('admin-student-tbody');
  tbody.innerHTML = '';
  document.getElementById('admin-student-count').textContent = `ทั้งหมด ${list.length} คน`;

  list.forEach(s => {
    const isOut = s.status === 'transferred_out';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="p-2.5 font-mono">${s.student_code}</td>
      <td class="p-2.5">${s.first_name} ${s.last_name}</td>
      <td class="p-2.5">${s.grade_level || '-'}</td>
      <td class="p-2.5">
        <span class="px-2 py-0.5 rounded text-xs font-semibold ${isOut ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}">
          ${isOut ? 'ย้ายออก' : 'กำลังศึกษา'}
        </span>
      </td>
      <td class="p-2.5 text-center">
        <button onclick="toggleStudentTransfer('${s.id}', '${s.status}')" class="text-xs px-2.5 py-1 rounded border font-medium transition ${isOut ? 'border-emerald-500 text-emerald-600 hover:bg-emerald-50' : 'border-rose-500 text-rose-600 hover:bg-rose-50'}">
          ${isOut ? 'รับย้ายกลับ' : 'บันทึกย้ายออก'}
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderAdminTeachersTable(list) {
  const tbody = document.getElementById('admin-teacher-tbody');
  tbody.innerHTML = '';
  list.forEach(t => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="p-2.5 font-mono">${t.teacher_code || t.id_teachers || '-'}</td>
      <td class="p-2.5">${t.first_name || t.first_name_Teacher || ''} ${t.last_name || t.last_name_Teacher || ''}</td>
      <td class="p-2.5">${t.position || '-'}</td>
      <td class="p-2.5"><span class="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold">ปฏิบัติงาน</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function renderAdminTermsTable() {
  const tbody = document.getElementById('admin-term-tbody');
  tbody.innerHTML = '';

  globalTerms.forEach(t => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="p-2.5 font-semibold text-slate-800">
        ${t.term_name}
        ${t.is_active ? '<span class="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full font-bold">ปัจจุบัน</span>' : ''}
      </td>
      <td class="p-2.5 text-slate-600 text-xs">${formatDateThai(t.start_date)} ถึง ${formatDateThai(t.end_date)}</td>
      <td class="p-2.5">
        <span class="text-xs ${t.is_active ? 'text-emerald-600 font-bold' : 'text-slate-400'}">
          ${t.is_active ? 'เปิดใช้งาน' : 'ย้อนหลัง / ปิดรอบ'}
        </span>
      </td>
      <td class="p-2.5 text-center">
        ${!t.is_active ? `<button onclick="makeTermActive('${t.id}')" class="text-xs px-2.5 py-1 border border-blue-500 text-blue-600 rounded hover:bg-blue-50 font-medium">ตั้งเป็นปัจจุบัน</button>` : '<span class="text-xs text-slate-400">-</span>'}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.toggleStudentTransfer = async function(studentId, currentStatus) {
  const newStatus = currentStatus === 'transferred_out' ? 'studying' : 'transferred_out';
  const actionName = newStatus === 'transferred_out' ? 'ย้ายออก' : 'รับย้ายกลับเข้าเรียน';

  if (!confirm(`ต้องการเปลี่ยนสถานะนักเรียนเป็น "${actionName}" ใช่หรือไม่?`)) return;

  const { error } = await db.from('students').update({ status: newStatus }).eq('id', studentId);
  if (error) {
    alert('เกิดข้อผิดพลาด: ' + error.message);
  } else {
    alert(`บันทึกสถานะ "${actionName}" สำเร็จ!`);
    await initApplicationData();
  }
};

window.makeTermActive = async function(termId) {
  if (!confirm('ต้องการเปลี่ยนภาคเรียนปัจจุบันเป็นรอบนี้ใช่หรือไม่?')) return;
  await db.from('academic_terms').update({ is_active: false }).neq('id', '00000000-0000-0000-0000-000000000000');
  const { error } = await db.from('academic_terms').update({ is_active: true }).eq('id', termId);

  if (error) {
    alert('เกิดข้อผิดพลาด: ' + error.message);
  } else {
    currentActiveTermId = termId;
    await initApplicationData();
  }
};

window.openTransferInModal = function() {
  document.getElementById('modal-transfer-in').classList.remove('hidden');
};

window.closeTransferInModal = function() {
  document.getElementById('modal-transfer-in').classList.add('hidden');
  document.getElementById('form-transfer-in').reset();
};

window.handleTransferInSubmit = async function(event) {
  event.preventDefault();
  const btn = document.getElementById('btn-submit-in');
  btn.disabled = true;

  const studentCode = document.getElementById('in-student-code').value.trim();
  const firstName = document.getElementById('in-first-name').value.trim();
  const lastName = document.getElementById('in-last-name').value.trim();
  const gradeLevel = document.getElementById('in-grade-level').value;
  const classroom = document.getElementById('in-classroom').value.trim() || '1';
  const transferSchool = document.getElementById('in-transfer-school').value.trim();

  const { error } = await db.from('students').insert([{
    student_code: studentCode,
    first_name: firstName,
    last_name: lastName,
    grade_level: gradeLevel,
    classroom: classroom,
    status: 'studying',
    transfer_school: transferSchool,
    transfer_date: new Date().toISOString().split('T')[0]
  }]);

  if (error) {
    alert('เกิดข้อผิดพลาด: ' + error.message);
  } else {
    alert(`บันทึกรับนักเรียน "${firstName} ${lastName}" เข้าเรียนสำเร็จ!`);
    closeTransferInModal();
    await initApplicationData();
  }
  btn.disabled = false;
};