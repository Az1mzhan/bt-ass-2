import { FC, useCallback, useEffect, useState } from "react";
import { Contract } from "web3";

interface Model {
  name: string;
  description: string;
  price: string;
  creator: string;
  averageRating: number;
}

interface Props {
  contract: Contract<any>;
}

const ModelList: FC<Props> = ({ contract }) => {
  const [models, setModels] = useState<Model[]>([]);

  const loadModels = useCallback(async () => {
    const modelCount: number = await contract.methods.modelCount().call();
    const modelList: Model[] = [];

    for (let i = 1; i <= modelCount; i++) {
      const model = await contract.methods.getModelDetails(i).call();
      modelList.push(model);
    }

    setModels(modelList);
  }, [contract]);

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  return (
    <div>
      {models.map((model, index) => (
        <div key={index}>
          <h3>{model.name}</h3>
          <p>{model.description}</p>
          <p>Price: {model.price} ETH</p>
          <p>Rating: {model.averageRating}</p>
        </div>
      ))}
    </div>
  );
};

export default ModelList;
