class NoteGrid extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.notes = [];
    this.viewType = "active"; 

    this.shadowRoot.innerHTML = `
      <style>
        #grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 10px;
          align-items: stretch;
        }
      </style>
      <div id="grid"></div>`;
  }

  connectedCallback() {
    this.render();
    document.addEventListener("note-changed", () => this.refreshNotes());
  }

  set data(notes) {
    this.notes = notes;
    this.render();
  }

  set view(type) {
    this.viewType = type;
    this.render();
  }

  render(data = this.notes) {
    const grid = this.shadowRoot.getElementById("grid");
    grid.innerHTML = "";

    // Filter archive
    const filtered = data.filter((note) =>
      this.viewType === "archived" ? note.archived : !note.archived
    );

    filtered.forEach((note) => {
      const noteElement = document.createElement("note-item");
      noteElement.setAttribute("data-id", note.id);
      noteElement.setAttribute("data-title", note.title);
      noteElement.setAttribute("data-body", note.body);
      noteElement.setAttribute("data-createdAt", note.createdAt);
      noteElement.setAttribute("data-archived", note.archived);

      // ✅ Forward event archive-note & unarchive-note ke luar Shadow DOM
      noteElement.addEventListener("archive-note", (e) => {
        this.dispatchEvent(new CustomEvent("archive-note", {
          detail: e.detail,
          bubbles: true,
          composed: true,
        }));
      });

      noteElement.addEventListener("unarchive-note", (e) => {
        this.dispatchEvent(new CustomEvent("unarchive-note", {
          detail: e.detail,
          bubbles: true,
          composed: true,
        }));
      });

      grid.appendChild(noteElement);
    });
  }

  refreshNotes() {
    this.render(this.notes);
  }

  // Filter berdasarkan judul
  filterNotes(query) {
    const filtered = this.notes
      .filter((note) => note.title.toLowerCase().includes(query.toLowerCase()))
      .filter((note) =>
        this.viewType === "archived" ? note.archived : !note.archived
      );
    this.render(filtered);
  }

  // Urutkan berdasarkan waktu
  sortNotes(order) {
    const filtered = this.notes.filter((note) =>
      this.viewType === "archived" ? note.archived : !note.archived
    );
    const sorted = [...filtered].sort((a, b) =>
      order === "old"
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt)
    );
    this.render(sorted);
  }
}

customElements.define("note-grid", NoteGrid);
