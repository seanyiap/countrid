import { Card, Text, Group, Stack, Title, ScrollArea } from "@mantine/core";
import { getSavedValue } from "../../hooks/useLocalStorage";

export default function Viewed() {
  const viewed: { [key: string]: number } = getSavedValue("viewed", {});

  let topTenViewed = Object.entries(viewed)
    .sort(([, vA], [, vB]) => vB - vA)
    .slice(0, 10);

  const isEmpty = Object.keys(viewed).length === 0;

  return (
    <Card shadow="sm" radius="md" withBorder>
      <Card.Section p="md" inheritPadding withBorder>
        <Title order={3}>Most Viewed Countries</Title>
      </Card.Section>

      <Card.Section p="md" inheritPadding>
        <ScrollArea h="10em">
          {isEmpty ? (
            <Text size="sm" c="dimmed">
              The more countries you view, the more will appear here!
            </Text>
          ) : (
            <Stack>
              {topTenViewed.map(([country, count]) => (
                <Group key={country} justify="space-between">
                  <Text fw={500} size="md">
                    {country}
                  </Text>
                  <Text size="xs" color="dimmed">
                    {count} {count > 1 ? "times" : "time"}
                  </Text>
                </Group>
              ))}
            </Stack>
          )}
        </ScrollArea>
      </Card.Section>
    </Card>
  );
}
