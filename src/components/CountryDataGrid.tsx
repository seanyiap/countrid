import { FC, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridOptions } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { CountriesData } from "../types";

const API_ENDPOINT = "https://restcountries.com/v3.1/all";

interface CountryDataGridProps {}

const countryCellRenderer = ({ data }) => {
  return (
    <span>
      <img
        width="20px"
        alt={`${data.name.common} flag`}
        style={{ marginRight: 8 }}
        src={`https://flagcdn.com/h20/${data.cca2.toLowerCase()}.png`}
      />
      {data.name.common}
    </span>
  );
};

const CountryDataGrid: FC<CountryDataGridProps> = ({}) => {
  const [rowData, setRowData] = useState([]);
  const [error, setError] = useState(null);

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

  const columnDefs: ColDef[] = [
    {
      headerName: "Name",
      field: "name.common",
      sort: "asc",
      flex: 2,
      cellRenderer: countryCellRenderer,
    },
    {
      headerName: "Capital",
      field: "capital",
    },
    {
      headerName: "Languages",
      field: "languages",
      valueGetter: (p) =>
        p.data.languages ? Object.values(p.data.languages) : "-",
      flex: 2,
    },
    {
      headerName: "Population",
      field: "population",
      valueFormatter: (p) => {
        let num = parseFloat(p.data.population) ?? 0;
        return num.toLocaleString("en-US");
      },
    },
    {
      headerName: "Currencies",
      field: "currencies",
      valueGetter: (p) =>
        p.data.currencies ? Object.keys(p.data.currencies) : "-",
    },
  ];

  const gridOptions: GridOptions<CountriesData> = {
    defaultColDef: {
      flex: 1,
      editable: false,
      sortable: true,
      minWidth: 100,
      filter: true,
    },
    rowData: [],
    columnDefs: columnDefs,
    animateRows: true,
  };

  return (
    <div
      className="ag-theme-alpine"
      style={{
        height: "70vh",
        width: "100%",
      }}
    >
      <AgGridReact
        gridOptions={gridOptions}
        rowSelection={"single"}
        rowData={rowData}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={20}
      />
    </div>
  );
};

export default CountryDataGrid;
