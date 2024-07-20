"use client";
import React, { useState, useEffect } from 'react';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http("https://eth-mainnet.g.alchemy.com/v2/seOLlSZG2Gi5ZuxZHs9xNlpafdax4u-J")
});

const BlockHeight = () => {
  const [blockHeight, setBlockHeight] = useState(0);

  useEffect(() => {
    const fetchBlockHeight = async () => {
      try {
        const blockEnd = BigInt(await publicClient.getBlockNumber());
        setBlockHeight(Number(blockEnd));
      } catch (error) {
        console.error('Failed to fetch block height:', error);
      }
    };

    // Initial fetch
    fetchBlockHeight();

    // Set up interval to fetch block height every 10 seconds
    const intervalId = setInterval(fetchBlockHeight, 10000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex items-center justify-center  bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900">Current Block Height:</h1>
        <p className="text-xl text-green-600 mt-4">{blockHeight}</p>
      </div>
    </div>
  );
};

export default BlockHeight;
