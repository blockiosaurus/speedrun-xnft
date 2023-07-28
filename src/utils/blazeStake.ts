import { depositSol, stakePoolInfo } from "@solana/spl-stake-pool";
import { Connection, PublicKey, Transaction, LAMPORTS_PER_SOL, SystemProgram, sendAndConfirmRawTransaction, TransactionConfirmationStrategy } from "@solana/web3.js";

const BLAZESTAKE_POOL = new PublicKey("stk9ApL5HeVAwPLr3TLhDXdZS8ptVu7zp6ov8HFDuMi");
const LAINESOL_POOL = new PublicKey("2qyEeSAWKfU18AFthrF7JA8z8ZCi1yt76Tqs917vwQTV");
const DAOSOL_POOL = new PublicKey("7ge2xKsZXmqPxa3YmXxXmzCp9Hc2ezrTxh6PECaxCwrL");
const SOLPAY_API_ACTIVATION = new PublicKey("7f18MLpvAp48ifA1B8q8FBdrGQhyt9u5Lku2VBYejzJL");

export async function stakeBSOL(pubkey: PublicKey) {
    const connection = new Connection(window.xnft.solana.connection.rpcEndpoint, { confirmTransactionInitialTimeout: 600000 });
    let info = await stakePoolInfo(connection, DAOSOL_POOL);
    console.log(info);

    let depositTx = await depositSol(
        connection,
        BLAZESTAKE_POOL,
        pubkey,
        0.1 * LAMPORTS_PER_SOL,
    );

    console.log(depositTx);

    let transaction = new Transaction();
    transaction.add(SystemProgram.transfer({
        fromPubkey: pubkey,
        toPubkey: SOLPAY_API_ACTIVATION,
        lamports: 5000
    }));
    transaction.add(...depositTx.instructions);
    transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;

    transaction = await window.xnft.solana.signTransaction(transaction);

    let signers = depositTx.signers;
    if (signers.length > 0) {
        transaction.partialSign(...signers);
    }

    let txid = await sendAndConfirmRawTransaction(connection, transaction.serialize(), { skipPreflight: true });
    console.log(txid);
}