import "./App.css";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import CountryDataGrid from "./components/CountryDataGrid";
import InfoDrawer from "./components/InfoDrawer/InfoDrawer";
import { CountriesData } from "./types";
import {
  Container,
  Flex,
  Group,
  Image,
  List,
  Stack,
  Title,
  Text,
} from "@mantine/core";
import ThemeToggleButton from "./components/ThemeToggleButton";

function App() {
  const [isDrawerOpen, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [selectedCountry, setSelectedCountry] = useState<CountriesData | null>(
    null
  );

  const handleSelect = (country: CountriesData) => {
    setSelectedCountry(country);
    openDrawer();
  };

  return (
    <Flex>
      <Container fluid p="lg" flex="1" style={{ position: "relative" }}>
        <Flex py="md" direction="column">
          <Text className="landing-title" ta="center" variant="gradient">
            Countrid
          </Text>
          <Text size="md" c="dimmed" ta="center">
            All countries in a grid - that simple.
          </Text>
        </Flex>
        <ThemeToggleButton
          style={{ position: "absolute", top: 10, right: 10 }}
        />

        <CountryDataGrid handleSelect={handleSelect} />
      </Container>

      {selectedCountry && isDrawerOpen && (
        <InfoDrawer
          title={
            <Group>
              {selectedCountry.name.common}
              {/* <FavouriteButton
                countryCode={selectedCountry.cca2.toLowerCase()}
                onFavourite={onFavourite}
              /> */}
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
            <Text>Capital: {selectedCountry.capital ?? "-"}</Text>
            <Text>
              Population: {selectedCountry.population.toLocaleString("en-US")}
            </Text>
            <Text>
              Region: {selectedCountry.region} ({selectedCountry.subregion})
            </Text>
            <Text>
              Languages:{" "}
              {selectedCountry.languages &&
              Object.values(selectedCountry.languages).length ? (
                <List>
                  {Object.values(selectedCountry.languages).map((lang) => (
                    <List.Item>{lang}</List.Item>
                  ))}
                </List>
              ) : (
                "-"
              )}
            </Text>
            <Text>
              Currencies:{" "}
              {selectedCountry.currencies ? (
                <List>
                  {Object.values(selectedCountry.currencies).map((currency) => (
                    <List.Item>
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
