import { FC, useState } from "react";
import { Contract, Web3 } from "web3";
import { FormField } from "../../types/FormField";
import { Nullable } from "../../types/Nullable";
import {
  Box,
  Button,
  FormControl,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import styles from "./listModelForm.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setIsUpdated } from "../../store/store";

interface Props {
  web3: Nullable<Web3>;
  account: string;
  contract: Nullable<Contract<object>>;
}

const ListModelForm: FC<Props> = ({ contract, account, web3 }) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [bigIntPrice, setBigIntPrice] = useState<bigint>(BigInt(price));
  const [isOpened, setIsOpened] = useState<boolean>(false);

  const formFields: FormField[] = [
    {
      label: "Name",
      value: name,
      onChange: (e) => {
        setName(e.target.value);
      },
    },
    {
      label: "Description",
      value: description,
      onChange: (e) => {
        setDescription(e.target.value);
      },
    },
    {
      label: "Price (Wei)",
      value: price,
      onChange: (e) => {
        setPrice(+e.target.value);
        setBigIntPrice(BigInt(+e.target.value));
      },
    },
  ];

  const listModel = async () => {
    if (!contract) return;

    try {
      await contract.methods
        .listModel(name, description, bigIntPrice)
        .send({ from: account });
    } catch (err) {
      console.error(err);
    } finally {
      closeModal();
    }
  };

  const openModal = () => {
    setIsOpened(true);
  };

  const closeModal = () => {
    setIsOpened(false);
  };

  return (
    <Box>
      <Button variant="contained" onClick={openModal}>
        List a model
      </Button>
      <Modal
        className={styles.listModelForm}
        open={isOpened}
        onClose={closeModal}
      >
        <Paper className={styles.formContainer}>
          <h3>List a model</h3>
          <FormControl className={styles.formControl}>
            {formFields.map((field, id) => (
              <TextField
                key={id}
                label={field.label}
                value={field.value}
                onChange={field.onChange}
                InputProps={{ inputProps: { min: 0 } }}
                type={
                  typeof field.value === "bigint"
                    ? "number"
                    : typeof field.value
                }
              ></TextField>
            ))}
            <Button variant="contained" onClick={() => listModel()}>
              Submit
            </Button>
          </FormControl>
        </Paper>
      </Modal>
    </Box>
  );
};

export default ListModelForm;
