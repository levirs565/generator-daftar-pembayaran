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
  TabPanel,
} from "@chakra-ui/react";
import { formatCurrency } from "./util";
import { AddIcon, Icon } from "@chakra-ui/icons";
import { RiMore2Fill } from "react-icons/ri";
import { LiabilityTypeEditModal } from "./LiabilityTypeEditModal";
import { RiPencilFill } from "react-icons/ri";
import { RiDeleteBinFill } from "react-icons/ri";
import { useLiveQuery } from "dexie-react-hooks";
import { catchWithToast, useGlobalToast } from "./toastUtil";
import { FloatingActionButton } from "./Fab";
import NiceModal from "@ebay/nice-modal-react";
import { PromptDialog } from "./PromptDialog";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ListItemMotionProps } from "./animation";
import { appStore } from "./db";

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
      <LayoutGroup>
        <AnimatePresence>
          {list.map((item, index) => (
            <motion.div key={item.id} {...ListItemMotionProps}>
              <LiabilityTypeItem
                index={index}
                liability={item}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </LayoutGroup>
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
  const toast = useGlobalToast();
  const list = useLiveQuery(() =>
    catchWithToast(
      toast,
      "Gagal Mendapatkan Daftar Jenis Tanggungan",
      appStore.getLiabilityTypeList()
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
                appStore.putLiabilityType(result.item)
              )
            );
          }}
          onDelete={(item) => {
            catchWithToast(
              toast,
              "Gagal Menghapus Jenis Tanggungan",
              NiceModal.show(PromptDialog, {
                title: "Hapus Jenis Tanggungan",
                message: `Apakah anda yakin menghapus jenis tanggungan "${item.name}"? Semua tanggungan yang berjenis ini akan ikut dihapus.`,
                ctaColor: "red",
                ctaText: "Hapus",
              }).then(() => appStore.deleteLiabilityType(item))
            );
          }}
        />
      )}
      <LiabilityTypeAdder
        onAdd={() => {
          catchWithToast(
            toast,
            "Gagal Menambahkan Jenis Tanggungan",
            NiceModal.show(LiabilityTypeEditModal, { item: null }).then(
              (result) => appStore.putLiabilityType(result.item)
            )
          );
        }}
      />
    </TabPanel>
  );
}
