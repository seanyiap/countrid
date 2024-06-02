import { Card, Text, Stack, Title, ScrollArea } from "@mantine/core";
import { getSavedValue } from "../../hooks/useLocalStorage";
import { FC } from "react";

interface FavouritedProps {}

const Favourited: FC<FavouritedProps> = () => {
  const favourites = getSavedValue("favourites", []);

  const isEmpty = favourites.length === 0;

  return (
    <Card shadow="sm" radius="md" withBorder>
      <Card.Section p="md" inheritPadding withBorder>
        <Title order={3}>Favourite Countries</Title>
      </Card.Section>

      <Card.Section p="md" inheritPadding>
        <ScrollArea h="10em">
          {isEmpty ? (
            <Text size="sm" c="dimmed">
              Click the star on each row to add your favourite countries to this
              list!
            </Text>
          ) : (
            <Stack>
              {favourites.map((country) => (
                <Text fw={500} size="md" key={country}>
                  {country}
                </Text>
              ))}
            </Stack>
          )}
        </ScrollArea>
      </Card.Section>
    </Card>
  );
};

export default Favourited;
