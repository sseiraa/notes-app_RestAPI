import { updateNote, deleteNote, archiveNote, unarchiveNote } from "../data/notesService.js";

class NoteItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this._addEventListeners(this.noteData.id);
  }

  render() {
    const id = this.getAttribute("data-id");
    const title = this.getAttribute("data-title");
    const body = this.getAttribute("data-body");
    const createdAt = this.getAttribute("data-createdAt");
    this.archived = this.getAttribute("data-archived") === "true";

    this.noteData = {
      id,
      title,
      body,
      createdAt,
      archived: this.archived,
    };

    this.shadowRoot.innerHTML = `
      <style>
          .note-item {
              background: linear-gradient(to right, #f7f2eb, #bad0e7);
              box-shadow: 0 2px 5px rgba(0,0,0,0.1);
              border-radius: 10px;
              padding: 1.5rem;
              transition: transform 0.2s ease-in-out;
          }
          .note-item:hover {
              transform: scale(1.02);
          }
          .note-actions {
              display: flex;
              gap: 10px;
              margin-top: 10px;
              flex-wrap: wrap;
          }
          button {
              background-color: #7096d1;
              color: white;
              padding: 8px;
              border-radius: 6px;
              font-size: 14px;
              cursor: pointer;
              transition: background-color 0.3s ease;
              border: none;
          }
          button:hover {
              background-color: #334eac;
          }
          .created-at {
              font-size: 0.8em;
              color: #999;
              margin-top: 5px;
          }
          .edit-form {
              margin-top: 10px;
          }
          .edit-form input, .edit-form textarea {
              width: 100%;
              margin-bottom: 10px;
          }
      </style>
      <div class="note-item">
          <h3>${title}</h3>
          <p>${body}</p>
          <div class="created-at">Created: ${new Date(createdAt).toLocaleString()}</div>
          <div class="note-actions">
              <button class="edit-btn">Edit</button>
              <button class="delete-btn">Delete</button>
              <button class="archive-btn">${this.archived ? "Unarchive" : "Archive"}</button>
          </div>
          <div class="edit-form" style="display: none;">
              <input type="text" class="edit-title" value="${title}" />
              <textarea class="edit-body">${body}</textarea>
              <button class="save-edit-btn">Save</button>
          </div>
      </div>
    `;
  }

  _addEventListeners(id) {
    this.shadowRoot.querySelector(".edit-btn").addEventListener("click", () => this.showEditForm());
    this.shadowRoot.querySelector(".save-edit-btn").addEventListener("click", () => this.saveEdit(id));
    this.shadowRoot.querySelector(".delete-btn").addEventListener("click", () => this.delete(id));
    this.shadowRoot.querySelector(".archive-btn").addEventListener("click", () => this.toggleArchive(id));
  }

  showEditForm() {
    const editForm = this.shadowRoot.querySelector(".edit-form");
    editForm.style.display = editForm.style.display === "none" ? "block" : "none";
  }

  async saveEdit(id) {
    const newTitle = this.shadowRoot.querySelector(".edit-title").value;
    const newBody = this.shadowRoot.querySelector(".edit-body").value;

    if (!newTitle.trim() || !newBody.trim()) {
      alert("Title and Body cannot be empty!");
      return;
    }

    try {
      const updatedNote = { title: newTitle, body: newBody };
      await updateNote(id, updatedNote);
      this.dispatchRefreshEvent();
    } catch (error) {
      alert("Failed to update note. Please try again.");
    }
  }

  async delete(id) {
    try {
      await deleteNote(id);
      this.remove();
      this.dispatchRefreshEvent();
    } catch (error) {
      alert("Failed to delete note. Please try again.");
    }
  }

  async toggleArchive(id) {
    try {
      const isArchived = this.noteData.archived;

      if (isArchived) {
        const confirmUnarchive = confirm("Apakah anda ingin mengembalikan catatan ini?");
        if (!confirmUnarchive) return;
        await unarchiveNote(id);
        this.dispatchEvent(new CustomEvent("unarchive-note", {
          detail: { noteId: id },
          bubbles: true,
          composed: true,
        }));
      } else {
        const confirmArchive = confirm("Apakah anda ingin mengarsipkan catatan ini?");
        if (!confirmArchive) return;
        await archiveNote(id);
        this.dispatchEvent(new CustomEvent("archive-note", {
          detail: { noteId: id },
          bubbles: true,
          composed: true,
        }));
      }

      this.noteData.archived = !isArchived;
      this.updateArchiveButton();
      this.dispatchRefreshEvent();
    } catch (error) {
      alert("Failed to change archive status. Please try again.");
    }
  }

  updateArchiveButton() {
    const archiveButton = this.shadowRoot.querySelector(".archive-btn");
    archiveButton.textContent = this.noteData.archived ? "Unarchive" : "Archive";
  }

  dispatchRefreshEvent() {
    this.dispatchEvent(new CustomEvent("note-changed", { bubbles: true, composed: true }));
  }
}

customElements.define("note-item", NoteItem);
