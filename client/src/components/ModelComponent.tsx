import { FC, SyntheticEvent, useEffect, useState } from "react";
import { Contract, Web3 } from "web3";
import { Nullable } from "../types/Nullable";
import { Model } from "../types/Model";
import { Box, Button, Modal, Paper, Rating, Typography } from "@mui/material";

interface Props {
  id: number;
  model: Model;
  web3: Nullable<Web3>;
  account: string;
  contract: Nullable<Contract<object>>;
}

const ModelComponent: FC<Props> = ({ id, model, web3, account, contract }) => {
  const [rating, setRating] = useState<number>(0);
  const [isOpened, setIsOpened] = useState<boolean>(false);

  const stringModelProps = (({ name, description, price, creator }) => ({
    name,
    description,
    price,
    creator,
  }))(model);

  const rateModel = async () => {
    console.log("Da");
    if (web3 == null || contract == null) return;

    try {
      await contract.methods.rateModel(id, rating).send({ from: account });
    } catch (err) {
      console.error(err);
    }
  };

  const purchaseModel = async () => {
    if (web3 == null || contract == null) return;

    try {
      const weiPrice = web3.utils.toWei(model.price, "wei");

      await contract.methods
        .purchaseModel(BigInt(id))
        .send({ from: account, value: weiPrice });
    } catch (err) {
      console.error(err);
    }
  };

  const openRateModal = () => {
    setIsOpened(true);
  };

  const closeRateModal = () => {
    setIsOpened(false);
  };

  const handleRating = (e: SyntheticEvent, newRating: number) => {
    console.log(newRating);
    setRating(newRating);
  };

  return (
    <>
      <Box>
        {Object.keys(stringModelProps).map((key, id) => (
          <Box sx={{ display: "flex", gap: "10px" }}>
            <Typography variant="p">{key}: </Typography>
            <span>{stringModelProps[key]}</span>
          </Box>
        ))}
        <Rating
          readOnly
          value={Number(
            model.totalRating /
              (model.ratingCount === 0n ? 1n : model.ratingCount)
          )}
        />
        <Button onClick={openRateModal}>Rate</Button>
        <Button onClick={() => purchaseModel()}>Purchase</Button>
      </Box>
      <Modal open={isOpened} onClose={closeRateModal}>
        <Paper>
          <Typography variant="h2">Rate the AI model</Typography>
          <Rating
            value={rating}
            onChange={(e, newValue) => handleRating(e, newValue)}
          />
          <Button onClick={() => rateModel()}>Submit</Button>
        </Paper>
      </Modal>
    </>
  );
};

export default ModelComponent;
