import React, { useState, useRef, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./App.css";

import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

export default function App() {
  const [rowData, setRowData] = useState([
    { name: "Sow", design: "Trainee", age: 21 },
    { name: "Prathiksha", design: "Tech Lead", age: 27 },
    { name: "Jeevan", design: "Developer", age: 23 },
    { name: "Pricilla", design: "Software Developer", age: 24 },
    { name: "Varshni", design: "Developer", age: 22 },
    { name: "Joe", design: "Tester", age: 23 },
  ]);

  // AG Grid ref 
  const gridRef = useRef(null);

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Name",
        field: "name",
        headerCheckboxSelection: true,
        checkboxSelection: true,
        sortable: true,
        editable: true,
      },
      {
        headerName: "Designation",
        field: "design",
        sortable: true,
        editable: true,
      },
      { 
        headerName: "Age",
        field: "age",
        sortable: true, 
        editable: true 
      },
      {
        headerName: "Actions",
        field: "actions",
        cellRenderer: (params) => (
          <button
            style={{
              cursor: "pointer",
              backgroundColor: "red",
              color: "white",
              border: "none",
              padding: "4px 8px",
            }}
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this row?")) {
                params.api.applyTransaction({ remove: [params.data] });
              }
            }}
          >
            Delete
          </button>
        ),
        flex: 0.5,
        minWidth: 100,
        sortable: false,
        filter: false,
      },
    ],
    []
  );

  const defaultColDef = { resizable: true, flex: 1 };

  // search (quick filter)
  const onSearch = (e) => {
    if (gridRef.current) {
      gridRef.current.api.setGridOption('quickFilterText', e.target.value.trim());
    }
  };

  // add row
  const addRow = () => {
    const newRow = { name: "", design: "", age: null };
    gridRef.current.api.applyTransaction({
      add: [newRow],
      addIndex: rowData.length,
    });
    setRowData([...rowData,newRow])
    console.log(rowData.length)
  };
  

  // delete selected rows
  const deleteRows = () => {
    const selected = gridRef.current.api.getSelectedRows();
    if (!selected.length) {
      alert("Select rows to delete.");
      return;
    }
    if (
      window.confirm(
        `Are you sure you want to delete ${selected.length} selected row(s)?`
      )
    ) {
      gridRef.current.api.applyTransaction({ remove: selected });
    }
  };

  // show data
  const showData = () => {
    gridRef.current.api.stopEditing();
    const all = [];
    gridRef.current.api.forEachNode((n) => all.push(n.data));
    console.log("Grid data:", all);
    alert("Check console.");
  };

  return (
    <div>
      <h2>Employee Details</h2>

      <div className="controls">
        <input type="search" placeholder="Search..." onChange={onSearch} />
        <button onClick={addRow} style={{ backgroundColor: "rgb(66, 225, 66)" }}>
          Add
        </button>
        <button
          onClick={deleteRows}
          style={{ backgroundColor: "rgb(252, 34, 34)" }}
        >
          Delete
        </button>
        <button
          onClick={showData}
          style={{ backgroundColor: "rgb(231, 165, 42)" }}
        >
          Show
        </button>
      </div>

      <div className="ag-theme-alpine">
        <AgGridReact
          ref={gridRef} // direct reference for grid api obj
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection="multiple"
          pagination={true}
          domLayout="autoHeight"
        />
      </div>
    </div>
  );
}
