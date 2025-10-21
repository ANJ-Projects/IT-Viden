function applyTableDirectives(scope = document) {
  scope.querySelectorAll("table").forEach((tbl) => {
    const rows = Array.from(tbl.querySelectorAll("tr"));
    let mutated = false;

    rows.forEach((row) => {
      if (row.children.length !== 1) return;

      const onlyCell = row.children[0];
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

      row.remove();
      mutated = true;
    });

    if (mutated) {
      Array.from(tbl.tBodies || []).forEach((tbody) => {
        if (tbody.children.length === 0) {
          tbody.remove();
        }
      });
    }
  });
}

function initDataTables(scope = document) {
  applyTableDirectives(scope);

  if (!window.jQuery || !window.jQuery.fn || !window.jQuery.fn.DataTable) {
    return;
  }

  scope.querySelectorAll("table.datatable").forEach((tbl) => {
    if (window.jQuery.fn.dataTable && window.jQuery.fn.dataTable.isDataTable(tbl)) return;
    window.jQuery(tbl).DataTable({
      pageLength: 25,
      lengthMenu: [10, 25, 50, 100],
      ordering: true,
      searching: true
    });
  });
}

function resolveScope(candidate) {
  if (!candidate) return document;
  if (candidate instanceof Document) return candidate;
  if (candidate.document instanceof Document) return candidate.document;
  return document;
}

function bootstrap(scope) {
  initDataTables(resolveScope(scope));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => bootstrap(document));
} else {
  bootstrap(document);
}

if (typeof window !== "undefined" && typeof window.document$ !== "undefined" && window.document$) {
  window.document$.subscribe((event) => {
    bootstrap(event);
  });
}
