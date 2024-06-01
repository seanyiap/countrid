import { FC } from "react";
import classes from "./InfoDrawer.module.css";
import { Group, Text, CloseButton, ScrollArea } from "@mantine/core";
import { CountriesData } from "../../types";

interface InfoDrawerProps {
  data: Partial<CountriesData>;
  isOpen: boolean;
  onClose: () => void;
  title?: string | React.ReactNode;
  children?: React.ReactNode;
}

const InfoDrawer: FC<InfoDrawerProps> = ({
  data = {},
  isOpen,
  onClose,
  title,
  children,
}) => {
  return (
    <div className={classes.drawer}>
      <ScrollArea h="100vh">
        <Group className={classes["drawer-header"]}>
          <Text size="xl" fw={500} flex="1">
            {title}
          </Text>
          <CloseButton
            className={classes["drawer-close-btn"]}
            title="Close"
            size="lg"
            iconSize={20}
            onClick={onClose}
          />
        </Group>
        <div className={classes["drawer-content"]}>{children}</div>
      </ScrollArea>
    </div>
  );
};

export default InfoDrawer;
