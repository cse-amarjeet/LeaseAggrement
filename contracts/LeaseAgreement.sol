// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract Proposal {
    string public subject;
    address public tokenAddress;
    address[] public voters;
    mapping(address => bool) public voted;
    uint256 public requiredVotes;
    uint256 public votePrice = 5;
    uint256 public upVoteCount;
    uint256 public downVoteCount;
    bool public proposalStatus=false;

    constructor(string memory _subject, address _tokenAddress, uint _requiredVotes) {
        subject = _subject;
        requiredVotes = _requiredVotes; // Adjust as needed
        tokenAddress = _tokenAddress;
    }

    modifier onlyVoters() {
        require(isValidVoter(msg.sender), "Invalid voter");
        _;
    }

    function isValidVoter(address student) internal view returns (bool) {
        VotingDAOFactory factory = VotingDAOFactory(tokenAddress);
        if(factory.lastMintTimestamp(student) == 0){
            return false;
        }
        else{
            return true;
        }
    }

    function vote(bool inFavor) public  {
        VotingDAOFactory factory = VotingDAOFactory(tokenAddress);
        require(!voted[msg.sender], "Already voted");
        require(factory.balanceOf(msg.sender) >= votePrice, "Not enough balance");
        
        // Debit the votePrice tokens from the sender
        factory.internalBurn(msg.sender, votePrice);

        voted[msg.sender] = true;
        voters.push(msg.sender);

        if (inFavor) {
            upVoteCount=upVoteCount+1;
        } else {
            downVoteCount=downVoteCount+1;
        }
        if(upVoteCount>=requiredVotes){
            proposalStatus=true;
        }
 }
}
