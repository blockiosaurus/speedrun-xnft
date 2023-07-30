import { Connection } from "@solana/web3.js";

export function getWalletAddress() {
    let address;
    if (isXNFT()) {
        address = window.xnft.solana.publicKey;
    } else {
        console.log(window.phantom.solana.isConnected);
        console.log(window.phantom.solana.isPhantom);
        console.log(window.phantom.solana.publicKey);
        address = window.phantom.solana.publicKey;
    }
    console.log(address);
    return address;
}

export function getConnection() {
    return new Connection(window.xnft.solana.connection.rpcEndpoint, { confirmTransactionInitialTimeout: 600000 });
}

export function isXNFT() {
    if (window.xnft === undefined || window.xnft.solana === undefined || window.xnft.solana.isXnft === undefined) {
        console.log("Not XNFT");
        return false;
    } else {
        console.log("Is XNFT");
        return true;
    }
}