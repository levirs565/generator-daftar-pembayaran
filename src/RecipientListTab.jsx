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
  TabPanel,
} from "@chakra-ui/react";
import { formatCurrency, getLiabilityTotal } from "./util";
import { RiPencilFill } from "react-icons/ri";
import { RiDeleteBinFill } from "react-icons/ri";
import { RiMore2Fill } from "react-icons/ri";
import { RecipientEditModal } from "./RecipientEditModal";
import { useLiveQuery } from "dexie-react-hooks";
import { catchWithToast, useGlobalToast } from "./toastUtil";
import { FloatingActionButton } from "./Fab";
import NiceModal from "@ebay/nice-modal-react";
import { PromptDialog } from "./PromptDialog";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ListItemMotionProps } from "./animation";
import { appStore } from "./db";

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
              {formatCurrency(getLiabilityTotal(item.liabilityList))}
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
      <LayoutGroup>
        <AnimatePresence>
          {list.map((item, index) => (
            <motion.div key={item.id} {...ListItemMotionProps}>
              <RecipientItem
                item={item}
                index={index}
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

function RecipientAdder({ onAdd }) {
  return (
    <FloatingActionButton
      aria-label="Tambah Penerima"
      onClick={onAdd}
      icon={<AddIcon />}
    />
  );
}

export function RecipientListTab() {
  const toast = useGlobalToast();
  const list = useLiveQuery(() =>
    catchWithToast(
      toast,
      "Gagal Mendapatkan Daftar Penerima",
      appStore.getRecipientList()
    )
  );

  return (
    <TabPanel mb={16}>
      {list && (
        <RecipientList
          list={list}
          onEdit={(item) => {
            catchWithToast(
              toast,
              "Gagal Mengubah Penerima",
              NiceModal.show(RecipientEditModal, { item }).then((result) =>
                appStore.putRecipient(result.item)
              )
            );
          }}
          onDelete={(item) => {
            catchWithToast(
              toast,
              "Gagal Menghapus Penerima",
              NiceModal.show(PromptDialog, {
                title: "Hapus Penerima",
                message: `Apakah anda yakin menghapus penerima "${item.name}"?`,
                ctaColor: "red",
                ctaText: "Hapus",
              }).then(() => appStore.deleteRecipient(item))
            );
          }}
        />
      )}
      <RecipientAdder
        onAdd={() => {
          catchWithToast(
            toast,
            "Gagal Menambahkan Penerima",
            NiceModal.show(RecipientEditModal, { item: null }).then((result) =>
              appStore.putRecipient(result.item)
            )
          );
        }}
      />
    </TabPanel>
  );
}
