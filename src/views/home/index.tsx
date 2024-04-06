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

export const HomeView: FC = ({ }) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const balance = useUserSOLBalanceStore((s) => s.balance)
  const { getUserSOLBalance } = useUserSOLBalanceStore()

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58())
      getUserSOLBalance(wallet.publicKey, connection)
    }
  }, [wallet.publicKey, connection, getUserSOLBalance])

  return (

    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        
        <div className="flex flex-col mt-2">
          <h4 className="md:w-full text-2xl text-slate-300 my-2">
            Menu
          </h4>
        </div>

        {/** Menu with all pages (vertical menu) */}

        <div className="flex flex-col">
          <Link href="/mass-send" legacyBehavior>
            <a className="bg-slate-300 text-slate-900 p-2 rounded-md my-2 text-2xl">Mass Send</a>
          </Link>
          <Link href="/token-manager" legacyBehavior>
            <a className="bg-slate-300 text-slate-900 p-2 rounded-md my-2 text-2xl">Token Manager</a>
          </Link>
          <Link href="/metadata-manager" legacyBehavior>
            <a className="bg-slate-300 text-slate-900 p-2 rounded-md my-2 text-2xl">Metadata Manager</a>
          </Link>
          <Link href="/token-burn" legacyBehavior>
            <a className="bg-slate-300 text-slate-900 p-2 rounded-md my-2 text-2xl">Token Burn</a>
          </Link>
          <Link href="/token-creator" legacyBehavior>
            <a className="bg-slate-300 text-slate-900 p-2 rounded-md my-2 text-2xl">Token Creator</a>
          </Link>
          <Link href="/openbook-creator" legacyBehavior>
            <a className="bg-slate-300 text-slate-900 p-2 rounded-md my-2 text-2xl">Openbook Creator</a>
          </Link>
        </div>

      </div>
    </div>
  );
};
