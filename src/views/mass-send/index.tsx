// Next, React
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';

// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

// Components
import { RequestAirdrop } from '../../components/RequestAirdrop';
import pkg from '../../../package.json';

// Store
import useUserSOLBalanceStore from '../../stores/useUserSOLBalanceStore';
import useUserTokensStore from 'stores/useUserTokensStore';

import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';

export const MassSendView: FC = ({ }) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const balance = useUserSOLBalanceStore((s) => s.balance)
  const { getUserSOLBalance } = useUserSOLBalanceStore()
  const tokens = useUserTokensStore((s) => s.tokens);
  const { getUserTokens } = useUserTokensStore();

  useEffect(() => {
    if (wallet.publicKey) {
      getUserSOLBalance(wallet.publicKey, connection)
    }
  }, [wallet.publicKey, connection, getUserSOLBalance])

  useEffect(() => {
    if (wallet.publicKey) {
      getUserTokens(wallet.publicKey, connection)

      console.log('tokens', tokens)
    }
  }, [wallet.publicKey, connection, getUserTokens])

  const [amount, setAmount] = useState<string>('0');
  const [wallets, setWallets] = useState<string>('');

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(String(event.target.value));
  }

  const handleWalletsChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setWallets(event.target.value);
  }

  const handleSend = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const walletList = wallets.split('\n').map((wallet) => wallet.trim()).filter((wallet) => wallet.length > 0);
    const totalSend = Number(amount) * walletList.length;

    console.log('Sending', totalSend, 'to', walletList);

    if (totalSend > balance) {
      alert('Insufficient balance');
      return;
    }

    // Send the transactions

    const instructions: TransactionInstruction[] = [];

    for (const receiver of walletList) {
      instructions.push(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: new PublicKey(receiver),
          lamports: Number(amount) * LAMPORTS_PER_SOL
        })
      );
    }

    console.log('Instructions', instructions);

    const recentBlockhash = (await connection.getRecentBlockhash()).blockhash;

    const transaction = new Transaction().add(...instructions);
    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = recentBlockhash;

    console.log('Transaction', transaction);

    const signature = await wallet.signTransaction(transaction);
    console.log('Signature', signature);

    const signatureResult = await connection.sendRawTransaction(signature.serialize());
    console.log('Signature Result', signatureResult);


  }

  return (

    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        
        <div className="flex flex-col mt-2">
          <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8">
            Mass Send Tokens On Solana
          </h1>
          {/*
            Form:
            dropdown: you want to send sol or tokens
            input type number: Amount to send to each wallet
            textarea: List of wallets
          */}

        <h4 className="md:w-full text-2xl text-slate-300 my-2">
          {wallet &&
          <div className="flex flex-row justify-center">
            Your balance:
            <div className="ml-2">
              {(balance || 0).toLocaleString()}
              </div>
              <div className='text-slate-600 ml-2'>
                SOL
              </div>
          </div>
          }
          </h4>

          <form className="flex flex-col" onSubmit={handleSend}>
            <label htmlFor="token" className="mb-2 text-slate-300">You want to send</label>
            <select id="token" name="token" className="mb-2 text-black">
              <option value="sol">SOL</option>
              {tokens.map((token) => (
                <option key={token.pubkey.toBase58()} value={token.pubkey.toBase58()}>{token.pubkey.toBase58()}</option>
              ))}
            </select>
            <label htmlFor="amount" className="mb-2 text-slate-300">Amount to send to each wallet</label>
            <input type="number" id="amount" name="amount" className="mb-2 text-black" onChange={handleAmountChange} value={amount} />
            <label htmlFor="wallets">List of wallets</label>
            <textarea id="wallets" name="wallets" className="mb-2 text-black h-32" onChange={handleWalletsChange} value={wallets} />
            <button type="submit" className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white p-2 rounded-md">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};
