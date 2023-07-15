import { createContext, useContext } from "react";
import { CancelException } from "./util";

export async function catchWithToast(toast, title, promise) {
  try {
    return await promise;
  } catch (error) {
    if (error instanceof CancelException) return;
    console.error(error);
    toast({
      title: title,
      description: error.message,
      status: "error",
      duration: 2000,
      isClosable: true,
    });
  }
}

export const GlobalToastContext = createContext();
export const useGlobalToast = () => useContext(GlobalToastContext);
