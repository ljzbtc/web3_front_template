"use client";

import React, { useState, useEffect } from 'react';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { parseAbiItem } from 'viem';

// 类型声明
type TransferEvent = {
  blockNumber: number;
  txHash: string;
  from: string;
  amount: string;
  to: string;
};

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http("https://eth-mainnet.g.alchemy.com/v2/seOLlSZG2Gi5ZuxZHs9xNlpafdax4u-J")
});

const USDT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7';

const TransferEvents = () => {
  const [transfers, setTransfers] = useState<TransferEvent[]>([]);
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

        const formatTransferData = (transferEvents: any[]): TransferEvent[] => {
          return transferEvents.map(event => {
            const amount = Number(event.args.value) / 1e6;
            const from = `${event.args.from.slice(0, 10)}...${event.args.from.slice(-10)}`;
            const to = `${event.args.to.slice(0, 10)}...${event.args.to.slice(-10)}`;
            const txHash = `${event.transactionHash.slice(0, 7)}...${event.transactionHash.slice(-7)}`;
            const blockNumber = Number(event.blockNumber);
            
            return {
              blockNumber,
              txHash,
              from,
              amount: amount.toFixed(5),
              to
            };
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
        <table>
          <thead>
            <tr>
              <th>Block Number</th>
              <th>Transaction Hash</th>
              <th>From</th>
              <th>Amount (USDT)</th>
              <th>To</th>
            </tr>
          </thead>
          <tbody>
            {transfers.length > 0 ? (
              transfers.map((transfer, index) => (
                <tr key={index}>
                  <td>{transfer.blockNumber}</td>
                  <td>{transfer.txHash}</td>
                  <td>{transfer.from}</td>
                  <td>{transfer.amount}</td>
                  <td>{transfer.to}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>No transfer events found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransferEvents;
