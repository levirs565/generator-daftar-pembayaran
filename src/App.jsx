import {
  ChakraProvider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  Heading,
  MenuButton,
  Menu,
  IconButton,
  MenuList,
  MenuItem,
  Portal,
  useDisclosure,
} from "@chakra-ui/react";
import { RecipientListTab } from "./RecipientListTab";
import { LialibilityTypesTab } from "./LialibilityTypesTab";
import { GenerateModal } from "./GenerateModal";
import { HamburgerIcon } from "@chakra-ui/icons";
import { theme } from "./theme";

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
        >
          <Tab textColor="white">Jenis Tanggungan</Tab>
          <Tab textColor="white">Daftar Penerima</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <LialibilityTypesTab />
          </TabPanel>
          <TabPanel mb={16}>
            <RecipientListTab />
          </TabPanel>
        </TabPanels>
      </Tabs>
      <GenerateModal
        isOpen={isGenerateModalOpen}
        onClose={onGenerateModalClose}
      />
    </>
  );
}

function App() {
  const {
    isOpen: isGenerateModalOpen,
    onOpen: onGenerateModalOpen,
    onClose: onGenerateModalClose,
  } = useDisclosure();

  const headerHeight = 14;

  return (
    <ChakraProvider theme={theme}>
      <AppBar
        headerHeight={headerHeight}
        onGenereteItemClick={onGenerateModalOpen}
      />
      <AppMain
        headerHeight={headerHeight}
        isGenerateModalOpen={isGenerateModalOpen}
        onGenerateModalClose={onGenerateModalClose}
      />
    </ChakraProvider>
  );
}

export default App;
