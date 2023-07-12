import { Input, Textarea } from "@chakra-ui/react";
import { useState } from "react";
import CurrencyInput from "react-currency-input-field";

export function FastTextArea({ value, onUpdate, ...rest }) {
  const [currentValue, setCurrentValue] = useState(value);

  return (
    <Textarea
      value={currentValue}
      onChange={(e) => setCurrentValue(e.target.value)}
      onBlur={() => onUpdate(currentValue)}
      {...rest}
    />
  );
}

export function FastCurrencyInput({ value, onUpdate, ...rest }) {
  const [currentValue, setCurrentValue] = useState(value);
  return (
    <Input
      as={CurrencyInput}
      intlConfig={{ locale: "id-ID", currency: "IDR" }}
      value={currentValue}
      onValueChange={(e) => setCurrentValue(e)}
      onBlur={() => onUpdate(currentValue)}
      {...rest}
    />
  );
}

export function FastInput({ value, onUpdate, ...rest }) {
  const [currentValue, setCurrentValue] = useState(value);
  return (
    <Input
      value={currentValue}
      onChange={(e) => setCurrentValue(e.target.value)}
      onBlur={() => onUpdate(currentValue)}
      {...rest}
    />
  );
}
