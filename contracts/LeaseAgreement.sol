// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LeaseAgreement {
    address public landlord;
    address public tenant;
    
    uint256 public monthlyRent;
    uint256 public leaseDuration; // in months
    uint256 public startDate;
    uint256 public endDate;
    bool public leaseTerminated;
    bool public leaseActive;
    string public aggrementName;
    string public ownerName;
    string public tenantName;
    
    modifier onlyLandlord() {
        require(msg.sender == landlord, "Only the landlord can call this function.");
        _;
    }
    
    modifier onlyTenant() {
        require(msg.sender == tenant, "Only the tenant can call this function.");
        _;
    }
    
    modifier leaseIsActive() {
        require(leaseActive, "Lease is not active.");
        _;
    }
    
    constructor(
        string memory _aggrementName,
        string memory _ownerName,
        string memory _tenantName,
        address _tenant,
        uint256 _monthlyRent,
        uint256 _leaseDurationMonths
    ) {
        landlord = tx.origin;
        tenant = _tenant;
        monthlyRent = _monthlyRent;
        leaseDuration = _leaseDurationMonths * 30 days;
        startDate = block.timestamp;
        endDate = startDate + leaseDuration;
        leaseTerminated = false;
        leaseActive = true;
        aggrementName=_aggrementName;
        tenantName=_tenantName;
        ownerName=_ownerName;
    }
    
    function makePayment() external payable onlyTenant leaseIsActive {
        require(msg.value == monthlyRent, "Incorrect payment amount.");
        // Log payment event or update payment history
        
        if (block.timestamp >= endDate) {
            leaseTerminated = true;
            leaseActive = false;
        }
        payable(landlord).transfer(msg.value);
    }
    function terminateLease() external onlyLandlord {
        require(!leaseTerminated, "Lease is already terminated.");
        leaseTerminated = true;
        leaseActive = false;
    }
    function getRemainingLeaseDuration() external view returns (uint256) {
        if (block.timestamp >= endDate) {
            return 0;
        }
        return endDate - block.timestamp;
    }
}
