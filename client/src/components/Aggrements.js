import { ethers } from "ethers";
import { useState,useEffect } from "react";
import abi from "../contracts/BuyMeACoffee.json";

const Aggrements = ({contractAddress}) => {
  const [monthlyRent, setMonthlyRent] = useState("");
  const [remainingLeaseDuration, setRemainingLeaseDuration] = useState("");
  const [state, setState] = useState({
      provider: null,
      signer: null,
      contract: null,
    });


    const connectWallet = async () => {
      // const contractAddress = "0x6C92D8F6Cc6AB42A8bd5E1fFb3EeD9c3B318C904";
      const contractAbi = abi.abi;
      
      try {
        const { ethereum } = window;
        if (ethereum) {
          const accounts = await ethereum.request({
            method: "eth_requestAccounts",
          });
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            contractAddress,
            contractAbi,
            signer
          );
          setState({ provider, signer, contract });
        }
      } catch (error) {
        console.log(error);
      }

    };

    const {contract}=state;
    const fetch= async ()=>{
     // Fetch and display monthly rent and remaining lease duration
     const rent = await contract.monthlyRent();
    //  setMonthlyRent(rent.toString());
    console.log("Rent:  ",rent)

     const remainingDuration = await contract.getRemainingLeaseDuration();
     setRemainingLeaseDuration(
       `${Math.floor(remainingDuration / (60 * 60 * 24))} days`
     );
    }


    useEffect(()=> {
      connectWallet();
      fetch();
    },[])
    




    const payRent=async (event)=>{
      event.preventDefault();
      await contract.makePayment({ value: 100 }); 
      console.log("Payment Successfull!!");
    }

    const TerminateContract=async (event)=>{
      event.preventDefault();
      await contract.terminateLease(); 
      console.log("Contracted terminated!!");
    }
  return (
 
    <div className="App bg-gray-100 min-h-screen p-4">
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Lease Agreement</h1>
      <div>
        <p className="mb-2">
          Monthly Rent: <span className="font-semibold">{monthlyRent} ETH</span>
        </p>
        <p className="mb-4">
          Remaining Lease Duration:{" "}
          <span className="font-semibold">{remainingLeaseDuration}</span>
        </p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" onClick={payRent} >
          Pay Rent
        </button>
        <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ml-2" onClick={TerminateContract} >
          Terminate Lease
        </button>
      </div>
    </div>
  </div>

  );
};
export default Aggrements;
