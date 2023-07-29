import { useContext } from 'react'
import { decode } from 'bs58'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { Connection, Keypair, Transaction, clusterApiUrl } from '@solana/web3.js'
import { Network } from '@shyft-to/js'
import { SignerWalletAdapter } from '@solana/wallet-adapter-base'
import { NodeWallet } from '@metaplex/js'
import { AuthenContext } from '../providers/Authenticator'

export const useAuth = () => {
  const authenUser = useContext(AuthenContext)
  return authenUser
}

export async function confirmTransactionFromFrontend(
  connection: Connection,
  encodedTransaction: string,
  wallet: SignerWalletAdapter,
) {
  console.log(encodedTransaction)
  const recoveredTransaction = Transaction.from(Buffer.from(encodedTransaction, 'base64'))
  const signedTx = await wallet.signTransaction(recoveredTransaction)
  const confirmTransaction = await connection.sendRawTransaction(signedTx.serialize())
  return confirmTransaction
}

export async function confirmTransactionFromBackend(network: Network, encodedTransaction: string) {
  const connection = new Connection(clusterApiUrl(network), 'confirmed')
  const feePayer = Keypair.fromSecretKey(decode(process.env.REACT_APP_PRIVATE_KEY!))
  const wallet = new NodeWallet(feePayer)
  const recoveredTransaction = Transaction.from(Buffer.from(encodedTransaction, 'base64'))
  const signedTx = await wallet.signTransaction(recoveredTransaction)
  const confirmTransaction = await connection.sendRawTransaction(signedTx.serialize())
  return confirmTransaction
}

export async function signAndConfirmTransactionBe(
  network: Network,
  transaction: string,
  callback: (signature: any, result: any) => void,
) {
  const phantom = new PhantomWalletAdapter()
  await phantom.connect()
  const rpcUrl = clusterApiUrl(network)
  const connection = new Connection(rpcUrl, 'confirmed')
  const ret = await confirmTransactionFromBackend(network, transaction)
  console.log(ret)

  connection.onSignature(ret, callback, 'finalized')
  return ret
}

export async function signAndConfirmTransaction(
  network: Network,
  transaction: string,
  callback: (signature: any, result: any) => void,
) {
  const phantom = new PhantomWalletAdapter()
  await phantom.connect()
  const rpcUrl = clusterApiUrl(network)
  const connection = new Connection(rpcUrl, 'confirmed')
  const ret = await confirmTransactionFromFrontend(connection, transaction, phantom)
  console.log(ret)

  connection.onSignature(ret, callback, 'finalized')
  return ret
}
