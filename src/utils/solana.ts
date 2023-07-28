import { Connection } from "@solana/web3.js";

export function getWalletAddress() {
    return window.xnft.solana.publicKey;
}

export function getConnection() {
    return new Connection(window.xnft.solana.connection.rpcEndpoint, { confirmTransactionInitialTimeout: 600000 });
}