function initDataTables(scope = document) {
  // Target only tables you explicitly mark up
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
