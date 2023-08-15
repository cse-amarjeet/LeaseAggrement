// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./LeaseAgreement.sol";

contract LeaseAgreementFactory {
    address[] public leaseAgreements;
    
    event LeaseAgreementCreated(address indexed leaseAgreement, address indexed landlord, address indexed tenant);

    function createLeaseAgreement(string memory _aggrementName,string memory _ownerName,string memory _tenantName,address _tenant, uint256 _monthlyRent, uint256 _leaseDurationMonths) external {
        LeaseAgreement newLease = new LeaseAgreement(_aggrementName,_ownerName,_tenantName,_tenant, _monthlyRent, _leaseDurationMonths);
        leaseAgreements.push(address(newLease));
        
        emit LeaseAgreementCreated(address(newLease), msg.sender, _tenant);
    }

    function getLeaseAgreements() external view returns (address[] memory) {
        return leaseAgreements;
    }
}
// Factory Contract address: 0x97ACcE891e6E88D49ff79AF2aE37c66123f59408