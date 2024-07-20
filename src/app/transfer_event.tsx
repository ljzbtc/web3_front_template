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

    const intervalId = setInterval(fetchTransfers, 10000); // 每10秒查询一次

    // 组件卸载时清除定时器
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded shadow-lg min-w-full max-w-4xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">USDT Transfer Events in Current Block</h1>
        {loading ? (
          <p>No transfer events found.</p>
        ) : (
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Block Number</th>
                <th className="py-2 px-4 border-b">Transaction Hash</th>
                <th className="py-2 px-4 border-b">From</th>
                <th className="py-2 px-4 border-b">Amount (USDT)</th>
                <th className="py-2 px-4 border-b">To</th>
              </tr>
            </thead>
            <tbody>
              {transfers.length > 0 ? (
                transfers.map((transfer, index) => (
                  <tr key={index} className="even:bg-gray-100">
                    <td className="py-2 px-4 border-b">{transfer.blockNumber}</td>
                    <td className="py-2 px-4 border-b">{transfer.txHash}</td>
                    <td className="py-2 px-4 border-b">{transfer.from}</td>
                    <td className="py-2 px-4 border-b">{transfer.amount}</td>
                    <td className="py-2 px-4 border-b">{transfer.to}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-2 px-4 border-b text-center" colSpan={5}>No transfer events found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TransferEvents;
