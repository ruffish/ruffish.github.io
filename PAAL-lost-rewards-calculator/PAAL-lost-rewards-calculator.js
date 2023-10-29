let ETH_API_KEY = 'TCZMYYGC5XWCVK6SCA482E9IJ49PK2HMKE';
const ETH_ENDPOINT = 'https://api.etherscan.io/api';
let CLAIMED_CONTRACT_ADDRESS = '';
let STAKING_CONTRACT_ADDRESS = '';
let WALLET_ADDRESS = '0x0';

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
            console.log(hashed.slice(0, 10));
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
            console.log(hashed.slice(0, 10))
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

    CLAIMED_CONTRACT_ADDRESS = await getContractAddressByMethodName(WALLET_ADDRESS, 'claimRewards', endDateStr);
    let abi = await getContractAbi(CLAIMED_CONTRACT_ADDRESS);
    if (!abi) {
        console.error("Unable to fetch the ABI for the claimed contract.");
        return;
    }

    const claimRewardsMethodId = getClaimRewardsMethodId(abi);
    if (!claimRewardsMethodId) {
        console.error("Unable to fetch the method ID for the 'claimRewards' function.");
        return;
    }

    STAKING_CONTRACT_ADDRESS = await getContractAddressByMethodName(WALLET_ADDRESS, 'stake', endDateStr);
    abi = await getContractAbi(STAKING_CONTRACT_ADDRESS);
    if (!abi) {
        console.error("Unable to fetch the ABI for the staking contract.");
        return;
    }

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
}

// Remember to define old_apr and new_apr before calling the main function:
const old_apr = 105;
const new_apr = 60;