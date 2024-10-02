import { ChangeEvent } from "react";

export interface FormField {
  label: string;
  value: number | bigint | string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => any;
}
