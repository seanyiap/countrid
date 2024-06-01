import { FC, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const API_ENDPOINT = "https://restcountries.com/v3.1/all";

interface CountryDataGridProps {}

const CountryDataGrid: FC<CountryDataGridProps> = ({}) => {
  const [rowData, setRowData] = useState([]);
  const [error, setError] = useState(null);

  const columnDefs: ColDef[] = [
    {
      headerName: "Name",
      field: "name.common",
    },
    {
      headerName: "Capital",
      field: "capital",
    },
  ];

  useEffect(() => {
    const fetchGridData = async () => {
      try {
        const response = await fetch(API_ENDPOINT);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setRowData(data);
      } catch (e) {
        setError(e.message);
      }
    };
    fetchGridData();
  }, []);

  return (
    <div
      className="ag-theme-alpine"
      style={{
        height: "70vh",
        width: "100%",
      }}
    >
      <AgGridReact
        defaultColDef={{ sortable: true, filter: true }}
        rowData={rowData}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={20}
      />
    </div>
  );
};

export default CountryDataGrid;
