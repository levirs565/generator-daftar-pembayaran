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
  useToast,
  TabPanel,
} from "@chakra-ui/react";
import { formatCurrency } from "./util";
import { Icon } from "@chakra-ui/icons";
import { RiMore2Fill } from "react-icons/ri";
import { LiabilityTypeModal } from "./LiabilityTypeEditModal";
import { RiPencilFill } from "react-icons/ri";
import { RiDeleteBinFill } from "react-icons/ri";
import { useState } from "react";
import { liabilityStore } from "./db";
import { useLiveQuery } from "dexie-react-hooks";
import { catchWithToast } from "./toastUtil";

function LiabilityTypeItem({ liability, index, onEdit, onDelete }) {
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

function LiabilityTypeList({ list, onEdit, onDelete }) {
  return (
    <>
      {list.map((item, index) => (
        <LiabilityTypeItem
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

function LiabilityTypeAdder({ onAdd }) {
  return (
    <Flex alignSelf="end">
      <Button colorScheme="pink" onClick={onAdd} width={"100%"}>
        Tambah Jenis
      </Button>
    </Flex>
  );
}

export function LiabilityTypesTab() {
  const {
    isOpen: isModalOpen,
    onClose: onModalClose,
    onOpen: onModalOpen,
  } = useDisclosure();
  const [modalItem, setModalItem] = useState(null);
  const toast = useToast();
  const list = useLiveQuery(() =>
    catchWithToast(
      toast,
      "Gagal Mendapatkan Daftar Jenis Tanggungan",
      liabilityStore.getAll()
    )
  );

  return (
    <TabPanel>
      <VStack alignItems="stretch" gap={2}>
        {list && (
          <LiabilityTypeList
            list={list}
            onEdit={(item) => {
              setModalItem(item);
              onModalOpen();
            }}
            onDelete={(item) => {
              catchWithToast(
                toast,
                "Gagal Menghapus Jenis Tanggungan",
                liabilityStore.delete(item)
              );
            }}
          />
        )}
        <LiabilityTypeAdder
          onAdd={() => {
            setModalItem(null);
            onModalOpen();
          }}
        />
        <LiabilityTypeModal
          isOpen={isModalOpen}
          onClose={onModalClose}
          liability={modalItem}
          onSubmit={(item) => {
            if (!item.id) {
              catchWithToast(
                toast,
                "Gagal Menambahkan Jenis Tanggungan",
                liabilityStore.add(item)
              );
            } else {
              catchWithToast(
                toast,
                "Gagal Mengubah Jenis Tanggungan",
                liabilityStore.put(item)
              );
            }
            setModalItem(null);
          }}
        />
      </VStack>
    </TabPanel>
  );
}
