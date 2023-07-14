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
  VStack,
  Text,
  useToast,
  VisuallyHiddenInput,
} from "@chakra-ui/react";
import { RecipientListTab } from "./RecipientListTab";
import { LiabilityTypesTab } from "./LiabilityTypesTab";
import { GenerateModal } from "./GenerateModal";
import { HamburgerIcon } from "@chakra-ui/icons";
import { theme } from "./theme";
import { clearDb, dbImportData, getExportData, openDb } from "./db";
import { createRef, useEffect, useState } from "react";
import { catchRethrow, downloadBlob } from "./util";
import { GlobalToastContext, catchWithToast } from "./toastUtil";
import NiceModal from "@ebay/nice-modal-react";

const dataFileExtenstion = "daftar-pembayaran";

function AppBar({
  headerHeight,
  onGenereteItemClick,
  onExportDataClick,
  onImportDataClick,
  onClearDataClick,
}) {
  const importFileInputRef = createRef();
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
            <VisuallyHiddenInput
              type="file"
              ref={importFileInputRef}
              onChange={(e) => onImportDataClick(e.target.files[0])}
              accept={`.${dataFileExtenstion}`}
            />
            <MenuItem
              onClick={() =>
                "showPicker" in HTMLInputElement.prototype
                  ? importFileInputRef.current.showPicker()
                  : importFileInputRef.current.click()
              }
            >
              Impor Data
            </MenuItem>
            <MenuItem onClick={onExportDataClick}>Ekspor Data</MenuItem>
            <MenuItem onClick={onClearDataClick}>Bersihkan Data</MenuItem>
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

function AppMain({ headerHeight }) {
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

async function importData(file) {
  const text = await file.text();
  const data = catchRethrow(
    () => JSON.parse(text),
    SyntaxError,
    "Berkas tidak valid"
  );
  return dbImportData(data);
}

async function exportData() {
  const data = await getExportData();
  const blob = new Blob([JSON.stringify(data)], {
    type: "application/json",
  });
  downloadBlob(
    blob,
    `Data Daftar Pembayaran ${Date.now()}.${dataFileExtenstion}`
  );
}

function App() {
  const headerHeight = 14;
  const [dbState, setDbState] = useState({ type: "wait" });
  const toast = useToast();

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
      <NiceModal.Provider>
        <GlobalToastContext.Provider value={toast}>
          <AppBar
            headerHeight={headerHeight}
            onGenereteItemClick={() => {
              if (dbState.type === "opened") NiceModal.show(GenerateModal);
            }}
            onImportDataClick={(file) => {
              if (dbState.type === "opened" && file) {
                catchWithToast(toast, "Gagal Mengimpor Data", importData(file));
              }
            }}
            onExportDataClick={() => {
              if (dbState.type === "opened") {
                catchWithToast(toast, "Gagal Mengekspor Data", exportData());
              }
            }}
            onClearDataClick={() => {
              if (dbState.type === "opened") {
                catchWithToast(toast, "Gagal Membersihkan Data", clearDb());
              }
            }}
          />
          {dbState.type === "opened" && <AppMain headerHeight={headerHeight} />}
          {dbState.type === "error" && <AppDBError message={dbState.message} />}
        </GlobalToastContext.Provider>
      </NiceModal.Provider>
    </ChakraProvider>
  );
}

export default App;
