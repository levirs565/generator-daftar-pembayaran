import {
  VStack,
  Flex,
  Card,
  CardHeader,
  Heading,
  Text,
  Box,
  Circle,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  TabPanel,
} from "@chakra-ui/react";
import { formatCurrency } from "./util";
import { AddIcon, Icon } from "@chakra-ui/icons";
import { RiMore2Fill } from "react-icons/ri";
import { LiabilityTypeEditModal } from "./LiabilityTypeEditModal";
import { RiPencilFill } from "react-icons/ri";
import { RiDeleteBinFill } from "react-icons/ri";
import { liabilityStore } from "./db";
import { useLiveQuery } from "dexie-react-hooks";
import { catchWithToast } from "./toastUtil";
import { FloatingActionButton } from "./Fab";
import NiceModal from "@ebay/nice-modal-react";

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
    <VStack alignItems="stretch" gap={2}>
      {list.map((item, index) => (
        <LiabilityTypeItem
          key={item.id}
          index={index}
          liability={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </VStack>
  );
}

function LiabilityTypeAdder({ onAdd }) {
  return (
    <FloatingActionButton
      aria-label="Tambah Jenis"
      onClick={onAdd}
      icon={<AddIcon />}
    />
  );
}

export function LiabilityTypesTab() {
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
      {list && (
        <LiabilityTypeList
          list={list}
          onEdit={(item) => {
            catchWithToast(
              toast,
              "Gagal Mengubah Jenis Tanggungan",
              NiceModal.show(LiabilityTypeEditModal, { item }).then((result) =>
                liabilityStore.put(result.item)
              )
            );
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
          catchWithToast(
            toast,
            "Gagal Menambahkan Jenis Tanggungan",
            NiceModal.show(LiabilityTypeEditModal, { item: null }).then((result) =>
              liabilityStore.add(result.item)
            )
          );
        }}
      />
    </TabPanel>
  );
}
