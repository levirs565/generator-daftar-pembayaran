import { AddIcon } from "@chakra-ui/icons";
import {
  VStack,
  Input,
  IconButton,
  Heading,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { RecipientLiabilityList } from "./RecipientLiabilityList";
import { generateId, getItemById } from "./util";
import {
  AccordionAnimatable,
  AccordionBodyMotionProps,
  AccordionItemAnimatable,
} from "./AccordionAnimatable";
import { motion } from "framer-motion";

function RecipientItem({ recipient, index, onUpdate }) {
  return (
    <AccordionItemAnimatable
      id={recipient.id}
      title={`Penerima ke ${index + 1}`}
      collapsedBodyTitle={recipient.name}
      expandedBody={
        <>
          <VStack alignItems={"stretch"}>
            <FormControl>
              <FormLabel>Nama</FormLabel>
              <motion.div {...AccordionBodyMotionProps}>
                <Input
                  value={recipient.name}
                  placeholder="Nama Penerima"
                  onChange={(e) =>
                    onUpdate((draft) => {
                      draft.name = e.target.value;
                    })
                  }
                />
              </motion.div>
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
        </>
      }
    />
  );
}

function RecipientList({ list, onUpdateList }) {
  return (
    <AccordionAnimatable allowToggle>
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
    </AccordionAnimatable>
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
