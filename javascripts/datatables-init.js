function applyTableDirectives(scope = document) {
  scope.querySelectorAll("table").forEach((tbl) => {
    if (!tbl.tBodies || !tbl.tBodies[0]) return;
    const lastRow = tbl.tBodies[0].lastElementChild;
    if (!lastRow) return;

    const onlyCell = lastRow.children.length === 1 ? lastRow.children[0] : null;
    if (!onlyCell) return;

    const raw = onlyCell.textContent.trim();
    const match = raw.match(/^\{\s*:?(.*)\}$/);
    if (!match) return;

    const directive = match[1].trim();
    if (!directive) return;

    directive.split(/\s+/).forEach((token) => {
      if (!token) return;
      if (token.startsWith(".")) {
        tbl.classList.add(token.slice(1));
      } else if (token.startsWith("#")) {
        tbl.id = token.slice(1);
      } else {
        const [key, value] = token.split("=");
        if (key && value) {
          tbl.setAttribute(key, value.replace(/^"|"$/g, ""));
        }
      }
    });

    lastRow.remove();
    if (tbl.tBodies[0].children.length === 0) {
      tbl.tBodies[0].remove();
    }
  });
}

function initDataTables(scope = document) {
  applyTableDirectives(scope);

  scope.querySelectorAll("table.datatable").forEach((tbl) => {
    if ($.fn.dataTable.isDataTable(tbl)) return;
    $(tbl).DataTable({
      pageLength: 25,
      lengthMenu: [10, 25, 50, 100],
      ordering: true,
      searching: true
    });
  });
}

// Initial load + after Material’s instant page loads
document$.subscribe(() => initDataTables(document));
