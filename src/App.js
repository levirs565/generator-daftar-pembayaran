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

function App() {
  const [penerimaList, updatePenerimaList] = useImmer([]);
  const [jenisList, updateJenisList] = useImmer([
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
            <RecipientListTab
              list={penerimaList}
              jenisTanggunanList={jenisList}
              onUpdateList={updatePenerimaList}
            />
          </TabPanel>
          <TabPanel>
            <LialibilityTypesTab
              list={jenisList}
              onUpdateList={updateJenisList}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </ChakraProvider>
  );
}

export default App;
