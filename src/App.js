import {
  ChakraProvider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { useImmer } from "use-immer";
import { generateId } from "./util";
import { RecipientListTab } from "./RecipientListTab";
import { LialibilityTypesTab } from "./LialibilityTypesTab";
import { LialibilityTypeListContext } from "./LialibilityTypeListContext";

function App() {
  const [recipientList, updateRecipientList] = useImmer([]);
  const [lialibilityTypeList, updateLialibilityTypeList] = useImmer([
    {
      id: generateId(),
      nama: "Tanggungan 1",
      nominal: 2500,
    },
    {
      id: generateId(),
      nama: "Tanggungan 2",
      nominal: 4000,
    },
  ]);

  return (
    <ChakraProvider>
      <Tabs>
        <TabList position="sticky" top={0} zIndex={100} bg="white">
          <Tab>Daftar Penerima</Tab>
          <Tab>Jenis Tanggungan</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <LialibilityTypeListContext.Provider value={lialibilityTypeList}>
              <RecipientListTab
                list={recipientList}
                onUpdateList={updateRecipientList}
              />
            </LialibilityTypeListContext.Provider>
          </TabPanel>
          <TabPanel>
            <LialibilityTypesTab
              list={lialibilityTypeList}
              onUpdateList={updateLialibilityTypeList}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </ChakraProvider>
  );
}

export default App;
