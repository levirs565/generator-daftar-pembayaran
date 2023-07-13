import { DownloadIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Button,
  Collapse,
  HStack,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  VisuallyHiddenInput,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

const workerResultEvent = "generateWorkerResult";

let activeWorker = undefined;

function getWorker() {
  if (!activeWorker) {
    activeWorker = new Worker(
      new URL("./generatorWorker.js", import.meta.url),
      {
        type: "module",
      }
    );
    activeWorker.addEventListener("message", (event) => {
      const data = event.data;
      window.dispatchEvent(
        new CustomEvent(workerResultEvent, {
          detail: data,
        })
      );
    });
  }

  return activeWorker;
}

function run(templateFile, data) {
  getWorker().postMessage({
    action: "generate",
    templateFile,
    data,
  });
}

export function GenerateModal({
  recipientList,
  liabilityTypeList,
  isOpen,
  onClose,
}) {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultLink, setResultLink] = useState(null);
  const {
    isOpen: isFileShow,
    onOpen: onFileShow,
    onClose: onFileHide,
  } = useDisclosure();
  const fileInput = useRef();
  const toast = useToast();

  useEffect(() => {
    const handleWorkerResult = (e) => {
      setIsProcessing(false);
      const detail = e.detail;
      if (detail.success) {
        const name = `Daftar Pembayaran ${Date.now()}.docx`;
        const href = URL.createObjectURL(detail.blob);
        setResultLink({
          name,
          href,
        });
        onFileShow();
      } else {
        toast({
          title: "Error Saat Menghasilkan Dokumen",
          description: detail.error.message,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    };
    window.addEventListener(workerResultEvent, handleWorkerResult);
    return () =>
      window.removeEventListener(workerResultEvent, handleWorkerResult);
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Hasilkan Dokumen</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack>
            <Text alignSelf="stretch">File Template</Text>
            <HStack alignSelf="stretch">
              <Input
                flexGrow={1}
                placeholder="File Template Kosong"
                value={file ? file.name : ""}
                isReadOnly
                cursor="pointer"
                onClick={() => fileInput.current.click()}
              />
              <Button as="label" cursor="pointer" htmlFor="fileInput">
                Pilih File
              </Button>
              <VisuallyHiddenInput
                ref={fileInput}
                id="fileInput"
                type="file"
                accept=".docx"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </HStack>
            <Link isExternal>
              Unduh Contoh Template <ExternalLinkIcon mx={2} />
            </Link>
            <Button
              isDisabled={!file}
              isLoading={isProcessing}
              loadingText="Menghasilkan Dokumen"
              colorScheme="pink"
              onClick={() => {
                setIsProcessing(true);
                run(file, {
                  recipientList,
                  liabilityTypeList,
                });
              }}
            >
              Hasilkan Dokumen
            </Button>
            <Collapse in={isFileShow} unmountOnExit>
              <VStack>
                <Text>
                  Dokumen berikut adalah dokumen yang terakhir kali dihasilkan.
                  Tombol di bawah akan hilang setelah file di unduh.
                </Text>
                <Button
                  as={"a"}
                  variant="outline"
                  leftIcon={<DownloadIcon />}
                  colorScheme="orange"
                  download={resultLink ? resultLink.name : ""}
                  href={resultLink ? resultLink.href : ""}
                  onClick={() => {
                    const href = resultLink.href;
                    window.setTimeout(() => {
                      onFileHide();
                      URL.revokeObjectURL(href);
                      setResultLink(null);
                    }, 1000);
                  }}
                >
                  Unduh Dokumen
                </Button>
              </VStack>
            </Collapse>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
