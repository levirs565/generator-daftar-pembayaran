import { AddIcon, Icon } from "@chakra-ui/icons";
import {
  VStack,
  IconButton,
  Heading,
  Card,
  CardHeader,
  Flex,
  Circle,
  Box,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  CardBody,
  useDisclosure,
} from "@chakra-ui/react";
import { formatCurrency } from "./util";
import { RiPencilFill } from "react-icons/ri";
import { RiDeleteBinFill } from "react-icons/ri";
import { RiMore2Fill } from "react-icons/ri";
import { RecipientEditModal } from "./RecipientEditModal";
import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { recipientStore } from "./db";

function RecipientItem({ item, index, onEdit, onDelete }) {
  return (
    <Card size="sm">
      <CardHeader>
        <Flex gap={3} alignItems="center">
          <Circle size={12} bg="gray.100">
            <Text fontSize="xl">{index + 1}</Text>
          </Circle>
          <Box flexGrow={1}>
            <Heading as="h2" size="sm">
              {item.name}
            </Heading>
            <Text fontSize="md">
              {formatCurrency(
                item.liabilityList.reduce(
                  (result, current) => result + current.amount,
                  0
                )
              )}
            </Text>
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
                onClick={() => onEdit(item)}
              >
                Ubah
              </MenuItem>
              <MenuItem
                icon={<Icon as={RiDeleteBinFill} />}
                onClick={() => onDelete(item)}
              >
                Hapus
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </CardHeader>
      <CardBody>
        {item.liabilityList.map((item) => (
          <Box key={item.id}>
            <Text fontWeight="bold">{item.name}</Text>
            <Text>{formatCurrency(item.amount)}</Text>
          </Box>
        ))}
      </CardBody>
    </Card>
  );
}

function RecipientList({ list, onEdit, onDelete }) {
  return (
    <VStack alignItems="stretch">
      {list.map((item, index) => (
        <RecipientItem
          key={item.id}
          item={item}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
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

export function RecipientListTab() {
  const {
    isOpen: isModalOpen,
    onClose: onModalClose,
    onOpen: onModalOpen,
  } = useDisclosure();
  const [modalItem, setModalItem] = useState(null);
  const list = useLiveQuery(() => recipientStore.getAll());

  return (
    <>
      {list && (
        <RecipientList
          list={list}
          onEdit={(item) => {
            setModalItem(item);
            onModalOpen();
          }}
          onDelete={(item) => {
            recipientStore.delete(item);
          }}
        />
      )}
      <RecipientAdder
        onAdd={() => {
          setModalItem(null);
          onModalOpen();
        }}
      />
      <RecipientEditModal
        item={modalItem}
        onSubmit={(item) => {
          if (item.id) {
            recipientStore.put(item);
          } else {
            recipientStore.add(item);
          }
          setModalItem(null);
        }}
        isOpen={isModalOpen}
        onClose={onModalClose}
      />
    </>
  );
}
