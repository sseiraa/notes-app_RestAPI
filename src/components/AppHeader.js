class AppHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <header class="app-header">
            <h2>Notes App</h2>
            <div class="header-buttons">
                <button class="head-button" id="oldNotesBtn">Old Notes</button>
                <button class="head-button" id="latestNotesBtn">Latest Notes</button>
            </div>
        </header>`;

    this.querySelector("#oldNotesBtn").addEventListener("click", () =>
      this.sortNotes("old"),
    );
    this.querySelector("#latestNotesBtn").addEventListener("click", () =>
      this.sortNotes("latest"),
    );
  }

  sortNotes(order) {
    const noteGrid = document.querySelector("note-grid");
    if (noteGrid) {
      noteGrid.sortNotes(order);

      //Filter note
      this.querySelector("#oldNotesBtn").classList.toggle(
        "active",
        order === "old",
      );
      this.querySelector("#latestNotesBtn").classList.toggle(
        "active",
        order === "latest",
      );
    }
  }
}

customElements.define("app-header", AppHeader);
