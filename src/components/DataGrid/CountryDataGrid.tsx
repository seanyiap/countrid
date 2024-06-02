import { FC, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridOptions, RowClickedEvent } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { CountriesData } from "../../types";
import FavouriteButton from "../Buttons/FavouriteButton";
import { useMantineColorScheme, Group } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

const API_ENDPOINT = "https://restcountries.com/v3.1/all";

interface CountryDataGridProps {
  handleSelect: (country: CountriesData) => void;
  handleFavourite: (
    e: React.MouseEvent<HTMLButtonElement>,
    country: string
  ) => void;
}

const countryCellRenderer = ({ data }) => {
  return (
    <span>
      <img
        width="20"
        alt={`${data.name.common} flag`}
        style={{ marginRight: 8 }}
        src={`https://flagcdn.com/${data.cca2.toLowerCase()}.svg`}
      />
      {data.name.common}
    </span>
  );
};

const actionsCellRenderer = ({ data, handleFavourite }) => {
  let country = data.name.common;
  return (
    <Group gap="0" justify="center" className="grid-actions">
      <FavouriteButton country={country} handleFavourite={handleFavourite} />
    </Group>
  );
};

const loadingCellRenderer = ({ loadingMessage }) => {
  return (
    <div
      className="ag-custom-loading-cell"
      style={{ paddingLeft: "10px", lineHeight: "25px" }}
    >
      <i className="fas fa-spinner fa-pulse"></i> <span> {loadingMessage}</span>
    </div>
  );
};

const fetchGridData = async () => {
  try {
    const response = await fetch(API_ENDPOINT);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (err) {
    throw new Error("Failed to fetch countries. Will retry for a few times.");
  }
};

const CountryDataGrid: FC<CountryDataGridProps> = ({
  handleSelect,
  handleFavourite,
}) => {
  const { colorScheme } = useMantineColorScheme();
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["gridData"],
    queryFn: fetchGridData,
  });

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
        handleFavourite,
      },
      flex: -1,
      floatingFilter: false,
    },
  ];

  const gridOptions: GridOptions<CountriesData> = {
    defaultColDef: {
      flex: 1,
      editable: false,
      sortable: true,
      minWidth: 100,
      filter: true,
      floatingFilter: true,
    },
    rowData: [],
    columnDefs: columnDefs,
    animateRows: true,
    noRowsOverlayComponent: loadingCellRenderer,
    noRowsOverlayComponentParams: {
      loadingMessage: "One moment please...",
    },
  };

  const onRowClicked = useCallback(
    (event: RowClickedEvent) => {
      const data = event.data;
      const node = event.node;

      if (node.isSelected()) {
        handleSelect(data);
      }
    },
    [handleSelect]
  );

  return (
    <div
      className={`ag-theme-alpine${colorScheme === "dark" ? "-dark" : ""}`}
      style={{
        height: "75vh",
        width: "100%",
      }}
    >
      <AgGridReact
        gridOptions={gridOptions}
        rowSelection={"single"}
        rowData={data}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={20}
        onRowClicked={onRowClicked}
        reactiveCustomComponents
      />
    </div>
  );
};

export default CountryDataGrid;
