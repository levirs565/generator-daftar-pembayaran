import { AddIcon } from "@chakra-ui/icons";
import {
  VStack,
  Input,
  IconButton,
  Card,
  CardBody,
  Heading,
  CardHeader,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { RecipientLiabilityList } from "./RecipientLiabilityList";
import { generateId, getItemById } from "./util";

function RecipientItem({ recipient, index, onUpdate }) {
  return (
    <Card key={recipient.id}>
      <CardHeader>
        <Heading size={"sm"}>Penerima ke {index + 1}</Heading>
      </CardHeader>
      <CardBody>
        <VStack alignItems={"stretch"}>
          <FormControl>
            <FormLabel>Nama</FormLabel>
            <Input
              value={recipient.name}
              placeholder="Nama Penerima"
              onChange={(e) =>
                onUpdate((draft) => {
                  draft.name = e.target.value;
                })
              }
            />
          </FormControl>
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
