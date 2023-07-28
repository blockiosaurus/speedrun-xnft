import { PublicKey } from "@solana/web3.js";
import { getConnection, getWalletAddress } from "./solana";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";

export const BSOL_MINT = new PublicKey("bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1");
export const LAINESOL_MINT = new PublicKey("LAinEtNLgpmCP9Rvsf5Hn8W6EhNiKLZQti1xfWMLy6X");
export const BONK_MINT = new PublicKey("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263");

export async function getTokenBalance(mint: PublicKey | null) {
    const connection = getConnection();
    if (mint) {
        const ata = getAssociatedTokenAddressSync(mint, getWalletAddress());
        return (await connection.getTokenAccountBalance(ata)).value.uiAmount as number;
    } else {
        return (await connection.getBalance(getWalletAddress()) / 1e9);
    }
}