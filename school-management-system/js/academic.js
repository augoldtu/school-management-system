// ========================================================
// js/academic.js: ระบบวัดผล ประเมินผล และทอนคะแนนตัวชี้วัดจริง
// โรงเรียนวัดใหญ่(นากประสุตประชานุสรณ์)
// ========================================================

const curriculumData = {
  thai: {
    name: "กลุ่มสาระการเรียนรู้ภาษาไทย",
    codes: {
      "ป.1": { code: "ท11101", name: "ภาษาไทย 1" },
      "ป.2": { code: "ท12101", name: "ภาษาไทย 2" },
      "ป.3": { code: "ท13101", name: "ภาษาไทย 3" },
      "ป.4": { code: "ท14101", name: "ภาษาไทย 4" },
      "ป.5": { code: "ท15101", name: "ภาษาไทย 5" },
      "ป.6": { code: "ท16101", name: "ภาษาไทย 6" }
    }
  },
  math: {
    name: "กลุ่มสาระการเรียนรู้คณิตศาสตร์",
    codes: {
      "ป.1": { code: "ค11101", name: "คณิตศาสตร์ 1" },
      "ป.2": { code: "ค12101", name: "คณิตศาสตร์ 2" },
      "ป.3": { code: "ค13101", name: "คณิตศาสตร์ 3" },
      "ป.4": { code: "ค14101", name: "คณิตศาสตร์ 4" },
      "ป.5": { code: "ค15101", name: "คณิตศาสตร์ 5" },
      "ป.6": { code: "ค16101", name: "คณิตศาสตร์ 6" }
    }
  },
  sci: {
    name: "กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี",
    codes: {
      "ป.1": { code: "ว11101", name: "วิทยาศาสตร์และเทคโนโลยี 1" },
      "ป.2": { code: "ว12101", name: "วิทยาศาสตร์และเทคโนโลยี 2" },
      "ป.3": { code: "ว13101", name: "วิทยาศาสตร์และเทคโนโลยี 3" },
      "ป.4": { code: "ว14101", name: "วิทยาศาสตร์และเทคโนโลยี 4" },
      "ป.5": { code: "ว15101", name: "วิทยาศาสตร์และเทคโนโลยี 5" },
      "ป.6": { code: "ว16101", name: "วิทยาศาสตร์และเทคโนโลยี 6" }
    }
  },
  soc: {
    name: "กลุ่มสาระการเรียนรู้สังคมศึกษา ศาสนาฯ",
    codes: {
      "ป.1": { code: "ส11101", name: "สังคมศึกษาฯ 1" },
      "ป.2": { code: "ส12101", name: "สังคมศึกษาฯ 2" },
      "ป.3": { code: "ส13101", name: "สังคมศึกษาฯ 3" },
      "ป.4": { code: "ส14101", name: "สังคมศึกษาฯ 4" },
      "ป.5": { code: "ส15101", name: "สังคมศึกษาฯ 5" },
      "ป.6": { code: "ส16101", name: "สังคมศึกษาฯ 6" }
    }
  },
  eng: {
    name: "กลุ่มสาระการเรียนรู้ภาษาต่างประเทศ (อังกฤษ)",
    codes: {
      "ป.1": { code: "อ11101", name: "ภาษาอังกฤษ 1" },
      "ป.2": { code: "อ12101", name: "ภาษาอังกฤษ 2" },
      "ป.3": { code: "อ13101", name: "ภาษาอังกฤษ 3" },
      "ป.4": { code: "อ14101", name: "ภาษาอังกฤษ 4" },
      "ป.5": { code: "อ15101", name: "ภาษาอังกฤษ 5" },
      "ป.6": { code: "อ16101", name: "ภาษาอังกฤษ 6" }
    }
  }
};

const standardCurriculumIndicators = {
  "ท11101": [
    { code: "ท 1.1 ป.1/1", name: "การอ่านออกเสียงคำ", rawMax: 50, weight: 15 },
    { code: "ท 1.1 ป.1/2", name: "บอกความหมายของคำ", rawMax: 50, weight: 15 },
    { code: "ท 2.1 ป.1/1", name: "คัดลายมือตัวบรรจง", rawMax: 30, weight: 10 },
    { code: "ท 2.1 ป.1/2", name: "เขียนสื่อสารคำง่ายๆ", rawMax: 50, weight: 15 },
    { code: "ท 4.1 ป.1/1", name: "เขียนพยัญชนะ สระ", rawMax: 50, weight: 15 }
  ],
  "ค11101": [
    { code: "ค 1.1 ป.1/1", name: "บอกจำนวนและการนับ", rawMax: 50, weight: 20 },
    { code: "ค 1.1 ป.1/2", name: "เปรียบเทียบเรียงลำดับ", rawMax: 50, weight: 20 },
    { code: "ค 1.1 ป.1/3", name: "การบวกไม่เกิน 100", rawMax: 100, weight: 20 },
    { code: "ค 1.1 ป.1/4", name: "การลบไม่เกิน 100", rawMax: 100, weight: 20 }
  ],
  "ค14101": [
    { code: "ค 1.1 ป.4/1", name: "อ่านและเขียนตัวเลขฮินดูอารบิก", rawMax: 50, weight: 20 },
    { code: "ค 1.1 ป.4/2", name: "เปรียบเทียบและเรียงลำดับจำนวน", rawMax: 50, weight: 25 },
    { code: "ค 1.1 ป.4/7", name: "ประมาณผลลัพธ์การบวกการลบ", rawMax: 100, weight: 25 }
  ]
};

let currentAssessmentConfig = {
  formativeTarget: 70,
  summativeTarget: 30
};

let currentIndicators = [];

window.updateSubjectOptions = function() {
  const gradeEl = document.getElementById('academic-grade-filter');
  const groupEl = document.getElementById('academic-group-select');
  const subSelect = document.getElementById('academic-subject-select');
  if (!subSelect) return;

  const grade = gradeEl ? gradeEl.value : 'ป.1';
  const group = groupEl ? groupEl.value : 'thai';
  subSelect.innerHTML = '';

  const groupInfo = curriculumData[group];
  if (groupInfo && groupInfo.codes[grade]) {
    const item = groupInfo.codes[grade];
    const opt = document.createElement('option');
    opt.value = `${item.code}|${item.name}`;
    opt.textContent = `${item.code} ${item.name}`;
    subSelect.appendChild(opt);
  } else {
    subSelect.innerHTML = `<option value="">ไม่มีข้อมูลหลักสูตรในชั้นนี้</option>`;
  }

  loadSubjectIndicators();
};

window.loadSubjectIndicators = async function() {
  const subSelect = document.getElementById('academic-subject-select');
  if (!subSelect || !subSelect.value) return;

  const [subCode] = subSelect.value.split('|');

  let loadedFromDB = false;
  if (typeof currentActiveTermId !== 'undefined' && currentActiveTermId && subCode) {
    try {
      const { data, error } = await db
        .from('subject_indicators')
        .select('*')
        .eq('term_id', currentActiveTermId)
        .eq('subject_code', subCode);

      if (!error && data && data.length > 0) {
        currentIndicators = data.map(d => ({
          code: d.indicator_code,
          name: d.indicator_name,
          rawMax: parseFloat(d.raw_max_score),
          weight: parseFloat(d.target_weight)
        }));
        loadedFromDB = true;
      }
    } catch (e) {
      console.warn("ไม่สามารถอ่านข้อมูล subject_indicators ได้:", e);
    }
  }

  if (!loadedFromDB) {
    if (standardCurriculumIndicators[subCode]) {
      currentIndicators = JSON.parse(JSON.stringify(standardCurriculumIndicators[subCode]));
    } else {
      currentIndicators = [
        { code: `${subCode} ตัวชี้วัด 1`, name: "ด้านความรู้ความเข้าใจ", rawMax: 50, weight: 35 },
        { code: `${subCode} ตัวชี้วัด 2`, name: "ด้านทักษะกระบวนการ", rawMax: 100, weight: 35 }
      ];
    }
  }

  currentAssessmentConfig.formativeTarget = currentIndicators.reduce((sum, ind) => sum + ind.weight, 0);
  currentAssessmentConfig.summativeTarget = 100 - currentAssessmentConfig.formativeTarget;

  const ratioSelect = document.getElementById('academic-ratio-select');
  if (ratioSelect) {
    ratioSelect.value = `${currentAssessmentConfig.formativeTarget}:${currentAssessmentConfig.summativeTarget}`;
  }

  renderAcademicRoster();
};

window.handleRatioChange = function(ratioValue) {
  const [f, s] = ratioValue.split(':').map(Number);
  currentAssessmentConfig.formativeTarget = f;
  currentAssessmentConfig.summativeTarget = s;

  if (currentIndicators.length > 0) {
    const avgWeight = Math.round((f / currentIndicators.length) * 10) / 10;
    currentIndicators.forEach((ind, idx) => {
      if (idx === currentIndicators.length - 1) {
        const currentSum = currentIndicators.slice(0, -1).reduce((sum, i) => sum + i.weight, 0);
        ind.weight = Math.round((f - currentSum) * 10) / 10;
      } else {
        ind.weight = avgWeight;
      }
    });
  }

  renderAcademicRoster();
};

window.renderAcademicRoster = function() {
  const gradeEl = document.getElementById('academic-grade-filter');
  const grade = gradeEl ? gradeEl.value : 'ป.1';
  const theadRow = document.getElementById('academic-thead-tr');
  const tbody = document.getElementById('academic-tbody');
  
  if (!theadRow || !tbody) return;

  let theadHTML = `
    <th class="p-2.5 border-b sticky left-0 bg-slate-100 z-20 min-w-[70px]">รหัส</th>
    <th class="p-2.5 border-b sticky left-[70px] bg-slate-100 z-20 min-w-[170px]">ชื่อ - สกุล</th>
  `;

  currentIndicators.forEach((ind) => {
    theadHTML += `
      <th class="p-2 border-b text-center bg-amber-50/70 min-w-[120px]">
        <div class="font-bold text-xs text-amber-900 truncate" title="${ind.name || ind.code}">${ind.code}</div>
        <div class="text-[10px] text-slate-500 font-normal">เต็มดิบ ${ind.rawMax} &rarr; <span class="font-bold text-blue-700">${ind.weight}</span></div>
      </th>
    `;
  });

  theadHTML += `
    <th class="p-2.5 border-b text-center bg-blue-100/70 text-blue-900 font-bold min-w-[90px]">คะแนนเก็บ (${currentAssessmentConfig.formativeTarget})</th>
    <th class="p-2.5 border-b text-center bg-indigo-50/70 text-indigo-900 font-bold min-w-[90px]">ปลายภาค (${currentAssessmentConfig.summativeTarget})</th>
    <th class="p-2.5 border-b text-center bg-slate-100 font-bold min-w-[80px]">รวม (100)</th>
    <th class="p-2.5 border-b text-center bg-slate-100 font-bold min-w-[70px]">เกรด</th>
  `;
  theadRow.innerHTML = theadHTML;

  const list = (typeof globalStudents !== 'undefined' ? globalStudents : []).filter(s => s.grade_level === grade && s.status !== 'transferred_out');
  tbody.innerHTML = '';

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="${currentIndicators.length + 6}" class="p-6 text-center text-slate-400">ไม่พบรายชื่อนักเรียนในระดับชั้นนี้</td></tr>`;
    return;
  }

  list.forEach(s => {
    const tr = document.createElement('tr');
    tr.className = "hover:bg-slate-50/80 transition";
    let rowHTML = `
      <td class="p-2.5 font-mono text-xs sticky left-0 bg-white z-10 border-b">${s.student_code}</td>
      <td class="p-2.5 text-sm font-medium whitespace-nowrap sticky left-[70px] bg-white z-10 border-b">${s.first_name} ${s.last_name}</td>
    `;

    currentIndicators.forEach((ind) => {
      rowHTML += `
        <td class="p-2 text-center bg-amber-50/20 border-b">
          <input type="number" min="0" max="${ind.rawMax}" id="ind-${ind.code.replace(/[^a-zA-Z0-9]/g, '_')}-${s.id}" 
            value="${Math.round(ind.rawMax * 0.8)}" 
            oninput="calculateStudentScores('${s.id}')" 
            class="w-16 border border-slate-300 rounded p-1 text-center font-bold text-xs focus:ring-2 focus:ring-amber-500">
        </td>
      `;
    });

    const defaultSummative = Math.round(currentAssessmentConfig.summativeTarget * 0.8);

    rowHTML += `
      <td class="p-2 text-center font-bold text-blue-700 bg-blue-50/40 border-b" id="formative-${s.id}">0.00</td>
      <td class="p-2 text-center border-b">
        <input type="number" min="0" max="${currentAssessmentConfig.summativeTarget}" id="summative-${s.id}" value="${defaultSummative}" 
          oninput="calculateStudentScores('${s.id}')" 
          class="w-16 border border-slate-300 rounded p-1 text-center font-bold text-xs focus:ring-2 focus:ring-indigo-500">
      </td>
      <td class="p-2 text-center font-bold text-slate-800 border-b" id="total-${s.id}">0.00</td>
      <td class="p-2 text-center font-bold text-emerald-600 text-base border-b" id="grade-${s.id}">-</td>
    `;
    tr.innerHTML = rowHTML;
    tbody.appendChild(tr);

    calculateStudentScores(s.id);
  });
};

window.calculateStudentScores = function(studentId) {
  let scaledFormativeTotal = 0;

  currentIndicators.forEach(ind => {
    const inputId = `ind-${ind.code.replace(/[^a-zA-Z0-9]/g, '_')}-${studentId}`;
    const inputEl = document.getElementById(inputId);
    const rawVal = parseFloat(inputEl ? inputEl.value : 0) || 0;
    const scaledScore = (rawVal / ind.rawMax) * ind.weight;
    scaledFormativeTotal += scaledScore;
  });

  const formativeFinal = Math.round(scaledFormativeTotal * 100) / 100;
  const summativeVal = parseFloat(document.getElementById(`summative-${studentId}`).value) || 0;
  const totalVal = Math.round((formativeFinal + summativeVal) * 100) / 100;

  document.getElementById(`formative-${studentId}`).textContent = formativeFinal.toFixed(2);
  document.getElementById(`total-${studentId}`).textContent = totalVal.toFixed(2);

  let grade = '0';
  if (totalVal >= 79.5) grade = '4';
  else if (totalVal >= 74.5) grade = '3.5';
  else if (totalVal >= 69.5) grade = '3';
  else if (totalVal >= 64.5) grade = '2.5';
  else if (totalVal >= 59.5) grade = '2';
  else if (totalVal >= 54.5) grade = '1.5';
  else if (totalVal >= 49.5) grade = '1';
  else grade = '0';

  document.getElementById(`grade-${studentId}`).textContent = grade;
};

window.openIndicatorConfigModal = function() {
  const modal = document.getElementById('modal-indicator-config');
  if (modal) modal.classList.remove('hidden');
  renderIndicatorConfigRows();
};

window.closeIndicatorConfigModal = function() {
  const modal = document.getElementById('modal-indicator-config');
  if (modal) modal.classList.add('hidden');
};

function renderIndicatorConfigRows() {
  const container = document.getElementById('indicator-config-list');
  if (!container) return;
  container.innerHTML = '';

  currentIndicators.forEach((ind, index) => {
    const row = document.createElement('div');
    row.className = 'grid grid-cols-12 gap-2 items-center bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs';
    row.innerHTML = `
      <div class="col-span-3">
        <input type="text" id="cfg-code-${index}" value="${ind.code}" class="w-full border rounded p-1.5 font-bold" placeholder="รหัสตัวชี้วัด">
      </div>
      <div class="col-span-4">
        <input type="text" id="cfg-name-${index}" value="${ind.name || ''}" class="w-full border rounded p-1.5" placeholder="คำอธิบายตัวชี้วัด">
      </div>
      <div class="col-span-2 text-center">
        <input type="number" id="cfg-raw-${index}" value="${ind.rawMax}" oninput="updateWeightSumWarning()" class="w-full border rounded p-1.5 text-center" placeholder="เต็มดิบ">
      </div>
      <div class="col-span-2 text-center">
        <input type="number" id="cfg-weight-${index}" value="${ind.weight}" oninput="updateWeightSumWarning()" class="w-full border rounded p-1.5 text-center font-bold text-blue-600" placeholder="ค่าน้ำหนัก">
      </div>
      <div class="col-span-1 text-center">
        <button onclick="removeIndicatorRow(${index})" class="text-rose-500 hover:text-rose-700 font-bold text-base">&times;</button>
      </div>
    `;
    container.appendChild(row);
  });

  updateWeightSumWarning();
}

window.addIndicatorRow = function() {
  const nextNo = currentIndicators.length + 1;
  currentIndicators.push({
    code: `ตัวชี้วัดที่ ${nextNo}`,
    name: "คำอธิบายตัวชี้วัดใหม่",
    rawMax: 50,
    weight: 10
  });
  renderIndicatorConfigRows();
};

window.removeIndicatorRow = function(index) {
  if (currentIndicators.length <= 1) {
    alert('ต้องมีตัวชี้วัดอย่างน้อย 1 รายการ');
    return;
  }
  currentIndicators.splice(index, 1);
  renderIndicatorConfigRows();
};

function updateWeightSumWarning() {
  let totalW = 0;
  currentIndicators.forEach((_, idx) => {
    const wEl = document.getElementById(`cfg-weight-${idx}`);
    if (wEl) totalW += parseFloat(wEl.value) || 0;
  });
  const warnEl = document.getElementById('weight-sum-label');
  if (warnEl) {
    warnEl.textContent = `ค่าน้ำหนักตัวชี้วัดรวม: ${totalW.toFixed(1)} คะแนน (เป้าหมายคะแนนเก็บ = ${currentAssessmentConfig.formativeTarget})`;
    warnEl.className = totalW === currentAssessmentConfig.formativeTarget ? 'text-emerald-600 font-bold text-xs' : 'text-amber-600 font-bold text-xs';
  }
}

window.saveIndicatorConfig = async function() {
  let totalW = 0;
  const gradeVal = document.getElementById('academic-grade-filter').value;
  const subSelect = document.getElementById('academic-subject-select');
  const [subCode, subName] = subSelect.value.split('|');

  currentIndicators.forEach((ind, idx) => {
    const codeInput = document.getElementById(`cfg-code-${idx}`);
    const nameInput = document.getElementById(`cfg-name-${idx}`);
    const rawInput = document.getElementById(`cfg-raw-${idx}`);
    const weightInput = document.getElementById(`cfg-weight-${idx}`);

    if (codeInput) ind.code = codeInput.value.trim() || `ตัวชี้วัด ${idx+1}`;
    if (nameInput) ind.name = nameInput.value.trim() || '';
    if (rawInput) ind.rawMax = parseFloat(rawInput.value) || 50;
    if (weightInput) ind.weight = parseFloat(weightInput.value) || 10;
    totalW += ind.weight;
  });

  currentAssessmentConfig.formativeTarget = Math.round(totalW * 10) / 10;
  currentAssessmentConfig.summativeTarget = Math.round((100 - totalW) * 10) / 10;

  if (typeof currentActiveTermId !== 'undefined' && currentActiveTermId && subCode) {
    try {
      const indicatorRecords = currentIndicators.map(ind => ({
        term_id: currentActiveTermId,
        grade_level: gradeVal,
        subject_code: subCode,
        subject_name: subName,
        indicator_code: ind.code,
        indicator_name: ind.name,
        raw_max_score: ind.rawMax,
        target_weight: ind.weight
      }));

      await db.from('subject_indicators').upsert(indicatorRecords, {
        onConflict: 'term_id, subject_code, indicator_code'
      });
    } catch (e) {
      console.warn("ไม่สามารถบันทึกโครงสร้างตัวชี้วัดลง Supabase ได้:", e);
    }
  }

  closeIndicatorConfigModal();
  renderAcademicRoster();
  alert(`บันทึกโครงสร้างตัวชี้วัดวิชา "${subCode} - ${subName}" ประจำภาคเรียนนี้เรียบร้อยแล้ว!`);
};

window.saveAcademicGrades = async function() {
  const btn = document.getElementById('btn-save-grades');
  btn.disabled = true;
  btn.textContent = 'กำลังบันทึกคะแนน...';

  const grade = document.getElementById('academic-grade-filter').value;
  const subValue = document.getElementById('academic-subject-select').value;
  if (!subValue) {
    alert('กรุณาเลือกรหัสวิชาก่อนบันทึก');
    btn.disabled = false;
    return;
  }

  const [subCode, subName] = subValue.split('|');
  const list = (typeof globalStudents !== 'undefined' ? globalStudents : []).filter(s => s.grade_level === grade && s.status !== 'transferred_out');

  const records = list.map(s => {
    const f = parseFloat(document.getElementById(`formative-${s.id}`).textContent) || 0;
    const sum = parseFloat(document.getElementById(`summative-${s.id}`).value) || 0;
    const g = document.getElementById(`grade-${s.id}`).textContent;
    return {
      student_id: s.id,
      term_id: currentActiveTermId,
      subject_code: subCode,
      subject_name: subName,
      score_formative: f,
      score_summative: sum,
      grade: g
    };
  });

  const { error } = await db.from('assessments').upsert(records, { 
    onConflict: 'student_id, term_id, subject_code' 
  });

  if (error) {
    alert('เกิดข้อผิดพลาดในการบันทึก: ' + error.message);
  } else {
    alert(`บันทึกคะแนนและตัดเกรดวิชา "${subName}" (${subCode}) สำเร็จเรียบร้อยแล้ว!`);
  }

  btn.disabled = false;
  btn.textContent = 'บันทึกคะแนน';
};