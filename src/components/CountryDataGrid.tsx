import { FC, useState, useEffect, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridOptions, RowClickedEvent } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { CountriesData } from "../types";
import FavouriteButton from "./FavouriteButton";
import { useLocalStorage } from "../hooks/useLocalStorage";

const API_ENDPOINT = "https://restcountries.com/v3.1/all";

interface CountryDataGridProps {
  handleSelect: (country: CountriesData) => void;
}

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

const actionsCellRenderer = ({ data, onFavourite }) => {
  let countryCode = data.cca2;
  return (
    <div className="grid-actions">
      <FavouriteButton countryCode={countryCode} onFavourite={onFavourite} />
    </div>
  );
};

const CountryDataGrid: FC<CountryDataGridProps> = ({ handleSelect }) => {
  const [rowData, setRowData] = useState([]);
  const [favourites, setFavourites] = useLocalStorage("favourites", []);
  const [, setViewed] = useLocalStorage("viewed", {});
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

  const onFavourite = (
    e: React.MouseEvent<HTMLButtonElement>,
    countryCode: string
  ) => {
    e.stopPropagation();
    if (!favourites.includes(countryCode)) {
      setFavourites((prev) => [...prev, countryCode]);
    } else {
      setFavourites(favourites.filter((fav) => fav !== countryCode));
    }
  };

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
      valueGetter: (p) => p.data.capital ?? "-",
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
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: actionsCellRenderer,
      cellRendererParams: {
        onFavourite,
      },
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

  const onRowClicked = useCallback(
    (event: RowClickedEvent) => {
      const data = event.data;
      const node = event.node;

      if (node.isSelected()) {
        handleSelect(node.data);
        setViewed((prev) => {
          if (data.name.common in prev) {
            return {
              ...prev,
              [data.name.common]: (prev[data.name.common] += 1),
            };
          } else {
            return {
              ...prev,
              [data.name.common]: (prev[data.name.common] = 1),
            };
          }
        });
      }
    },
    [handleSelect, setViewed]
  );

  return (
    <div
      className="ag-theme-alpine-dark"
      style={{
        height: "75vh",
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
        onRowClicked={onRowClicked}
      />
    </div>
  );
};

export default CountryDataGrid;
