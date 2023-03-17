// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract Decentainment is ERC721URIStorage{
    //***************** EVENTS **********************/
    event _createOG(string _nftURI,uint128 _listedAmount,uint256 _maxSupply, uint256 _number);

    //********** STATE VARIABLES ************/
    using Counters for Counters.Counter;
    IERC20 public tokenAddress;
    address public owner;

    Counters.Counter private _tokenIds;

    mapping(uint256 => mapping(address => bool)) public purchased;
    mapping(address => uint256[]) public getID;
    uint OGNumber = 1;

    struct OGDetails {
        string nftURI;
        uint128 listedAmount;
        address OGCreator;
        uint256 OGCardCount;
        uint256 maxSupply;
        uint256 amountEarned;
        uint256 slotNumber;
    }
    mapping(uint256 => OGDetails) public OGCount;


    constructor(IERC20 _tokenAddress) ERC721("Decentainment", "DCT"){
        owner = msg.sender;
        tokenAddress = _tokenAddress;
    }

    /**
     * @notice  . This can only be called by creator/ Artist
     * @dev     . This is a function responsible for creating a fanbase nft token for fans
     * @param   _nftURI  . The URI of your NFT
     * @param   _listedAmount  . The amount you are willing to sell each nft for fans
     * @param   _maxSupply  . maximum supply of NFt that will ever exist
     */
    function createOG(string memory _nftURI, uint128 _listedAmount, uint256 _maxSupply) external {
        OGDetails storage OGD = OGCount[OGNumber];
        OGD.nftURI = _nftURI;
        OGD.listedAmount = _listedAmount;
        OGD.OGCreator = msg.sender;
        OGD.maxSupply = _maxSupply;
        OGD.slotNumber = OGNumber;

        emit _createOG(_nftURI, _listedAmount, _maxSupply, OGNumber);

        OGNumber++;
    }

    /**
     * @notice  . You must have approved the used token address before calling this function
     * @dev     . Function for showing you are a true fan of an artist
     * @param   _OGNumber  . identification number of your artist
     */
    function joinOG(uint256 _OGNumber) external {
        require(!purchased[_OGNumber][msg.sender], "You can't purchase twice");
        OGDetails storage OGD = OGCount[_OGNumber];
        require(tokenAddress.transferFrom(msg.sender, address(this), OGD.listedAmount), "Insufficient Amount");
        OGD.amountEarned += OGD.listedAmount;
        uint256 tokenID = _tokenIds.current();
        getID[msg.sender].push(tokenID);
        _mint(msg.sender, tokenID);
        _setTokenURI(tokenID, OGD.nftURI);
        OGD.OGCardCount++;
        _tokenIds.increment();

        purchased[_OGNumber][msg.sender] = true;
    }

    /**
     * @notice  . This can only be called by creator/ Artist
     * @dev     . function to withdraw amount accumulated from nft sold to fans
     * @param   _OGNumber  . identification number of your artist
     */
    function withdrawOGDeposit(uint256 _OGNumber) external {
       OGDetails storage OGD = OGCount[_OGNumber];
       require(msg.sender == OGD.OGCreator, "You are not a creator");
       uint256 amountToWithdraw = OGD.amountEarned;
       OGD.amountEarned = 0;
       require(tokenAddress.transfer(msg.sender, amountToWithdraw), "Not successful");
    }

    //***************** View functions **********************/
    /**
     * @dev     . function to get tokenuri of all nft purchased by a user
     */
    function getTokensURI(address _addr) external view returns(string[] memory _tokenURI) {
        uint256 length = getID[_addr].length;
        _tokenURI = new string[](length);

        for(uint256 i = 0; i < length; i++){
            _tokenURI[i] = tokenURI(getID[_addr][i]);
        }
    }

    /**
     * @dev     . function to get all nft collections
     */
    function getAllOG() external view returns(OGDetails[] memory _allOG){
        _allOG = new OGDetails[](OGNumber - 1);

        for(uint256 i = 1; i < OGNumber; i++){
            _allOG[i -1] = OGCount[i];
        }
    }

    function getUserData(address _addr) external view returns(uint256[] memory _userData){
        uint len = getID[_addr].length;
        _userData = new uint256[](len);

        for(uint256 i = 0; i < len; i++){
            _userData[i] = getID[_addr][i];
        }

    }

    /**
     * @dev     . function to get artist details
     * @param   _OGNumber  . identification number of your artist
     */
    function getArtist(uint256 _OGNumber) external view returns(OGDetails memory){
        return OGCount[_OGNumber];
    }

    //****************** Miscelleneous *************************/
    /**
     * @notice  . can only be called by admin
     * @dev     . this function is responsible for withdrawing any tokens mistakenly sent to the contract
     * @param   _tokenAddress  . the token address of the tokens to withdraw
     */
    function genericWithdrawal(IERC20 _tokenAddress) external {
        require(owner == msg.sender, "Only owner can call this");
        uint256 contractBalance = _tokenAddress.balanceOf(address(this));
        require(_tokenAddress.transfer(msg.sender, contractBalance), "Not successful");
        
    }

    /**
     * @notice  . can only be called by admin
     * @dev     . this function is responsible for withdrawing any eth mistakenly sent to the contract
     */
    function genericWithdrawETH() external {
        require(msg.sender == owner, "Only owner can call this");
        uint256 contractBal = address(this).balance;
        (bool sent, ) = payable(msg.sender).call{value: contractBal}("");
        require(sent, "Failed to send ether");
    }

    receive() external payable{}
    fallback() external payable{}

}