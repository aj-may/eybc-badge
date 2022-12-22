// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/draft-ERC721Votes.sol";
import "@randombits/contracts/contracts/ERC721Soulbound.sol";

contract Badge is ERC721, ERC721Enumerable, ERC721Burnable, ERC721Soulbound, AccessControlEnumerable, EIP712, ERC721Votes {
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    string private _metadataURI;

    constructor(string memory tokenName, string memory tokenSymbol, string memory metadataURI)
        ERC721(tokenName, tokenSymbol)
        EIP712(tokenName, "1")
    {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        setMetadataURI(metadataURI);
    }

    function contractURI() public view returns (string memory) {
        return _metadataURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return _metadataURI;
    }

    function setMetadataURI(string memory metadataURI) public onlyRole(DEFAULT_ADMIN_ROLE) {
      _metadataURI = metadataURI;
    }

    function issue(address to, uint256 tokenId) public onlyRole(ISSUER_ROLE) {
        _safeMint(to, tokenId);
    }

    function revoke(uint256 tokenId) public onlyRole(ISSUER_ROLE) {
        _burn(tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable, ERC721Soulbound)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _afterTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Votes)
    {
        super._afterTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, AccessControlEnumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
