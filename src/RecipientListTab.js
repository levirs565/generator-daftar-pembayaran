import { AddIcon } from "@chakra-ui/icons";
import {
  VStack,
  Input,
  IconButton,
  Card,
  CardBody,
  Heading,
} from "@chakra-ui/react";
import { RecipientLiabilityList } from "./RecipientLiabilityList";
import { generateId, getItemById } from "./util";

function RecipientItem({ recipient, index, onUpdate, jenisTanggunanList }) {
  return (
    <Card key={recipient.id}>
      <CardBody>
        <VStack alignItems={"stretch"}>
          <Heading size={"sm"}>Penerima ke {index + 1}</Heading>
          <Input
            value={recipient.nama}
            placeholder="Nama Penerima"
            onChange={(e) =>
              onUpdate((draft) => {
                draft.nama = e.target.value;
              })
            }
          />
          <Heading size={"sm"}>Tanggungan</Heading>
          <RecipientLiabilityList
            list={recipient.tanggungan}
            jenisList={jenisTanggunanList}
            onUpdateList={(fn) => {
              onUpdate((draft) => {
                fn(draft.tanggungan);
              });
            }}
          />
        </VStack>
      </CardBody>
    </Card>
  );
}

function RecipientList({ list, onUpdateList, jenisTanggunanList }) {
  return (
    <VStack alignItems="stretch" gap={4}>
      {list.map((item, index) => (
        <RecipientItem
          key={item.id}
          recipient={item}
          index={index}
          onUpdate={(fn) =>
            onUpdateList((draft) => {
              fn(getItemById(draft, item.id));
            })
          }
          jenisTanggunanList={jenisTanggunanList}
        />
      ))}
    </VStack>
  );
}

function RecipientAdder({ onAdd }) {
  return (
    <IconButton
      aria-label="Tambah Penerima"
      colorScheme="orange"
      onClick={onAdd}
      icon={<AddIcon />}
      isRound
      position={"fixed"}
      right={4}
      bottom={4}
      size="lg"
    />
  );
}

export function RecipientListTab({ list, onUpdateList, jenisTanggunanList }) {
  return (
    <>
      <RecipientList
        list={list}
        onUpdateList={onUpdateList}
        jenisTanggunanList={jenisTanggunanList}
      />
      <RecipientAdder
        onAdd={() =>
          onUpdateList((draft) => {
            draft.push({
              id: generateId(),
              nama: "",
              tanggungan: [],
            });
          })
        }
      />
    </>
  );
}
