import "./App.css";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import CountryDataGrid from "./components/DataGrid/CountryDataGrid";
import InfoDrawer from "./components/InfoDrawer/InfoDrawer";
import { CountriesData } from "./types";
import {
  Container,
  Flex,
  Group,
  Image,
  List,
  Stack,
  Text,
  SimpleGrid,
} from "@mantine/core";
import ThemeToggleButton from "./components/Buttons/ThemeToggleButton";
import Favourited from "./components/Cards/Favourited";
import Viewed from "./components/Cards/Viewed";
import FavouriteButton from "./components/Buttons/FavouriteButton";
import { useLocalStorage } from "./hooks/useLocalStorage";

function App() {
  const [isDrawerOpen, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [selectedCountry, setSelectedCountry] = useState<CountriesData | null>(
    null
  );
  const [favourites, setFavourites] = useLocalStorage("favourites", []);
  const [, setViewed] = useLocalStorage("viewed", {});

  const handleSelect = (country: CountriesData) => {
    setSelectedCountry(country);
    openDrawer();
    setViewed((prev) => {
      if (country.name.common in prev) {
        return {
          ...prev,
          [country.name.common]: (prev[country.name.common] += 1),
        };
      } else {
        return {
          ...prev,
          [country.name.common]: (prev[country.name.common] = 1),
        };
      }
    });
  };

  const handleFavourite = (
    e: React.MouseEvent<HTMLButtonElement>,
    country: string
  ) => {
    e.stopPropagation();
    if (!favourites.includes(country)) {
      setFavourites((prev) => [...prev, country]);
    } else {
      setFavourites(favourites.filter((fav) => fav !== country));
    }
  };

  return (
    <Flex>
      <Container
        fluid
        px="xl"
        py="md"
        flex="1"
        style={{ position: "relative" }}
      >
        <Flex py="md" direction="column">
          <Text className="landing-title" ta="center" variant="gradient">
            Countrid
          </Text>
          <Text size="lg" ta="center">
            All countries in a grid - that simple.
          </Text>
        </Flex>
        <ThemeToggleButton
          style={{ position: "absolute", top: 10, right: 10 }}
        />

        <Container fluid>
          <CountryDataGrid
            handleSelect={handleSelect}
            handleFavourite={handleFavourite}
          />
        </Container>

        <Container fluid p="md">
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <Favourited />
            <Viewed />
          </SimpleGrid>
        </Container>
      </Container>

      {selectedCountry && isDrawerOpen && (
        <InfoDrawer
          title={
            <Group>
              {selectedCountry.name.common}
              <FavouriteButton
                country={selectedCountry.name.common}
                handleFavourite={handleFavourite}
              />
            </Group>
          }
          data={selectedCountry}
          isOpen={isDrawerOpen}
          onClose={closeDrawer}
        >
          <Image
            fit="contain"
            py="xs"
            src={`https://flagcdn.com/${selectedCountry.cca2.toLowerCase()}.svg`}
            alt={`${selectedCountry.name.common} flag`}
          />

          <Stack>
            <Text>
              <b>Capital:</b> {selectedCountry.capital ?? "-"}
            </Text>
            <Text>
              <b>Population:</b>{" "}
              {selectedCountry.population.toLocaleString("en-US")}
            </Text>
            <Text>
              <b>Region:</b> {selectedCountry.region}{" "}
              {selectedCountry.subregion && `(${selectedCountry.subregion})`}
            </Text>
            <Text component={"span"}>
              <b>Languages:</b>{" "}
              {selectedCountry.languages &&
              Object.values(selectedCountry.languages).length ? (
                <List>
                  {Object.values(selectedCountry.languages).map((lang) => (
                    <List.Item key={lang}>{lang}</List.Item>
                  ))}
                </List>
              ) : (
                "-"
              )}
            </Text>
            <Text component={"span"}>
              <b>Currencies:</b>{" "}
              {selectedCountry.currencies ? (
                <List>
                  {Object.values(selectedCountry.currencies).map((currency) => (
                    <List.Item key={currency!.symbol}>
                      {currency!.name} ({currency!.symbol})
                    </List.Item>
                  ))}
                </List>
              ) : (
                "-"
              )}
            </Text>
          </Stack>
        </InfoDrawer>
      )}
    </Flex>
  );
}

export default App;
