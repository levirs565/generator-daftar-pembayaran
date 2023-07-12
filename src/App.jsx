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
import { useImmer } from "use-immer";
import { generateId } from "./util";
import { RecipientListTab } from "./RecipientListTab";
import { LialibilityTypesTab } from "./LialibilityTypesTab";
import { LialibilityTypeListContext } from "./LialibilityTypeListContext";
import { GenerateModal } from "./GenerateModal";
import { HamburgerIcon } from "@chakra-ui/icons";

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
  const [recipientList, updateRecipientList] = useImmer([]);
  const [lialibilityTypeList, updateLialibilityTypeList] = useImmer([
    {
      id: generateId(),
      name: "Tanggungan 1",
      amount: 2500,
    },
    {
      id: generateId(),
      name: "Tanggungan 2",
      amount: 4000,
    },
  ]);
  return (
    <>
      <Tabs colorScheme="pink" variant="soft-rounded" isLazy>
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
            <LialibilityTypesTab
              list={lialibilityTypeList}
              onUpdateList={updateLialibilityTypeList}
            />
          </TabPanel>
          <TabPanel>
            <LialibilityTypeListContext.Provider value={lialibilityTypeList}>
              <RecipientListTab
                list={recipientList}
                onUpdateList={updateRecipientList}
              />
            </LialibilityTypeListContext.Provider>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <GenerateModal
        isOpen={isGenerateModalOpen}
        onClose={onGenerateModalClose}
        lialibilityTypeList={lialibilityTypeList}
        recipientList={recipientList}
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
    <ChakraProvider>
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
