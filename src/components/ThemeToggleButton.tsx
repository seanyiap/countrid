import { useMantineColorScheme, ActionIcon } from "@mantine/core";
import { FC } from "react";
import { SunIcon, MoonIcon } from "../icons";

interface ThemeToggleButtonProps {
  style?: React.CSSProperties;
}

const ThemeToggleButton: FC<ThemeToggleButtonProps> = ({ ...props }) => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <ActionIcon
      variant="outline"
      color={colorScheme === "dark" ? "yellow" : "blue"}
      onClick={() => toggleColorScheme()}
      title="Toggle color scheme"
      {...props}
    >
      {colorScheme === "dark" ? <SunIcon /> : <MoonIcon />}
    </ActionIcon>
  );
};

export default ThemeToggleButton;
