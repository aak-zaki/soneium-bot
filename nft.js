// Konstanta untuk warna
const COLORS = {
    CYAN: '\x1b[36m',
    GREEN: '\x1b[32m',
    YELLOW: '\x1b[33m',
    RED: '\x1b[31m',
    RESET: '\x1b[0m',
    BLUE: '\x1b[34m',
    MAGENTA: '\x1b[35m',
    BRIGHT: '\x1b[1m',
};

// Clear console dan tampilkan banner
console.clear();
console.log('\x1b[36m%s\x1b[0m', `
╔═══════════════════════════════════════╗
║        Soneium NFT Minter v1.0        ║
║         By: Aethereal Team            ║
╚═══════════════════════════════════════╝
`);

// Debug imports
console.log(`${COLORS.CYAN}🔄 Initializing...${COLORS.RESET}`);

// Error handling global
process.on('uncaughtException', (error) => {
    console.error('\n❌ Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    console.error('\n❌ Unhandled Promise Rejection:', error);
    process.exit(1);
});

// Import modules
let privateKey, Helper, ethers, input, logger, Config;

try {
    console.log('📚 Loading modules...');
    
    // Import semua module yang diperlukan
    const accounts = await import("./accounts/accounts.js");
    privateKey = accounts.privateKey;
    console.log('✅ Accounts loaded');
    
    const helperModule = await import("./src/utils/helper.js");
    Helper = helperModule.Helper;
    console.log('✅ Helper loaded');
    
    ethers = await import("ethers");
    console.log('✅ Ethers loaded');
    
    const configModule = await import("./config/config.js");
    Config = configModule.Config;
    console.log('✅ Config loaded');

    try {
        const inputModule = await import("@inquirer/prompts");
        input = inputModule;
        console.log('✅ Input module loaded');
    } catch (e) {
        throw new Error(`Failed to load input: ${e.message}`);
    }

    // Konstanta untuk NFT Minting
    const NFT_CONFIG = {
        CONTRACT_ADDRESS: "0xf7d7158da59aee7c82d68cb61f8ddd2161fdab2d",
        MINT_PRICE: "0x5af3107a4000",
        MINT_DATA: (address) => {
            return "0x84bb1e42" + // function selector
                   address.slice(2).padStart(64, '0') + // user address
                   "0000000000000000000000000000000000000000000000000000000000000001" + // quantity
                   "000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" + // payment token
                   "00000000000000000000000000000000000000000000000000005af3107a4000" + // price
                   "00000000000000000000000000000000000000000000000000000000000000c0" + // data offset
                   "0000000000000000000000000000000000000000000000000000000000000160" + // signature offset
                   "0000000000000000000000000000000000000000000000000000000000000080" + // data length
                   "0000000000000000000000000000000000000000000000000000000000000000" + // data
                   "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff" + // deadline
                   "0000000000000000000000000000000000000000000000000000000000000000" + // signature v
                   "0000000000000000000000000000000000000000000000000000000000000000" + // signature r
                   "0000000000000000000000000000000000000000000000000000000000000000"; // signature s
        }
    };

    // Helper functions untuk logging
    function getTimeStamp() {
        return new Date().toISOString().slice(11, 19);
    }

    function formatWalletId(address) {
        return address.slice(-4);
    }

    // Update fungsi formatLog
    function formatLog(walletIndex, address, message) {
        const timestamp = `${COLORS.CYAN}[${getTimeStamp()}]${COLORS.RESET}`;
        const wallet = `${COLORS.MAGENTA}[ Discord.gg/aethereal | Wallet ${walletIndex + 1} | ${formatWalletId(address)}]${COLORS.RESET}`;
        
        // Tentukan warna berdasarkan tipe pesan
        let coloredMessage = message;
        if (message.includes('✅')) {
            coloredMessage = `${COLORS.GREEN}${message}${COLORS.RESET}`;
        } else if (message.includes('⚠️')) {
            coloredMessage = `${COLORS.YELLOW}${message}${COLORS.RESET}`;
        } else if (message.includes('❌')) {
            coloredMessage = `${COLORS.RED}${message}${COLORS.RESET}`;
        } else if (message.includes('Explorer:')) {
            coloredMessage = `${COLORS.BLUE}${message}${COLORS.RESET}`;
        }

        return `${timestamp} ${wallet} ${coloredMessage}`;
    }

    // Update fungsi mintNFT
    async function mintNFT(wallet, walletIndex) {
        const provider = new ethers.JsonRpcProvider(Config.RPC.RPCURL, Config.RPC.CHAINID);
        const signer = new ethers.Wallet(wallet, provider);
        const address = signer.address;

        try {
            console.log(formatLog(walletIndex, address, `Starting mint process...`));
            
            const tx = {
                to: NFT_CONFIG.CONTRACT_ADDRESS,
                value: NFT_CONFIG.MINT_PRICE,
                data: NFT_CONFIG.MINT_DATA(address),
                gasLimit: "0x39dc7"
            };

            const transaction = await signer.sendTransaction(tx);
            console.log(formatLog(walletIndex, address, `Transaction sent: ${transaction.hash}`));
            console.log(formatLog(walletIndex, address, `Explorer: ${Config.RPC.EXPLORER}tx/${transaction.hash}`));
            
            console.log(formatLog(walletIndex, address, `Waiting for confirmation...`));
            
            try {
                const receipt = await transaction.wait();
                if (receipt.status === 1) {
                    console.log(formatLog(walletIndex, address, `✅ NFT Minted Successfully!`));
                    console.log(formatLog(walletIndex, address, `Block: ${receipt.blockNumber}`));
                    return receipt;
                }
                throw receipt;
            } catch (error) {
                // Fungsi helper untuk mengecek apakah NFT sudah di-mint
                const isAlreadyMinted = (error) => {
                    const conditions = [
                        error.receipt?.gasUsed?.toString() === "59766", // 0xe976
                        error.receipt?.gasUsed?.toString() === "59778", // 0xe982
                        error.receipt?.gasUsed?.toString() === "33475", // 0x82c3
                        error.error?.data?.includes('0x9e7762db'),
                        error.data?.includes('0x9e7762db'),
                        error.error?.output?.includes('0x9e7762db'),
                        error.output?.includes('0x9e7762db'),
                        error.message?.includes('DropClaimExceedLimit')
                    ];
                    return conditions.some(condition => condition);
                };

                if (isAlreadyMinted(error)) {
                    console.log(formatLog(walletIndex, address, `⚠️ NFT already minted for this wallet`));
                    const txHash = error.receipt?.hash || error.transaction?.hash;
                    if (txHash) {
                        console.log(formatLog(walletIndex, address, `Transaction Hash: ${txHash}`));
                    }
                    return error.receipt;
                }

                console.log(formatLog(walletIndex, address, `❌ Error: transaction execution reverted`));
                return null;
            }
        } catch (error) {
            console.log(formatLog(walletIndex, address, `❌ Error: ${error.message.split('(')[0].trim()}`));
            return null;
        }
    }

    // Update bagian menu untuk menunggu konfirmasi sebelum lanjut
    async function showMenu() {
        try {
            console.log(`\n=== ${COLORS.CYAN}🎨 Soneium NFT Minter Menu${COLORS.RESET} ===`);
            console.log(`${COLORS.BRIGHT}1. Mint SM-Morkie NFT (All Wallets)`);
            console.log(`2. Mint SM-Morkie NFT (Specific Wallet)`);
            console.log(`3. Exit${COLORS.RESET}`);

            const choice = await input.input({
                message: 'Select option (1-3): '
            });

            switch (choice) {
                case '1':
                    for (let i = 0; i < privateKey.length; i++) {
                        try {
                            await mintNFT(privateKey[i], i);
                            await new Promise(resolve => setTimeout(resolve, 5000));
                        } catch (error) {
                            continue;
                        }
                    }
                    break;
                case '2':
                    console.log('\n=== Available Wallets ===');
                    for (let i = 0; i < privateKey.length; i++) {
                        const wallet = new ethers.Wallet(privateKey[i]);
                        console.log(`${i + 1}. ${wallet.address}`);
                    }
                    
                    const walletChoice = await input.input({
                        message: `Select wallet (1-${privateKey.length}): `
                    });
                    
                    const walletIndex = parseInt(walletChoice) - 1;
                    if (walletIndex >= 0 && walletIndex < privateKey.length) {
                        await mintNFT(privateKey[walletIndex], walletIndex);
                    }
                    break;
                case '3':
                    console.log(`\n${COLORS.GREEN}👋 Thank you for using Soneium NFT Minter! Please join our discord: discord.gg/aethereal ${COLORS.RESET}`);
                    process.exit(0);
                default:
                    console.log(`\n${COLORS.RED}❌ Invalid option${COLORS.RESET}`);
            }
            
            // Tampilkan menu lagi setelah selesai
            await showMenu();
        } catch (error) {
            if (error.message?.includes('User force closed')) {
                console.log(`\n\n${COLORS.GREEN}👋 Thank you for using Soneium NFT Minter! Please join our discord: discord.gg/aethereal ${COLORS.RESET}`);
                process.exit(0);
            }
        }
    }

    // Start the program
    console.log('\n🚀 Starting NFT Minter...');
    await showMenu();

} catch (error) {
    console.error('\n❌ Error during initialization:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
}