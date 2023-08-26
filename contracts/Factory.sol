// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract VotingDAOFactory is ERC20 {
    address[] public deployedProposals;
    mapping(address => uint256) public lastMintTimestamp;
    uint256 public maxTokensPerMonth = 100;
    uint256 public monthDuration = 30 days;
    uint256 public createProposalPrice=10;

    constructor(string memory name, string memory symbol, uint256 initialSupply) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
    }

  
    function createProposal(string memory subject, uint _requiredVotes) public {
        require(balanceOf(msg.sender) >= createProposalPrice, "Not enough balance");
        
        // Debit the createProposalPrice tokens from the sender
        _burn(msg.sender, createProposalPrice);

        Proposal newProposal = new Proposal(subject, address(this), _requiredVotes);
        deployedProposals.push(address(newProposal));
    }


    function getDeployedProposals() public view returns (address[] memory) {
        return deployedProposals;
    }
    function internalBurn(address account, uint256 amount) external  {
        _burn(account, amount);
    }

    function canMintTokens(address student) public view returns (bool) {
        uint256 lastMint = lastMintTimestamp[student];
        if (block.timestamp - lastMint >= monthDuration) {
            return true;
        } else if (balanceOf(student) < maxTokensPerMonth) {
            return true;
        } else {
            return false;
        }
    }

    function mintTokens() public {
        require(canMintTokens(msg.sender), "Monthly token limit reached");
        _mint(msg.sender, maxTokensPerMonth);
        lastMintTimestamp[msg.sender] = block.timestamp;
    }
}

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
