import { Input } from "@chakra-ui/react";
import CurrencyInput from "react-currency-input-field";

export function AppCurrencyInput({ ...rest }) {
  return (
    <Input
      as={CurrencyInput}
      intlConfig={{ locale: "id-ID", currency: "IDR" }}
      {...rest}
    />
  );
}
