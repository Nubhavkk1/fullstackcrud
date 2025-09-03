// public/app.js
(async function () {
  const $ = (s, r=document) => r.querySelector(s);
  const tpl = $('#studentTpl').content;
  const studentsEl = $('#students');

  const createForm = $('#createForm');
  const resetBtn = $('#reset');

  const editPanel = $('#editPanel');
  const editName = $('#editName');
  const editRoll = $('#editRoll');
  const editClass = $('#editClass');
  const saveEdit = $('#saveEdit');
  const cancelEdit = $('#cancelEdit');

  let editingId = null;

  async function api(path, method='GET', body) {
    const opts = { method, headers: {} };
    if (body) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
    }
    const res = await fetch(path, opts);
    const json = await res.json().catch(()=>({ ok:false, error:'bad json' }));
    if (!res.ok) throw json;
    return json;
  }

  function renderStudent(st) {
    const node = tpl.cloneNode(true);
    node.querySelector('.student-name').textContent = st.name;
    node.querySelector('.student-roll').textContent = `Roll No: ${st.roll_no}`;
    node.querySelector('.student-class').textContent = `Class: ${st.class}`;
    const item = node.querySelector('.student');
    item.dataset.id = st.id;
    item.querySelector('.edit').addEventListener('click', () => startEdit(st));
    item.querySelector('.delete').addEventListener('click', () => doDelete(st.id));
    return item;
  }

  async function load() {
    studentsEl.innerHTML = '';
    try {
      const res = await api('/api/students');
      res.data.forEach(s => studentsEl.appendChild(renderStudent(s)));
    } catch (err) {
      studentsEl.textContent = 'Failed to load students.';
    }
  }

  createForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = $('#name').value.trim();
    const roll_no = $('#roll_no').value.trim();
    const studentClass = $('#class').value.trim();
    if (!name || !roll_no || !studentClass) return alert('All fields required');
    try {
      await api('/api/students', 'POST', { name, roll_no, class: studentClass });
      $('#name').value = '';
      $('#roll_no').value = '';
      $('#class').value = '';
      await load();
    } catch (err) {
      alert(err.error || 'Create failed');
    }
  });

  resetBtn.addEventListener('click', () => {
    $('#name').value = '';
    $('#roll_no').value = '';
    $('#class').value = '';
  });

  async function doDelete(id) {
    if (!confirm('Delete student?')) return;
    try {
      await api(`/api/students/${id}`, 'DELETE');
      await load();
    } catch (err) {
      alert(err.error || 'Delete failed');
    }
  }

  function startEdit(st) {
    editingId = st.id;
    editName.value = st.name;
    editRoll.value = st.roll_no;
    editClass.value = st.class;
    editPanel.classList.remove('hidden');
  }

  cancelEdit.addEventListener('click', () => {
    editingId = null;
    editPanel.classList.add('hidden');
  });

  saveEdit.addEventListener('click', async () => {
    if (!editingId) return;
    const name = editName.value.trim();
    const roll_no = editRoll.value.trim();
    const studentClass = editClass.value.trim();
    if (!name || !roll_no || !studentClass) return alert('All fields required');
    try {
      await api(`/api/students/${editingId}`, 'PUT', { name, roll_no, class: studentClass });
      editingId = null;
      editPanel.classList.add('hidden');
      await load();
    } catch (err) {
      alert(err.error || 'Update failed');
    }
  });

  load();
})();
