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

function RecipientItem({ recipient, index, onUpdate }) {
  return (
    <Card key={recipient.id}>
      <CardBody>
        <VStack alignItems={"stretch"}>
          <Heading size={"sm"}>Penerima ke {index + 1}</Heading>
          <Input
            value={recipient.name}
            placeholder="Nama Penerima"
            onChange={(e) =>
              onUpdate((draft) => {
                draft.name = e.target.value;
              })
            }
          />
          <Heading size={"sm"}>Tanggungan</Heading>
          <RecipientLiabilityList
            list={recipient.lialibilityList}
            onUpdateList={(fn) => {
              onUpdate((draft) => {
                fn(draft.lialibilityList);
              });
            }}
          />
        </VStack>
      </CardBody>
    </Card>
  );
}

function RecipientList({ list, onUpdateList }) {
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

export function RecipientListTab({ list, onUpdateList }) {
  return (
    <>
      <RecipientList list={list} onUpdateList={onUpdateList} />
      <RecipientAdder
        onAdd={() =>
          onUpdateList((draft) => {
            draft.push({
              id: generateId(),
              name: "",
              lialibilityList: [],
            });
          })
        }
      />
    </>
  );
}
