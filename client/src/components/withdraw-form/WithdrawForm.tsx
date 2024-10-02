import { FC, useState } from "react";
import { Box, Button, Modal, Paper } from "@mui/material";
import styles from "./widthdrawForm.module.css";
import { Contract } from "web3";
import { Nullable } from "../../types/Nullable";

interface Props {
  contract: Nullable<Contract<object>>;
  account: string;
}

const WithdrawForm: FC<Props> = ({ contract, account }) => {
  const [isOpened, setIsOpened] = useState<boolean>(false);

  const withdrawFunds = async () => {
    if (!contract) return;

    try {
      await contract.methods.withDrawFunds().send({ from: account });
      closeModal();
    } catch (err) {
      console.error(err);
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
        Withdraw
      </Button>
      <Modal
        className={styles.withdrawFundsForm}
        open={isOpened}
        onClose={closeModal}
      >
        <Paper className={styles.formContainer}>
          <h3>Are you sure you want to withdraw your funds?</h3>
          <Box>
            <Button variant="contained" onClick={() => withdrawFunds()}>
              Yes
            </Button>
            <Button onClick={closeModal}>No</Button>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
};

export default WithdrawForm;
