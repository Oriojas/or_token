// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract OriojasToken is ERC20 {
    // Se inicializa en contratocon el nombre del token y su simbolo
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        // la funcion mint que inicia el contrato con _mint(acco// la funcion mint que inicia el contrunt, amount) la cuenta y los tokens iniciales
        _mint(msg.sender, 100000 * (10 ** decimals())); // decimals es una funcion interna con los decimales del estandar

    }     

    // Con esta funcion se cambia lacantidad de decimalesdel contrato
    function decimals() public pure override returns(uint8) {
        return 6;
    }
}