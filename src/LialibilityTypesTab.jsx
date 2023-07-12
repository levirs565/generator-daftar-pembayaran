import {
  Button,
  VStack,
  Flex,
  Card,
  CardHeader,
  Heading,
  Text,
  Box,
  Circle,
  IconButton,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import {
  formatCurrency,
  generateId,
  getItemIndexById,
  removeItemByIndex,
} from "./util";
import { Icon } from "@chakra-ui/icons";
import { RiMore2Fill } from "react-icons/ri";
import { LialibilityTypeModal } from "./LialibilityTypeModal";
import { RiPencilFill } from "react-icons/ri";
import { RiDeleteBinFill } from "react-icons/ri";
import { useState } from "react";

function LialibilityTypeItem({ liability, index, onEdit, onDelete }) {
  return (
    <Card size="sm">
      <CardHeader>
        <Flex gap={3} alignItems="center">
          <Circle size={12} bg="gray.100">
            <Text fontSize="xl">{index + 1}</Text>
          </Circle>
          <Box flexGrow={1}>
            <Heading as="h2" size="sm">
              {liability.name}
            </Heading>
            <Text fontSize="md">{formatCurrency(liability.amount)}</Text>
          </Box>
          <Menu isLazy autoSelect={false}>
            <MenuButton
              as={IconButton}
              size="lg"
              aria-label="Edit"
              variant="ghost"
              icon={<Icon as={RiMore2Fill} />}
            />
            <MenuList>
              <MenuItem
                icon={<Icon as={RiPencilFill} />}
                onClick={() => onEdit(liability)}
              >
                Ubah
              </MenuItem>
              <MenuItem
                icon={<Icon as={RiDeleteBinFill} />}
                onClick={() => onDelete(liability)}
              >
                Hapus
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </CardHeader>
    </Card>
  );
}

function LialibilityTypeList({ list, onEdit, onDelete }) {
  return (
    <>
      {list.map((item, index) => (
        <LialibilityTypeItem
          key={item.id}
          index={index}
          liability={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </>
  );
}

function LialibilityTypeAdder({ onAdd }) {
  return (
    <Flex alignSelf="end">
      <Button colorScheme="pink" onClick={onAdd} width={"100%"}>
        Tambah Jenis
      </Button>
    </Flex>
  );
}

export function LialibilityTypesTab({ list, onUpdateList }) {
  const {
    isOpen: isModalOpen,
    onClose: onModalClose,
    onOpen: onModalOpen,
  } = useDisclosure();
  const [modalItem, setModalItem] = useState(null);

  return (
    <VStack alignItems="stretch" gap={2}>
      <LialibilityTypeList
        list={list}
        onEdit={(item) => {
          setModalItem(item);
          onModalOpen();
        }}
        onDelete={(item) => {
          const index = getItemIndexById(list, item.id);
          onUpdateList((draft) => {
            removeItemByIndex(draft, index);
          });
        }}
      />
      <LialibilityTypeAdder
        onAdd={() => {
          setModalItem(null);
          onModalOpen();
        }}
      />
      <LialibilityTypeModal
        isOpen={isModalOpen}
        onClose={onModalClose}
        lialibility={modalItem}
        onSubmit={({ id, name, amount }) => {
          if (!id) {
            onUpdateList((draft) => {
              draft.push({
                id: generateId(),
                name,
                amount,
              });
            });
          } else {
            const index = getItemIndexById(list, id);
            onUpdateList((draft) => {
              draft[index].name = name;
              draft[index].amount = amount;
            });
          }
          setModalItem(null);
        }}
      />
    </VStack>
  );
}
