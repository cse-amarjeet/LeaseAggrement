import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "../contracts/BuyMeACoffee.json";
import Swal from "sweetalert2";

const LeaseAgreementCard = ({ leaseAgreementAddress }) => {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });
  const [leaseInfo, setLeaseInfo] = useState({
    landlord: "",
    tenant: "",
    rent: 0,
    remainingDuration: 0,
    renterAddress: "",
    contractName: "",
    ownerName: "",
    tenantName: "",
  });

  useEffect(() => {
    const getLeaseInfo = async () => {
      const contractAbi = abi.abi;
      try {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            leaseAgreementAddress,
            contractAbi,
            signer
          );
          setState({ provider, signer, contract });

          const landlord = await contract.landlord();
          const tenant = await contract.tenant();
          const rent = await contract.monthlyRent();
          const remainingDuration = await contract.getRemainingLeaseDuration();
          const renterAddress = await contract.tenant();
          const contractName = await contract.aggrementName();
          const ownerName = await contract.ownerName();
          const tenantName = await contract.tenantName();
          // Fetch other lease details here
          console.log("landlord", landlord);

          setLeaseInfo({
            landlord,
            tenant,
            rent: rent.toString(),
            remainingDuration: `${Math.floor(
              remainingDuration / (60 * 60 * 24)
            )} days`,
            renterAddress,
            contractName,
            ownerName,
            tenantName,
            // ... set other lease details in the state
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    getLeaseInfo();
  }, []); // Empty dependency array ensures this runs only once on component mount
  const { contract } = state;

  const payRent = async (event) => {
    event.preventDefault();
    try {
      await contract.makePayment({ value: leaseInfo.rent });
      // console.log("Payment Successfull!!");
    } catch (err) {
      console.log("Error is: ", err);
      Swal.fire(
        "Failure",
        "Something wrong happen or you are not tenant for this contract",
        "error"
      );
    }
  };

  const TerminateContract = async (event) => {
    event.preventDefault();
    await contract.terminateLease();
    console.log("Contracted terminated!!");
  };

  return (
    <div className="App bg-gray-100 h-auto p-4">
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-semibold mb-4">Lease Agreement</h1>
        <div>
          <p className="mb-2">
            Contract Name:{" "}
            <span className="font-semibold">{leaseInfo.contractName} </span>
          </p>
          <p className="mb-2">
            Owner Name:{" "}
            <span className="font-semibold">{leaseInfo.ownerName} </span>
          </p>

          <p className="mb-2">
            Tenant Name:{" "}
            <span className="font-semibold">{leaseInfo.tenantName} </span>
          </p>

          <p className="mb-2">
            Monthly Rent:{" "}
            <span className="font-semibold">{leaseInfo.rent} WEI</span>
          </p>
          <p className="mb-4">
            Remaining Lease Duration:{" "}
            <span className="font-semibold">{leaseInfo.remainingDuration}</span>
          </p>

          <p className="mb-2">
            Contract Address:{" "}
            <span className="font-semibold">{leaseAgreementAddress} </span>
          </p>
          <p className="mb-2">
            Landlord Address:{" "}
            <span className="font-semibold">{leaseInfo.landlord} </span>
          </p>
          <p className="mb-2">
            Tenant Address:{" "}
            <span className="font-semibold">{leaseInfo.renterAddress} </span>
          </p>

          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={payRent}
          >
            Pay Rent
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ml-2"
            onClick={TerminateContract}
          >
            Terminate Lease
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaseAgreementCard;

// <div className="bg-white rounded-lg shadow p-7">
// <h2 className="text-lg font-semibold">Lease Agreement</h2>
// <p>Landlord: {leaseInfo.landlord}</p>
// <p>Tenant: {leaseInfo.tenant}</p>
// </div>
