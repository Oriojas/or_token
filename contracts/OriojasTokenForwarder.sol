// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";

contract OriojasTokenForwarder is EIP712 {
    // Defining a meta-transaction structure
    struct MetaTx {
        address from; // cuenta que hace la firma off-chage
        address to; // contrato que se quiere invocar
        uint256 nonce; // para evitar ataques de replicamiento
        bytes data; // codificacion del llamado a una funcion
    }

    // typeHash
    bytes32 private constant _SIGNATURE_STRUCT_HASH =
        keccak256("MetaTx(address from,address to,uint256 nonce,bytes data)");

    // storing nonces to avoid reply attacks guarda los nonce
    mapping(address => uint256) private _nonces;

    // Initiating contracts
    constructor() EIP712("OriojasTokenForwarder", "0.0.1") {}

    // Getting current nonce for an account
    function getNonce(address from) public view returns (uint256) {
        return _nonces[from];
    }

    // Veriying meta-transaction
    function _verifyMetaTx(MetaTx calldata metaTx, bytes calldata signature)
        private
        view
        returns (bool)
    {
        bytes32 digest = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    // hashStruct(s)
                    _SIGNATURE_STRUCT_HASH,
                    metaTx.from,
                    metaTx.to,
                    metaTx.nonce,
                    keccak256(metaTx.data)
                )
            )
        );

        address metaTxSigner = ECDSA.recover(digest, signature);
        // Verifying signer does match GOAL
        return metaTxSigner == metaTx.from;
    }

    // executing a meta-transaction
    function executeFunction(MetaTx calldata metaTx, bytes calldata signature)
        public
        returns (bool)
    {
        // Verifying meta-tx signature
        require(
            _verifyMetaTx(metaTx, signature),
            "OriojasTokenForwarder: Invalid signature"
        );
        // incrementing nonce so the message cannot be used again
        _nonces[metaTx.from] = metaTx.nonce + 1;

        // adding address to the transaction data so the token contract can use it
        (bool success, ) = metaTx.to.call(
            abi.encodePacked(metaTx.data, metaTx.from)
        );
        // returning wheter contract execution was successful
        return success;
    }
}