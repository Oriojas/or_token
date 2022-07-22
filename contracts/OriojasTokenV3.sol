// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// import upgradeable version of the ERC20 contract
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
// import Ownable upgradeable so only the contract owner can run admin actions on the contract
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
// import the open the Proxy contract
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
// import meta-trans support
import "@openzeppelin/contracts-upgradeable/metatx/ERC2771ContextUpgradeable.sol";

contract OriojasTokenV3 is 
            ERC20Upgradeable,
            UUPSUpgradeable,
            OwnableUpgradeable,
            ERC2771ContextUpgradeable
{
    // using an initializer instead of a contructor
    function initialize(uint256 initialSupply, address trustedForwarder) public initializer {
        // As we are not using constructors we have to use the ERC20's contract initializer as well
        __ERC20_init("OriojasTokenV3", "ORTK");
        // init the ownable contract and proxy
        __Ownable_init_unchained();
        __UUPSUpgradeable_init();
        // mint an initial amount of tokens
        _mint(msg.sender, initialSupply * (10**decimals()));
        // Initiating ERC2771Context contract
        __ERC2771Context_init_unchained(trustedForwarder);
    }

    // Override this function required for the proxy to work
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner{
    // onlyOwner se encargado de inicializar la variable deque el dueno del contrato sea el mismo que lo modifica
    }

    // New function that can only be executed by the contract owner
    function mint(address toAccount, uint256 amount) public onlyOwner {
        _mint(toAccount, amount);
    }

    // Overriding message _msgSender function so the one provided by ERC2771Context contract is used (To extract the sender from the execution data)
    function _msgSender()
        internal
        view
        override(ERC2771ContextUpgradeable, ContextUpgradeable)
        returns (address)
    {
        return ERC2771ContextUpgradeable._msgSender();
    }

    // Overriding message _msgData function so the one provided by ERC2771Context contract is used (In case there is an internal function that needs it)
    function _msgData()
        internal
        view
        override(ERC2771ContextUpgradeable, ContextUpgradeable)
        returns (bytes calldata)
    {
        return ERC2771ContextUpgradeable._msgData();
    }
}




