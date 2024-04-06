import create, { State } from 'zustand'
import { Connection, PublicKey, LAMPORTS_PER_SOL, AccountInfo, GetProgramAccountsFilter, ParsedAccountData } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

interface Token {
	pubkey: PublicKey;
	account: AccountInfo<ParsedAccountData>;
}

interface UserTokensStore extends State {
  tokens: Token[];
  getUserTokens: (publicKey: PublicKey, connection: Connection) => void
}

const useUserTokensStore = create<UserTokensStore>((set, _get) => ({
  tokens: [],
  getUserTokens: async (publicKey, connection) => {
    let tokens = [];
    try {
			const filters: GetProgramAccountsFilter[] = [
				{
					dataSize: 165,
				},
				{
					memcmp: {
						offset: 32,
						bytes: publicKey.toString(),
					}            
				}
			];
			tokens = await connection.getParsedProgramAccounts(
        TOKEN_PROGRAM_ID,
        { filters: filters }
    	);
    } catch (e) {
      console.log(`error getting tokens: `, e);
    }
    set((s) => {
      s.tokens = tokens;
      console.log(`tokens updated, `, tokens);
    })
  },
}));

export default useUserTokensStore;