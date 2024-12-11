export class Config {
  static GWEIPRICE = 0.15; // Harga gas yang rendah
  static WAITFORBLOCKCONFIRMATION = true; // Recommended untuk keamanan
  static TXAMOUNTMIN = 0.0001; 
  static TXAMOUNTMAX = 0.001;

  // WRAP UNWRAP SECTION
  static USEWRAPUNWRAP = true;
  static WRAPUNWRAPCOUNT = 3; // Jumlah transaksi wrap/unwrap
  static WETHCONTRACTADDRESS = "0x4200000000000000000000000000000000000006"; // WETH di Arbitrum

  // RAW TX SECTION
  static USERAWTXDATA = false;
  static RAWTXCOUNT = 3;
  static RAWTX = {
    CONTRACTTOINTERACT: "0x",
    RAWDATA: "0x",
  };

  // TRANSFER SECTION
  static USESELFTRANSFER = true;
  static SELFTRANSFERCOUNT = 3;
  static CONTRACTADDRESS = undefined; // Menggunakan native ETH

  // RPC PROVIDER SECTION
  static RPC = {
    CHAINID: 1946, // Update ke Soneium Chain ID
    RPCURL: "https://soneium-minato.g.alchemy.com/v2/YOUR_API_KEY",
    EXPLORER: "https://explorer-testnet.soneium.org/",
    SYMBOL: "ETH",
  };

  // NETWORK CONFIGURATION
  static NETWORKS = {
    SEPOLIA: {
      RPC: "https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY",
      CHAINID: 11155111,
      BRIDGE_CONTRACT: "0x5f5a404A5edabcDD80DB05E8e54A78c9EBF000C2",
      EXPLORER: "https://sepolia.etherscan.io/tx/"
    },
    SONEIUM: {
      RPC: "https://soneium-minato.g.alchemy.com/v2/YOUR_API_KEY",
      CHAINID: 1946,
      EXPLORER: "https://explorer-testnet.soneium.org/tx/",
      MESSENGER_CONTRACT: "0x4200000000000000000000000000000000000007",
      IMPLEMENTATION: "0xC0d3c0d3c0D3c0D3C0d3C0D3C0D3c0d3c0d30007",
      BRIDGE_RELAYER: "0x1295245D202724Dc28a2b688952cb56c882c3380"
    }
  };

  // FAUCET CONFIGURATION
  static FAUCET = {
    CONTRACT: "0x3C1545304c6540bD483D6178Ff13030BbC9AAf6A",
    TOKENS: {
      ASTR: {
        ADDRESS: "0x26e6f7c7047252dde3dcbf26aa492e6a264db655",
        SYMBOL: "ASTR",
        DECIMALS: 18
      },
      USDC: {
        ADDRESS: "0xe9a198d38483ad727abc8b0b1e16b2d338cf0391",
        SYMBOL: "USDC.e",
        DECIMALS: 6
      },
      WBTC: {
        ADDRESS: "0x0ef029fc24dc1368dfae79b6943ec89874973d04",
        SYMBOL: "WBTC",
        DECIMALS: 8
      },
      SOLVBTC: {
        ADDRESS: "0xa17d561a07b0ce487552dae2d80d9d0cf1b5be66",
        SYMBOL: "SolvBTC",
        DECIMALS: 18
      },
      SOLVBTCBBN: {
        ADDRESS: "0xdcfcc99c5e18b22b90af30021586161834a21642",
        SYMBOL: "SolvBTC.BBN",
        DECIMALS: 18
      },
      VASTR: {
        ADDRESS: "0x185beac2fa9bd1c7ba5d28afcf06c22c2b5e9b09",
        SYMBOL: "vASTR",
        DECIMALS: 18
      },
      STONE: {
        ADDRESS: "0x64b14dbd97025fd7ccd62d9dab858f81d6bf6b1a",
        SYMBOL: "STONE",
        DECIMALS: 18
      }
    }
  };
  // LENDING POOL CONFIGURATION
  static LENDING = {
    L2POOL: "0xEc38a5Cd88E87Fec0D10822DE8a3D6dB144931DA",
    IMPLEMENTATION: "0x336dd7402E73022e081f748a7fbe30DFaeEff2Ab"
  };
}

