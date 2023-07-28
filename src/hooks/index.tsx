import { useContext } from "react";
import { AuthenContext } from "../providers/Authenticator";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { Connection, Transaction, clusterApiUrl } from "@solana/web3.js";
import { Network } from "@shyft-to/js";
import { SignerWalletAdapter } from "@solana/wallet-adapter-base";

export const useAuth = () => {
 const authenUser = useContext(AuthenContext);
 return authenUser;
};

export async function confirmTransactionFromFrontend(connection: Connection, encodedTransaction: string, wallet: SignerWalletAdapter) {
  console.log(encodedTransaction);
  const recoveredTransaction = Transaction.from(
    Buffer.from(encodedTransaction, 'base64')
  );
  const signedTx = await wallet.signTransaction(recoveredTransaction);
  const confirmTransaction = await connection.sendRawTransaction(
    signedTx.serialize()
  );
  return confirmTransaction;
}

export async function signAndConfirmTransaction(network: Network,transaction: string, callback: (signature: any, result: any) => void )
{
    const phantom = new PhantomWalletAdapter();
    await phantom.connect();
    const rpcUrl = clusterApiUrl(network);
    const connection = new Connection(rpcUrl,"confirmed");
    const ret = await confirmTransactionFromFrontend(connection,transaction,phantom);
    console.log(ret);

    connection.onSignature(ret,callback,'finalized')
    return ret;
}