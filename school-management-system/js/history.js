function renderHistoryReport() {
  const current = globalTerms.find(t => t.id === currentActiveTermId);
  if (!current) return;

  document.getElementById('hist-term-title').textContent = current.term_name;
  document.getElementById('hist-term-dates').textContent = `${formatDateThai(current.start_date)} - ${formatDateThai(current.end_date)}`;

  const tbody = document.getElementById('history-tbody');
  tbody.innerHTML = '';

  const activeList = globalStudents.filter(s => s.status !== 'transferred_out');
  activeList.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="p-2.5 font-mono">${s.student_code}</td>
      <td class="p-2.5 font-medium">${s.first_name} ${s.last_name}</td>
      <td class="p-2.5">${s.grade_level}</td>
      <td class="p-2.5 text-center text-emerald-600 font-bold">96</td>
      <td class="p-2.5 text-center text-rose-500 font-bold">4</td>
      <td class="p-2.5 text-center font-bold text-blue-700">96.0%</td>
      <td class="p-2.5 text-center"><span class="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-semibold">มีสิทธิ์สอบ</span></td>
    `;
    tbody.appendChild(tr);
  });
}