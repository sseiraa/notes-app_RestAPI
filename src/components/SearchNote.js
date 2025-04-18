class SearchNote extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <div class="search-container">
          <input id="searchBookTitle" type="text" placeholder="Search title note" />
          <button id="searchSubmit">Search</button>
        </div>
      `;

    // Event untuk pencarian
    this.querySelector("#searchSubmit").addEventListener("click", () =>
      this.searchNotes(),
    );
    this.querySelector("#searchBookTitle").addEventListener("input", () =>
      this.searchNotes(),
    );
  }

  searchNotes() {
    const query = this.querySelector("#searchBookTitle").value.toLowerCase();
    const noteGrid = document.querySelector("note-grid");

    if (noteGrid) {
      noteGrid.filterNotes(query);
    }
  }
}

customElements.define("search-note", SearchNote);
