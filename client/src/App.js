// import { useState, useEffect } from "react";
// import { ethers } from "ethers";

// import factoryContractAbi from "./contracts/Factory.json";


// import Aggrements from './components/Aggrements';
// function App() {
//   const [state, setState] = useState({
//     provider: null,
//     signer: null,
//     contract: null
//   });
//    const [aggrementList, setAggrementList] = useState();
//   useEffect(() => {
//     const connectWallet = async () => {
//      const factoryContractAddress = "0x3F6eDcB9720fdFd5B38D8EB56b3Ac54424633094";
//       try {
//         const { ethereum } = window;
//         if (ethereum) {
//           const accounts = await ethereum.request({
//             method: "eth_requestAccounts",
//           });
//           const provider = new ethers.providers.Web3Provider(ethereum);
//           const signer = provider.getSigner();
//           const contract = new ethers.Contract(
//             factoryContractAddress,
//             factoryContractAbi.abi,
//             signer
//           );
//           console.log("getLeaseAgreements: temp" )
//             setState({ provider, signer, contract });
//             const temp= await contract.getLeaseAgreements()
//           setAggrementList(temp);
//             console.log("getLeaseAgreements:", temp)
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     connectWallet();
//   }, []);

//   return (
//     <div>
    
//       <div className="max-w-md mx-auto bg-white p-6 rounded shadow my-4">
//         <h2 className="text-xl font-semibold mb-4">Create New Lease Agreement</h2>
//         <button
//           className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
//         >
//           Create Lease Agreement
//         </button>
//       </div>
//       {
//         aggrementList?.map((address)=>{
//           return <Aggrements key={address} contractAddress={address}/>
//         })
//       }
//     </div>
//   );
// }

// export default App;


import { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "./contracts/BuyMeACoffee.json";

function App() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });
  const [monthlyRent, setMonthlyRent] = useState("");
  const [remainingLeaseDuration, setRemainingLeaseDuration] = useState("");

  useEffect(() => {
    const connectWallet = async () => {
      const contractAddress = "0x6C92D8F6Cc6AB42A8bd5E1fFb3EeD9c3B318C904";
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

          // Fetch and display monthly rent and remaining lease duration
          const rent = await contract.monthlyRent();
          setMonthlyRent(rent.toString());

          const remainingDuration = await contract.getRemainingLeaseDuration();
          setRemainingLeaseDuration(
            `${Math.floor(remainingDuration / (60 * 60 * 24))} days`
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    connectWallet();
  }, []);

  const {contract}=state;
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
          <button onClick={payRent} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Make Payment
          </button>
          <button onClick={TerminateContract} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ml-2">
            Terminate Lease
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
