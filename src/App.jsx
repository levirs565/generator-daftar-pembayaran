import {
  ChakraProvider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  Flex,
  Heading,
  MenuButton,
  Menu,
  IconButton,
  MenuList,
  MenuItem,
  Portal,
  useDisclosure,
  VStack,
  Text,
} from "@chakra-ui/react";
import { RecipientListTab } from "./RecipientListTab";
import { LiabilityTypesTab } from "./LiabilityTypesTab";
import { GenerateModal } from "./GenerateModal";
import { HamburgerIcon } from "@chakra-ui/icons";
import { theme } from "./theme";
import { openDb } from "./db";
import { useEffect, useState } from "react";

function AppBar({ headerHeight, onGenereteItemClick }) {
  return (
    <Flex
      as="header"
      px={4}
      py={2}
      bg="pink.700"
      gap={2}
      alignItems="center"
      position="sticky"
      top={0}
      h={headerHeight}
      zIndex={100}
      shadow="lg"
    >
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Menu"
          icon={<HamburgerIcon boxSize={5} />}
          variant="ghost"
          color="white"
          _hover={{
            bg: "blackAlpha.300",
          }}
          _active={{
            bg: "blackAlpha.500",
          }}
          isRound
        />
        <Portal>
          <MenuList zIndex={200}>
            <MenuItem onClick={() => onGenereteItemClick()}>
              Hasilkan Dokumen
            </MenuItem>
          </MenuList>
        </Portal>
      </Menu>
      <Heading color="white" fontSize="lg">
        Generator Daftar Pembayaran
      </Heading>
    </Flex>
  );
}

function AppMain({ headerHeight, isGenerateModalOpen, onGenerateModalClose }) {
  return (
    <>
      <Tabs colorScheme="pink" variant="soft-rounded">
        <TabList
          zIndex={100}
          bg="pink.700"
          px={4}
          py={2}
          pos="sticky"
          top={headerHeight}
          shadow="lg"
        >
          <Tab textColor="white">Jenis Tanggungan</Tab>
          <Tab textColor="white">Daftar Penerima</Tab>
        </TabList>
        <TabPanels>
          <LiabilityTypesTab />
          <RecipientListTab />
        </TabPanels>
      </Tabs>
      <GenerateModal
        isOpen={isGenerateModalOpen}
        onClose={onGenerateModalClose}
      />
    </>
  );
}

function AppDBError({ message }) {
  return (
    <VStack p={4} textAlign="center" alignItems="center">
      <Heading>Kesalahan terjadi. Tidak dapat membuka basis data!</Heading>
      <Text fontSize="xl">
        Coba matikan mode penyamaran dan muat ulang aplikasi.
      </Text>
      <Text>Detail error:</Text>
      <Text>{message}</Text>
    </VStack>
  );
}

function App() {
  const {
    isOpen: isGenerateModalOpen,
    onOpen: onGenerateModalOpen,
    onClose: onGenerateModalClose,
  } = useDisclosure();

  const headerHeight = 14;
  const [dbState, setDbState] = useState({ type: "wait" });

  useEffect(() => {
    openDb()
      .then(() => {
        setDbState({ type: "opened" });
      })
      .catch((e) => {
        setDbState({ type: "error", message: e.message });
      });
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <AppBar
        headerHeight={headerHeight}
        onGenereteItemClick={onGenerateModalOpen}
      />
      {dbState.type === "opened" && (
        <AppMain
          headerHeight={headerHeight}
          isGenerateModalOpen={isGenerateModalOpen}
          onGenerateModalClose={onGenerateModalClose}
        />
      )}
      {dbState.type === "error" && <AppDBError message={dbState.message} />}
    </ChakraProvider>
  );
}

export default App;
