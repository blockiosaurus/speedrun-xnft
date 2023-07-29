import { Program, AnchorProvider, BN } from '@coral-xyz/anchor';
import { getConnection, getWalletAddress } from './solana';
import { MemcmpFilter, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
const idl = require('../idls/speedrun_program.json');

const BSOL_MINT = new PublicKey("bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1");
const BSOL_FEED = new PublicKey("EeSBrqRNbPkWY25BQZZMSfBLeLnLpkZ3oMYnPn15yjQp");

const LAINESOL_MINT = new PublicKey("LAinEtNLgpmCP9Rvsf5Hn8W6EhNiKLZQti1xfWMLy6X");
const LAINESOL_FEED = new PublicKey("2EU8d2ohBgKBYnHUFQL3oqQWX2jFkZiKBPmaDAbZMRdP");

const BONK_MINT = new PublicKey("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263");
const BONK_FEED = new PublicKey("6qBqGAYmoZw2r4fda7671NSUbcDWE4XicJdJoWqK8aTe");

const cropToMint: Map<string, PublicKey> = new Map(
    [["solBlazePacket", BSOL_MINT],
    ["laineSolPacket", LAINESOL_MINT],
    ["bonkPacket", BONK_MINT]]
);

const cropTypeToMint: Map<string, PublicKey> = new Map(
    [["blaze", BSOL_MINT],
    ["laine", LAINESOL_MINT],
    ["bonk", BONK_MINT]]
);

const mintToCrop: Map<string, string> = new Map(
    [[BSOL_MINT.toString(), "blaze"],
    [LAINESOL_MINT.toString(), "laine"],
    [BONK_MINT.toString(), "bonk"]]
);

const cropToFeed: Map<string, PublicKey> = new Map(
    [["solBlazePacket", BSOL_FEED],
    ["laineSolPacket", LAINESOL_FEED],
    ["bonkPacket", BONK_FEED]]
);

const cropTypeToFeed: Map<string, PublicKey> = new Map(
    [["blaze", BSOL_FEED],
    ["laine", LAINESOL_FEED],
    ["bonk", BONK_FEED]]
);

export class Crop {
    tileX: number;
    tileY: number;
    type: string;
    balance: number;
    growth: Growth;

    constructor(tileX: number, tileY: number, type: string, balance: number, growth: Growth) {
        this.tileX = tileX;
        this.tileY = tileY;
        this.type = type;
        this.balance = balance;
        this.growth = growth;
    }
}

export enum Growth {
    BULL,
    BEAR,
    STAGNANT,
}

export function getProgram() {
    const provider = new AnchorProvider(getConnection(), window.xnft.solana, { skipPreflight: true, commitment: 'confirmed', maxRetries: 100 });
    const programId = new PublicKey("FARMTfoLHaQeoYgK1tP3dgC8emwkMtfxyg6ZTS7iMhgr");
    return new Program(idl, programId, provider);
}

export async function plantCrop(program: Program, cropType: string, x: number, y: number) {
    const walletAddress = getWalletAddress();
    const mint = cropToMint.get(cropType);
    const feed = cropToFeed.get(cropType);
    const ata = getAssociatedTokenAddressSync(mint, walletAddress);
    const cropAddress = PublicKey.findProgramAddressSync(
        [Buffer.from("crop"), mint?.toBuffer(), walletAddress.toBuffer()],
        program.programId
    );

    const init_tx = await program.methods
        .initCrop({ positionX: x, positionY: y })
        .accounts({
            crop: cropAddress[0],
            mint: mint,
            tokenAccount: ata,
            payer: walletAddress,
            aggregator: feed,
        })
        .rpc({ skipPreflight: true });
    console.log(init_tx);
}

export async function harvestCrop(program: Program, cropType: string) {
    const walletAddress = getWalletAddress();
    const mint = cropTypeToMint.get(cropType);
    const cropAddress = PublicKey.findProgramAddressSync(
        [Buffer.from("crop"), mint?.toBuffer(), walletAddress.toBuffer()],
        program.programId
    );

    const init_tx = await program.methods
        .closeCrop()
        .accounts({
            crop: cropAddress[0],
            mint: mint,
            payer: walletAddress,
        })
        .rpc({ skipPreflight: true });
    console.log(init_tx);
}

export async function updateCrop(program: Program, cropType: string) {
    const walletAddress = getWalletAddress();
    const mint = cropTypeToMint.get(cropType);
    const feed = cropTypeToFeed.get(cropType);
    const ata = getAssociatedTokenAddressSync(mint, walletAddress);
    const cropAddress = PublicKey.findProgramAddressSync(
        [Buffer.from("crop"), mint?.toBuffer(), walletAddress.toBuffer()],
        program.programId
    );

    const init_tx = await program.methods
        .updateCrop()
        .accounts({
            crop: cropAddress[0],
            mint: mint,
            tokenAccount: ata,
            payer: walletAddress,
            aggregator: feed,
        })
        .rpc({ skipPreflight: true });
    console.log(init_tx);
}

export async function fetchCrops(program: Program) {
    let cropList = [];
    const filter: MemcmpFilter = {
        memcmp: {
            offset: 8,
            bytes: getWalletAddress().toBase58(),
        }
    };
    const crops = await program.account.crop.all([filter]);
    for (const crop of crops) {
        console.log(crop.account);
        const x = crop.account.positionX as number;
        const y = crop.account.positionY as number;
        const type = mintToCrop.get((crop.account.mint as PublicKey).toString())!;
        const balance = (crop.account.plantedAmount as BN).toNumber();
        const plantedValue = (crop.account.plantedValue as BN).toNumber();
        const currentValue = (crop.account.updateValue as BN).toNumber();
        const growth = (currentValue - plantedValue) / plantedValue;
        let growthType = Growth.STAGNANT;
        if (growth > 0) {
            growthType = Growth.BULL;
        } else if (growth < 0) {
            growthType = Growth.BEAR;
        }
        cropList.push(new Crop(x, y, type, balance, growthType));
    }
    return cropList;
}