const notes = [];
let editingId = null;

const form = document.getElementById('note-form');
const input = document.getElementById('note-input');
const notesList = document.getElementById('notes-list');

function renderNotes() {
  notesList.innerHTML = '';

  if (notes.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'note-text';
    emptyMessage.textContent = 'No hay notas todavía. Agrega una nueva nota arriba.';
    notesList.appendChild(emptyMessage);
    return;
  }

  notes.forEach((note) => {
    const item = document.createElement('li');
    item.className = 'note-item';

    const content = document.createElement('p');
    content.className = 'note-text';
    content.textContent = note.text;

    const actions = document.createElement('div');
    actions.className = 'note-actions';

    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.textContent = 'Editar';
    editButton.addEventListener('click', () => startEditing(note.id, content, editButton));

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = 'Borrar';
    deleteButton.className = 'delete';
    deleteButton.addEventListener('click', () => deleteNote(note.id));

    actions.append(editButton, deleteButton);
    item.append(content, actions);
    notesList.appendChild(item);
  });
}

function addNote(text) {
  const note = {
    id: Date.now().toString(),
    text: text.trim(),
  };
  notes.push(note);
  renderNotes();
}

function deleteNote(noteId) {
  const index = notes.findIndex((note) => note.id === noteId);
  if (index === -1) return;
  notes.splice(index, 1);
  if (editingId === noteId) {
    editingId = null;
    input.value = '';
  }
  renderNotes();
}

function startEditing(noteId, contentElement, button) {
  if (editingId === noteId) {
    saveEdit(noteId, contentElement, button);
    return;
  }

  if (editingId) {
    renderNotes();
  }

  editingId = noteId;
  const note = notes.find((item) => item.id === noteId);
  if (!note) return;

  const inputEdit = document.createElement('input');
  inputEdit.type = 'text';
  inputEdit.value = note.text;
  inputEdit.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      saveEdit(noteId, contentElement, button);
    }
    if (event.key === 'Escape') {
      renderNotes();
      editingId = null;
    }
  });

  contentElement.replaceWith(inputEdit);
  button.textContent = 'Guardar';
  button.dataset.editing = 'true';
  inputEdit.focus();
}

function saveEdit(noteId, contentElement, button) {
  const note = notes.find((item) => item.id === noteId);
  if (!note) return;

  const noteItem = button.closest('.note-item');
  const inputEdit = noteItem ? noteItem.querySelector('input') : null;
  if (!inputEdit) {
    renderNotes();
    editingId = null;
    return;
  }

  const updatedText = inputEdit.value.trim();
  if (updatedText) {
    note.text = updatedText;
  }
  editingId = null;
  renderNotes();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addNote(text);
  input.value = '';
  input.focus();
});

renderNotes();
