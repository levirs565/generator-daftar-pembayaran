import { IconButton } from "@chakra-ui/react";

export function FloatingActionButton(props) {
  return (
    <IconButton
      colorScheme="orange"
      isRound
      position={"fixed"}
      right={4}
      bottom={4}
      size="lg"
      {...props}
    />
  );
}
