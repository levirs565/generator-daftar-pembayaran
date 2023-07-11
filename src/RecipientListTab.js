import { AddIcon } from "@chakra-ui/icons";
import {
  VStack,
  Input,
  IconButton,
  Heading,
  FormControl,
  FormLabel,
  Accordion,
  AccordionButton,
  AccordionIcon,
  Box,
  AccordionItem,
  AccordionPanel,
  Text,
} from "@chakra-ui/react";
import { RecipientLiabilityList } from "./RecipientLiabilityList";
import { generateId, getItemById } from "./util";

function RecipientItem({ recipient, index, onUpdate }) {
  return (
    <AccordionItem>
      {({ isExpanded }) => (
        <>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Penerima ke {index + 1}
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <Heading size={"sm"}></Heading>
          </h2>
          {!isExpanded && (
            <Text px={4} py={2}>
              {recipient.name}
            </Text>
          )}
          <AccordionPanel>
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
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  );
}

function RecipientList({ list, onUpdateList }) {
  return (
    <Accordion allowToggle>
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
    </Accordion>
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
