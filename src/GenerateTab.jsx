import { DownloadIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Button,
  CircularProgress,
  HStack,
  Input,
  Link,
  Text,
  VStack,
  VisuallyHiddenInput,
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

export function GenerateTab({ recipientList, lialibilityTypeList }) {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultLink, setResultLink] = useState(null);
  const fileInput = useRef();
  const toast = useToast();

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
  useEffect(() => {
    window.addEventListener(workerResultEvent, handleWorkerResult);
    return () =>
      window.removeEventListener(workerResultEvent, handleWorkerResult);
  }, []);

  return (
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
            lialibilityTypeList,
          });
        }}
      >
        Hasilkan Dokumen
      </Button>
      {resultLink && (
        <Button
          as={"a"}
          variant="outline"
          leftIcon={<DownloadIcon />}
          colorScheme="orange"
          download={resultLink.name}
          href={resultLink.href}
          onClick={() => {
            const href = resultLink.href;
            window.setTimeout(() => {
              setResultLink(null);
              URL.revokeObjectURL(href);
            }, 1000);
          }}
        >
          Unduh Dokumen
        </Button>
      )}
    </VStack>
  );
}
