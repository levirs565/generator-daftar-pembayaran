import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  ChakraProvider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Grid,
  IconButton,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Select,
  Divider,
  Table,
  Thead,
  Th,
  Tr,
  Tbody,
  Td,
  Tfoot,
  Flex,
} from "@chakra-ui/react";
import { Fragment, useEffect, useMemo, useReducer, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { useImmer, useImmerReducer } from "use-immer";
import { generateId, getItemById, removeItemById } from "./util";

function TanggunganTable({ body, footer }) {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th width={"70%"}>Nama</Th>
          <Th>Nominal</Th>
          <Th width={"40px"}></Th>
        </Tr>
      </Thead>
      <Tbody>{body}</Tbody>
      <Tfoot>{footer}</Tfoot>
    </Table>
  );
}

function TabJenisTanggungan({ list, onUpdateList }) {
  function addItem() {
    onUpdateList((draft) => {
      draft.push({
        id: generateId(),
        nama: "",
        nominal: 0,
      });
    });
  }

  return (
    <TanggunganTable
      body={list.map((item) => (
        <Tr key={item.id}>
          <Td>
            <Input
              value={item.nama}
              placeholder="Nama"
              onChange={(e) =>
                onUpdateList((draft) => {
                  getItemById(draft, item.id).nama = e.target.value;
                })
              }
            />
          </Td>
          <Td>
            <Input
              as={CurrencyInput}
              intlConfig={{ locale: "id-ID", currency: "IDR" }}
              value={item.nominal}
              onValueChange={(e) =>
                onUpdateList((draft) => {
                  getItemById(draft, item.id).nominal = parseInt(e);
                })
              }
            />
          </Td>
          <Td>
            <IconButton
              aria-label="Remove Current Item"
              colorScheme="red"
              icon={<DeleteIcon />}
              onClick={() =>
                onUpdateList((draft) => {
                  removeItemById(draft, item.id);
                })
              }
            />
          </Td>
        </Tr>
      ))}
      footer={
        <Tr>
          <Th></Th>
          <Th colSpan={2}>
            <Button colorScheme="orange" onClick={addItem} width={"100%"}>
              Tambah Jenis
            </Button>
          </Th>
        </Tr>
      }
    />
  );
}

function JenisTanggunganSelect({ value, onValueChange, jenisList }) {
  return (
    <Select
      value={value}
      onChange={onValueChange}
      placeholder="Pilih Jenis Tanggungan"
    >
      {jenisList.map((item) => (
        <option key={item.id} value={item.id}>
          {item.nama}
        </option>
      ))}
    </Select>
  );
}

function TanggunganPenerima({ list, onUpdateList, jenisList }) {
  const [selectedJenis, setSelectedJenis] = useState("");
  const unusedJenisList = useMemo(
    () =>
      jenisList.filter(
        (jenis) =>
          list.findIndex((tanggungan) => tanggungan.id === jenis.id) === -1
      ),
    [jenisList, list]
  );
  return (
    <TanggunganTable
      body={list.map((item) => (
        <Tr key={item.id}>
          <Td>{getItemById(jenisList, item.id).nama}</Td>
          <Td>
            <Input
              as={CurrencyInput}
              intlConfig={{ locale: "id-ID", currency: "IDR" }}
              value={item.nominal}
              onValueChange={(e) =>
                onUpdateList((draft) => {
                  getItemById(draft, item.id).nominal = parseInt(e);
                })
              }
            />
          </Td>
          <Td>
            <IconButton
              aria-label="Remove Current Item"
              colorScheme="red"
              onClick={() =>
                onUpdateList((draft) => {
                  removeItemById(draft, item.id);
                })
              }
              icon={<DeleteIcon />}
            />
          </Td>
        </Tr>
      ))}
      footer={
        unusedJenisList.length > 0 && (
          <Tr>
            <Th>
              <JenisTanggunganSelect
                value={selectedJenis}
                onValueChange={(e) => setSelectedJenis(e.target.value)}
                jenisList={unusedJenisList}
              />
            </Th>
            <Th colSpan={2}>
              <Button
                colorScheme="orange"
                width="100%"
                isDisabled={selectedJenis === ""}
                onClick={(e) => {
                  onUpdateList((draft) => {
                    draft.push({
                      id: selectedJenis,
                      nominal: getItemById(jenisList, selectedJenis).nominal,
                    });
                  });
                  setSelectedJenis("");
                }}
              >
                Tambah Tanggungan
              </Button>
            </Th>
          </Tr>
        )
      }
    />
  );
}

function TabDaftarPenerima({ list, onUpdateList, jenisTanggunanList }) {
  return (
    <>
      <VStack alignItems="stretch" gap={4}>
        {list.map((item, index) => (
          <Card key={item.id}>
            <CardBody>
              <VStack alignItems={"stretch"}>
                <Heading size={"sm"}>Penerima ke {index + 1}</Heading>
                <Input
                  value={item.nama}
                  placeholder="Nama Penerima"
                  onChange={(e) =>
                    onUpdateList((draft) => {
                      getItemById(draft, item.id).nama = e.target.value;
                    })
                  }
                />
                <Heading size={"sm"}>Tanggungan</Heading>
                <TanggunganPenerima
                  list={item.tanggungan}
                  jenisList={jenisTanggunanList}
                  onUpdateList={(fn) => {
                    onUpdateList((draft) => {
                      fn(getItemById(draft, item.id).tanggungan);
                    });
                  }}
                />
              </VStack>
            </CardBody>
          </Card>
        ))}
      </VStack>
      <IconButton
        aria-label="Tambah Penerima"
        colorScheme="orange"
        onClick={() =>
          onUpdateList((draft) => {
            draft.push({
              id: generateId(),
              nama: "",
              tanggungan: [],
            });
          })
        }
        icon={<AddIcon />}
        isRound
        position={"fixed"}
        right={4}
        bottom={4}
        size="lg"
      />
    </>
  );
}

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
            <TabDaftarPenerima
              list={penerimaList}
              jenisTanggunanList={jenisList}
              onUpdateList={updatePenerimaList}
            ></TabDaftarPenerima>
          </TabPanel>
          <TabPanel>
            <TabJenisTanggungan
              list={jenisList}
              onUpdateList={updateJenisList}
            ></TabJenisTanggungan>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </ChakraProvider>
  );
}

export default App;
