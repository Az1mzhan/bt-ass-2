import { FC } from "react";
import { Contract } from "web3";

interface Props {
  modelId: number;
  price: string;
  contract: Contract<any>;
  account: string;
}

const PurchaseButton: FC<Props> = ({ modelId, price, contract, account }) => {
  const purchaseModel = async () => {
    try {
      await contract.methods
        .purchaseModel(modelId)
        .send({ from: account, value: price });
      alert("Model purchased successfully");
    } catch (error) {
      console.error("Error purchasing model:", error);
    }
  };

  return <button onClick={purchaseModel}>Purchase</button>;
};

export default PurchaseButton;
