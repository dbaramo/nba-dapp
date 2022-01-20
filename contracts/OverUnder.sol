pragma solidity ^0.4.11;
import "github.com/oraclize/ethereum-api/oraclizeAPI.sol";

contract OverUnder is usingOraclize {
    address public player1;
    address public player2;
    uint public wager;
    string public scoreUrl;
    bool public over;
    uint public targetScore;
    bool public betActive;
    uint public timeToFetchScore;
    uint public totalScore;
    
    // Logs state of the contract
    event contractState(string state);
    
    function OverUnder(string _scoreUrl, bool _over, uint _targetScore, uint _timeToFetchScore) public payable {
        require(msg.value > 0);
        player1 = msg.sender;
        wager = msg.value;
        scoreUrl = _scoreUrl;
        over = _over;
        targetScore = _targetScore;
        timeToFetchScore = _timeToFetchScore;
        checkScores();
        contractState('Open');
    }
    
    function acceptBet(string _scoreUrl, bool _over, uint _targetScore) external payable {
        require(msg.value == wager && betActive == false && _over != over && targetScore == _targetScore && compareStrings(scoreUrl, _scoreUrl) == true);
        player2 = msg.sender;
        betActive = true;
        contractState('Active');
    }
    
    function cancelBet() external {
        require(msg.sender == player1 && betActive == false);
        contractState('Canceled');
        selfdestruct(player1);
    }
    
    function checkScores() payable {
        oraclize_query(timeToFetchScore, "URL", scoreUrl);
    }
    
    function __callback(bytes32 myid, string result) {
        if (msg.sender != oraclize_cbAddress()){
            revert();
        } 
        
        totalScore = stringToUint(result);
        payoutWinner();
    }
    
    function payoutWinner() internal{
        if(targetScore == totalScore || totalScore == 0){
            uint refund = div(this.balance, 2);
            player1.transfer(refund);
            player2.transfer(this.balance);
            contractState('Finished');
        }
        
        if(over == true && totalScore > targetScore || over == false && totalScore < targetScore){
            player1.send(this.balance);
            contractState('Finished');
        }
        
        if(over == true && totalScore < targetScore || over == false && totalScore > targetScore){
            player2.send(this.balance);
            contractState('Finished');
        }
    }
    
    function compareStrings (string a, string b) view returns (bool){
       return keccak256(a) == keccak256(b);
   }
   
    // Convert string to uint
    function stringToUint(string s) constant returns (uint result) {
        bytes memory b = bytes(s);
        uint i;
        result = 0;
        for (i = 0; i < b.length; i++) {
            uint c = uint(b[i]);
            if (c >= 48 && c <= 57) {
                result = result * 10 + (c - 48);
            }
        }
    }
    
        // SafeMath division
     function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // assert(b > 0); // Solidity automatically throws when dividing by 0
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return c;
    }
}
