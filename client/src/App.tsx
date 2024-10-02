import { useCallback, useEffect, useState } from "react";
import ListModelForm from "./components/list-model-form/ListModelForm";
import ModelComponent from "./components/ModelComponent";
import { Contract, Web3 } from "web3";
import { Model } from "./types/Model";
import { Nullable } from "./types/Nullable";
import AIModelMarketplace from "../../server/build/contracts/AIModelMarketplace.json";
import {
  Box,
  Button,
  FormControl,
  Modal,
  Paper,
  TextField,
} from "@mui/material";
import "./App.css";
import WithdrawForm from "./components/withdraw-form/WithdrawForm";
import { setIsUpdated } from "./store/store";
import { FormField } from "./types/FormField";
import styles from "./components/list-model-form/listModelForm.module.css";
import { Simulate } from "react-dom/test-utils";
import load = Simulate.load;

function App() {
  const [account, setAccount] = useState<string>("");
  const [contract, setContract] = useState<Nullable<Contract<object>>>(null);
  const [models, setModels] = useState<Model[]>([]);
  const [web3, setWeb3] = useState<Nullable<Web3>>(null);

  const listenForEvents = () => {
    if (!contract || !web3) return;

    // @ts-ignore
    contract.events
      .ModelPurchased({
        fromBlock: "latest",
      })
      .on("data", (event) => {
        const { modelId, buyer } = event.returnValues;
        alert(`Model purchased! ID: ${modelId}, Buyer: ${buyer}, Price:`);
      });
  };

  const loadModels = useCallback(async () => {
    if (!contract) return;

    const modelCount = await contract.methods.modelCount().call();
    let loadedModels = [];
    for (let i = 0; i < modelCount; i++) {
      const model = await contract.methods.models(i).call();
      loadedModels.push(model);
    }
    setModels(loadedModels);
  }, []);

  const getModules = async () => {
    if (!contract) return;

    const modelCount = await contract.methods.modelCount().call();
    let loadedModels = [];
    for (let i = 0; i < modelCount; i++) {
      const model = await contract.methods.models(i).call();
      loadedModels.push(model);
    }
    console.log("mod", loadedModels);
    setModels(loadedModels);
  };

  const loadBlockchainData = useCallback(async () => {
    if (!window.ethereum) return;

    const web3Instance = new Web3(window.ethereum);
    setWeb3(web3Instance);

    // Request account access
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);

    const networkId = await web3Instance.eth.net.getId();
    const networkData = AIModelMarketplace.networks[networkId];

    if (networkData) {
      const abi = AIModelMarketplace.abi;
      const contractInstance = new web3Instance.eth.Contract(
        abi,
        networkData.address
      );
      setContract(contractInstance);
    } else {
      alert("Smart contract not deployed to detected network.");
    }
  }, []);

  useEffect(() => {
    const getModules = async () => {
      if (!contract) return;

      const modelCount = await contract.methods.modelCount().call();
      let loadedModels = [];
      for (let i = 0; i < modelCount; i++) {
        const model = await contract.methods.models(i).call();
        loadedModels.push(model);
      }
      console.log("mod", loadedModels);
      setModels(loadedModels);
    };

    getModules();
  }, []);

  useEffect(() => {
    loadBlockchainData();
  }, [loadBlockchainData]);

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

      await getModules();
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
    <>
      <Box id="root">
        <Box className="actionsContainer">
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
          <WithdrawForm account={account} contract={contract} />
        </Box>
        {models.map((model, id) => (
          <ModelComponent
            key={id}
            id={id}
            web3={web3}
            account={account}
            contract={contract}
            model={model}
          />
        ))}
      </Box>
    </>
  );
}

export default App;
