import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import LeaseAgreementCard from "./components/LeaseAgreementCard";
import abi from "./contracts/Factory.json";

const App = () => {
  const [leaseAgreements, setLeaseAgreements] = useState([]);
  const [contractState, setContractState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    _aggrementName: "",
    _ownerName: "",
    _tenantName: "",
    tenant: "",
    monthlyRent: "",
    leaseDuration: "",
  });

  useEffect(() => {
    const fetchLeaseAgreements = async () => {
      const contractAddress = "0x97ACcE891e6E88D49ff79AF2aE37c66123f59408";
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
          setContractState({
            provider,
            signer,
            contract,
          });
          const addresses = await contract.getLeaseAgreements();
          setLeaseAgreements(addresses);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchLeaseAgreements();
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const { contract } = contractState;
    console.log(
      " Testing Data _aggrementName:  ",
      formData._aggrementName,
      "  _ownerName:  ",
      formData._ownerName,
      "   _tenantName:  ",
      formData._tenantName,
      "  tenant:  ",
      formData.tenant,
      "  monthlyRent:  ",
      formData.monthlyRent,
      "  leaseDuration:   ",
      formData.leaseDuration
    );
    await contract.createLeaseAgreement(
      formData._aggrementName,
      formData._ownerName,
      formData._tenantName,
      formData.tenant,
      formData.monthlyRent,
      formData.leaseDuration
    );
    closeModal();
    const addresses = await contract.getLeaseAgreements();
    setLeaseAgreements(addresses);
  };

  return (
    <div className="container mx-auto mt-8">
      <div className="flex justify-end mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={openModal}
        >
          Create Lease Agreement
        </button>
      </div>
      <h1 className="text-2xl font-semibold mb-4">Lease Agreements</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {leaseAgreements?.map((address, index) => (
          <LeaseAgreementCard key={address} leaseAgreementAddress={address} />
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">
              Create Lease Agreement
            </h2>
            <form>
              <div className="mb-4">
                <label className="block font-semibold">Agreement Name</label>
                <input
                  type="text"
                  name="_aggrementName"
                  value={formData._aggrementName}
                  onChange={handleFormChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold">Owner Name</label>
                <input
                  type="text"
                  name="_ownerName"
                  value={formData._ownerName}
                  onChange={handleFormChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold">Tenant Name</label>
                <input
                  type="text"
                  name="_tenantName"
                  value={formData._tenantName}
                  onChange={handleFormChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div className="mb-4">
                <label className="block font-semibold">Tenant Address</label>
                <input
                  type="text"
                  name="tenant"
                  value={formData.tenant}
                  onChange={handleFormChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold">Monthly Rent</label>
                <input
                  type="number"
                  name="monthlyRent"
                  value={formData.monthlyRent}
                  onChange={handleFormChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold">
                  Lease Duration (months)
                </label>
                <input
                  type="number"
                  name="leaseDuration"
                  value={formData.leaseDuration}
                  onChange={handleFormChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2"
                  onClick={handleFormSubmit}
                >
                  Create
                </button>
                <button
                  type="button"
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

// import React, { useEffect, useState } from "react";
// import { ethers } from "ethers";
// import LeaseAgreementCard from "./components/LeaseAgreementCard";
// import abi from "./contracts/Factory.json";

// const App = () => {
//   const [leaseAgreements, setLeaseAgreements] = useState([]);
//   const [contractState, setContractState] = useState({
//     provider: null,
//     signer: null,
//     contract: null,
//   });
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     tenant: "",
//     monthlyRent: "",
//     leaseDuration: "",
//   });

//   useEffect(() => {
//     const fetchLeaseAgreements = async () => {
//       const contractAddress = "0x97ACcE891e6E88D49ff79AF2aE37c66123f59408";
//       const contractAbi = abi.abi;

//       try {
//         const { ethereum } = window;
//         if (ethereum) {
//           const accounts = await ethereum.request({
//             method: "eth_requestAccounts",
//           });
//           const provider = new ethers.providers.Web3Provider(ethereum);
//           const signer = provider.getSigner();
//           const contract = new ethers.Contract(
//             contractAddress,
//             contractAbi,
//             signer
//           );
//           setContractState({
//             provider,
//             signer,
//             contract,
//           });
//           const addresses = await contract.getLeaseAgreements();
//           setLeaseAgreements(addresses);
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     fetchLeaseAgreements();
//   }, []);

//   const openModal = () => {
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   const handleFormChange = (event) => {
//     const { name, value } = event.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleFormSubmit = async (event) => {
//     event.preventDefault();
//     const { contract } = contractState;
//     await contract.createLeaseAgreement(
//       formData.tenant,
//       formData.monthlyRent,
//       formData.leaseDuration
//     );
//     closeModal();
//     const addresses = await contract.getLeaseAgreements();
//     setLeaseAgreements(addresses);
//   };

//   return (
//     <div className="container mx-auto mt-8">
//       <div className="flex justify-end mb-4">
//         <button
//           className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
//           onClick={openModal}
//         >
//           Create Lease Agreement
//         </button>
//       </div>
//       <h1 className="text-2xl font-semibold mb-4">Lease Agreements</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {leaseAgreements?.map((address, index) => (
//           <LeaseAgreementCard key={address} leaseAgreementAddress={address} />
//         ))}
//       </div>

//       {isModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded shadow">
//             <h2 className="text-lg font-semibold mb-4">
//               Create Lease Agreement
//             </h2>
//             <form>
//               <div className="mb-4">
//                 <label className="block font-semibold">Tenant Address</label>
//                 <input
//                   type="text"
//                   name="tenant"
//                   value={formData.tenant}
//                   onChange={handleFormChange}
//                   className="w-full border rounded px-3 py-2"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block font-semibold">Monthly Rent</label>
//                 <input
//                   type="number"
//                   name="monthlyRent"
//                   value={formData.monthlyRent}
//                   onChange={handleFormChange}
//                   className="w-full border rounded px-3 py-2"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block font-semibold">
//                   Lease Duration (months)
//                 </label>
//                 <input
//                   type="number"
//                   name="leaseDuration"
//                   value={formData.leaseDuration}
//                   onChange={handleFormChange}
//                   className="w-full border rounded px-3 py-2"
//                 />
//               </div>
//               <div className="flex justify-end">
//                 <button
//                   type="button"
//                   className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2"
//                   onClick={handleFormSubmit}
//                 >
//                   Create
//                 </button>
//                 <button
//                   type="button"
//                   className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
//                   onClick={closeModal}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;

////////////////////////////////////////////////////////
