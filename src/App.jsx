import {
  ChakraProvider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { useImmer } from "use-immer";
import { generateId } from "./util";
import { RecipientListTab } from "./RecipientListTab";
import { LialibilityTypesTab } from "./LialibilityTypesTab";
import { LialibilityTypeListContext } from "./LialibilityTypeListContext";
import { GenerateTab } from "./GenerateTab";

function App() {
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
    <ChakraProvider>
      <header>
        <Flex px={4} pt={4} pb={2} bg="pink.700" textColor="white">
          <Heading size="md">Generator Daftar Pembayaran</Heading>
        </Flex>
      </header>
      <Tabs colorScheme="pink" variant="soft-rounded">
        <TabList
          position="sticky"
          top={0}
          zIndex={100}
          bg="pink.700"
          px={4}
          py={2}
        >
          <Tab textColor="white">Jenis Tanggungan</Tab>
          <Tab textColor="white">Daftar Penerima</Tab>
          <Tab textColor="white">Hasilkan</Tab>
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
          <TabPanel>
            <GenerateTab
              recipientList={recipientList}
              lialibilityTypeList={lialibilityTypeList}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </ChakraProvider>
  );
}

export default App;
