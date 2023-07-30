import { Connection } from "@solana/web3.js";

export function getWalletAddress() {
    let address;
    if (isXNFT()) {
        address = window.xnft.solana.publicKey;
    } else {
        // console.log(window.phantom.solana.isConnected);
        // console.log(window.phantom.solana.isPhantom);
        // console.log(window.phantom.solana.publicKey);
        address = window.phantom.solana.publicKey;
    }
    // console.log(address);
    return address;
}

export function getConnection() {
    if (isXNFT()) {
    return new Connection(window.xnft.solana.connection.rpcEndpoint, { confirmTransactionInitialTimeout: 600000 });
    } else {
        return new Connection("https://solana-mainnet.rpc.extrnode.com", { confirmTransactionInitialTimeout: 600000 });
    }
}

export function isXNFT() {
    if (window.xnft === undefined || window.xnft.solana === undefined || window.xnft.solana.isXnft === undefined) {
        return false;
    } else {
        return true;
    }
}