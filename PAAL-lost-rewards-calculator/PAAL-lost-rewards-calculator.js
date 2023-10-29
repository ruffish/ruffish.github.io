const ETH_ENDPOINT = 'https://api.etherscan.io/api';
const pool14DayContractAddress = '0x85e253162C7e97275b703980F6b6fA8c0469D624';
const pool28DayContractAddress = '0x163Ad6AC78FFE40E194310faEaDA8f6615942d7b';
const pool56DayContractAddress = '0x8431060c8e72793aFaDA261E9DD0Ab950e80894F';

let ETH_API_KEY = 'TCZMYYGC5XWCVK6SCA482E9IJ49PK2HMKE';
let CLAIMED_CONTRACT_ADDRESS = '';
let STAKING_CONTRACT_ADDRESS = '';
let WALLET_ADDRESS = '0x0';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const getContractAbi = async (contractAddress) => {
    const params = {
        module: 'contract',
        action: 'getabi',
        address: contractAddress,
        apikey: ETH_API_KEY
    };

    try {
        const response = await axios.get(ETH_ENDPOINT, {
            params
        });
        const abiString = response.data.result;
        return JSON.parse(abiString);
    } catch (error) {
        console.error("Failed to decode ABI", error);
        return null;
    }
}

const getContractAddressByMethodName = async (walletAddress, methodName, endDateStr) => {
    const endDate = new Date(endDateStr);
    const endTimestamp = Math.floor(endDate.getTime() / 1000);

    const params = {
        module: 'account',
        action: 'txlist',
        address: walletAddress,
        startblock: 0,
        endblock: 99999999,
        sort: 'desc',
        apikey: ETH_API_KEY
    };

    try {
        const response = await axios.get(ETH_ENDPOINT, { params });
        const transactions = response.data.result;
        for (let tx of transactions) {
            if (methodName == "stake") { // If method is "stake", skip transactions past the end date
                const txTimestamp = parseInt(tx.timeStamp);
                if (txTimestamp > endTimestamp) continue; // Skip if the transaction is after the end date
            }

            const contractAddress = tx.to;
            const abi = await getContractAbi(contractAddress);
            if (!abi) continue;
            for (let item of abi) {
                if (item.type === 'function' && item.name === methodName) {
                    const signature = `${item.name}(${item.inputs.map(input => input.type).join(',')})`;
                    const hashed = Web3.utils.keccak256(signature);
                    const methodId = hashed.slice(0, 10);
                    if (tx.input.startsWith(methodId)) {
                        return contractAddress;  // Return the staking pool address the user last interacted with using "stake" method
                    }
                }
            }
        }
        return null;
    } catch (error) {
        console.error("Failed to get transactions or decode input", error);
        return null;
    }
}

const getUnstakeMethodId = (abi) => {
    for (let item of abi) {
        if (item.type === 'function' && item.name === 'unstake') {
            const signature = `${item.name}(${item.inputs.map(input => input.type).join(',')})`;
            const hashed = Web3.utils.keccak256(signature);
            return hashed.slice(0, 10);
        }
    }
    return null;
}

const getStakeMethodId = (abi) => {
    for (let item of abi) {
        if (item.type === 'function' && item.name === 'stake') {
            const signature = `${item.name}(${item.inputs.map(input => input.type).join(',')})`;
            const hashed = Web3.utils.keccak256(signature);
            console.log("STAKE ID: " + hashed.slice(0, 10));
            return hashed.slice(0, 10);
        }
    }
    return null;
}

const getClaimRewardsMethodId = (abi) => {
    for (let item of abi) {
        if (item.type === 'function' && item.name === 'claimRewards') {
            const signature = `${item.name}(${item.inputs.map(input => input.type).join(',')})`;
            const hashed = Web3.utils.keccak256(signature);
            console.log("CLAIM ID: " + hashed.slice(0, 10))
            return hashed.slice(0, 10);
        }
    }
    return null;
}

const getLastClaimRewardsTimestampBeforeDate = async (walletAddress, methodId, endDateStr) => {
    const params = {
        module: 'account',
        action: 'txlist',
        address: walletAddress,
        startblock: 0,
        endblock: 99999999,
        sort: 'desc',
        apikey: ETH_API_KEY
    };

    console.log('after Wallet Address: ' + walletAddress);

    try {
        const response = await axios.get(ETH_ENDPOINT, {
            params
        });
        console.log(response.data);
        const transactions = response.data.result;

        const endDate = new Date(endDateStr);
        const endTimestamp = Math.floor(endDate.getTime() / 1000);

        for (let tx of transactions) {
            const txTimestamp = parseInt(tx.timeStamp);
            console.log(tx)
            if (tx.methodId === methodId && txTimestamp < endTimestamp) {
                return new Date(txTimestamp * 1000).toISOString();
            }
        }
    } catch (error) {
        console.error("Failed to get transactions", error);
        return null;
    }
}

const calculateStakedAmountFromTransactions = (transactions, stakeMethodId, unstakeMethodId) => {
    let stakedAmount = 0;
    for (let tx of transactions) {
        const encodedAmount = tx.input.slice(10);
        const decodedAmount = parseInt(encodedAmount, 16) / Math.pow(10, 9);

        if (tx.methodId === stakeMethodId) {
            stakedAmount += decodedAmount;
        } else if (tx.methodId === unstakeMethodId) {
            stakedAmount -= decodedAmount;
        }
    }
    return stakedAmount;
}

const calculateEarnings = (initialBalance, apr, startDate, endDate) => {
    const timeDifferenceMinutes = (endDate - startDate) / 1000 / 60; // Convert time difference to minutes
    const totalApr = (apr / 100) * timeDifferenceMinutes / (365 * 24 * 60); // Convert APR to per-minute basis
    const earnings = initialBalance * totalApr;
    return earnings;
}

const getTransactionsUpToDate = async (walletAddress, targetDate) => {
    const targetTimestamp = Math.floor(targetDate.getTime() / 1000);

    const params = {
        module: 'account',
        action: 'txlist',
        address: walletAddress,
        startblock: 0,
        endblock: 99999999,
        sort: 'desc',
        apikey: ETH_API_KEY
    };

    try {
        const response = await axios.get(ETH_ENDPOINT, {
            params
        });
        const allTransactions = response.data.result;

        // Filter transactions up to the given date
        const filteredTransactions = allTransactions.filter(tx => parseInt(tx.timeStamp) <= targetTimestamp);
        return filteredTransactions;
    } catch (error) {
        console.error("Failed to get transactions", error);
        return [];
    }
}


const main = async () => {
    const endDateStr = '2023-10-27 17:43:00';
    let old_apr = 0
    let new_apr = 0

    await sleep(5000);  // Sleep for 5 seconds

    CLAIMED_CONTRACT_ADDRESS = await getContractAddressByMethodName(WALLET_ADDRESS, 'claimRewards', endDateStr);
    console.log('after Claimed Contract Address: ' + CLAIMED_CONTRACT_ADDRESS)
    let abi = await getContractAbi(CLAIMED_CONTRACT_ADDRESS);
    if (!abi) {
        console.error("Unable to fetch the ABI for the claimed contract.");
        return;
    }

    await sleep(3000);  // Sleep for 3 seconds

    const claimRewardsMethodId = getClaimRewardsMethodId(abi);
    if (!claimRewardsMethodId) {
        console.error("Unable to fetch the method ID for the 'claimRewards' function.");
        return;
    }

    await sleep(3000);  // Sleep for 3 seconds

    STAKING_CONTRACT_ADDRESS = await getContractAddressByMethodName(WALLET_ADDRESS, 'stake', endDateStr);
    console.log('after Staking Contract Address: ' + STAKING_CONTRACT_ADDRESS)
    abi = await getContractAbi(STAKING_CONTRACT_ADDRESS);
    if (!abi) {
        console.error("Unable to fetch the ABI for the staking contract.");
        return;
    }

    console.log('STAKING_CONTRACT_ADDRESS:', STAKING_CONTRACT_ADDRESS);
    console.log('pool56DayContractAddress:', pool56DayContractAddress);

    if (STAKING_CONTRACT_ADDRESS.toLowerCase() == pool14DayContractAddress.toLowerCase()) {
        console.log("POOL DETECTED: 14 Days")
        old_apr = 35
        new_apr = 15
    } else if (STAKING_CONTRACT_ADDRESS.toLowerCase() == pool28DayContractAddress.toLowerCase()) {
        console.log("POOL DETECTED: 28 Days")
        old_apr = 80
        new_apr = 40
    } else if (STAKING_CONTRACT_ADDRESS.toLowerCase() == pool56DayContractAddress.toLowerCase()) {
        console.log("POOL DETECTED: 56 Days")
        old_apr = 105
        new_apr = 60
    }

    await sleep(3000);  // Sleep for 3 seconds

    const unstakeMethodId = getUnstakeMethodId(abi);
    if (!unstakeMethodId) {
        console.error("Unable to fetch the method ID for the 'unstake' function.");
        return;
    }

    const stakeMethodId = getStakeMethodId(abi);
    if (!stakeMethodId) {
        console.error("Unable to fetch the method ID for the 'stake' function.");
        return;
    }

    const lastClaimRewardsTimestamp = await getLastClaimRewardsTimestampBeforeDate(WALLET_ADDRESS, claimRewardsMethodId, endDateStr);
    if (!lastClaimRewardsTimestamp) {
        console.error("Unable to find the last claimRewards transaction.");
        return;
    }

    const startDate = new Date(lastClaimRewardsTimestamp);
    const endDate = new Date(endDateStr);

    const transactions = await getTransactionsUpToDate(WALLET_ADDRESS, startDate);
    const stakedAmountStart = calculateStakedAmountFromTransactions(transactions, stakeMethodId, unstakeMethodId);

    const totalEarnedOldApr = calculateEarnings(stakedAmountStart, old_apr, startDate, endDate);
    const totalEarnedNewApr = calculateEarnings(stakedAmountStart, new_apr, startDate, endDate);
    const lostTokens = totalEarnedOldApr - totalEarnedNewApr;

    const resultText = `
        Staked amount: <br><span style="color: purple;">${stakedAmountStart.toFixed(4)} PAAL\n</span><br><br>
        Total earned on old APR: <br><span style="color: purple;">${totalEarnedOldApr.toFixed(4)} PAAL\n</span><br><br>
        Total earned on new APR: <br><span style="color: purple;">${totalEarnedNewApr.toFixed(4)} PAAL\n</span><br><br>
        Lost tokens: <br><span style="color: purple;">${lostTokens.toFixed(4)} PAAL</span>
    `;

    // Update modal content
    document.getElementById('modalResultText').innerHTML = resultText;
    document.getElementById('loader-wrapper').style.display = 'none';
}
