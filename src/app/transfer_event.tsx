"use client";

import React, { useState, useEffect } from 'react';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { parseAbiItem } from 'viem';

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http("https://eth-mainnet.g.alchemy.com/v2/seOLlSZG2Gi5ZuxZHs9xNlpafdax4u-J")
});

const USDT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7';

const TransferEvents = () => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransfers = async () => {
      setLoading(true);
      try {
        const block_end = BigInt(await publicClient.getBlockNumber());

        const logs = await publicClient.getLogs({
          address: USDT_ADDRESS,
          event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)'),
          fromBlock: block_end,
          toBlock: block_end
        });

        const formatTransferData = (transferEvents) => {
          return transferEvents.map(event => {
            const amount = Number(event.args.value) / 1e6;
            const from = `${event.args.from.slice(0, 10)}...${event.args.from.slice(-10)}`;
            const to = `${event.args.to.slice(0, 10)}...${event.args.to.slice(-10)}`;
            const txHash = `${event.transactionHash.slice(0, 7)}...${event.transactionHash.slice(-7)}`;
            const blockNumber = event.blockNumber;
            
            return `在 ${blockNumber} 区块 ${txHash} 交易中从 ${from} 转账 ${amount.toFixed(5)} USDT 到 ${to}`;
          });
        };

        const formattedTransfers = formatTransferData(logs);
        setTransfers(formattedTransfers);
      } catch (error) {
        console.error('Failed to fetch transfer events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransfers();

    const intervalId = setInterval(fetchTransfers, 10000); // 每5秒查询一次

    // 组件卸载时清除定时器
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h1>USDT Transfer Events in Current Block</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {transfers.length > 0 ? (
            transfers.map((transfer, index) => <li key={index}>{transfer}</li>)
          ) : (
            <p>No transfer events found.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default TransferEvents;
