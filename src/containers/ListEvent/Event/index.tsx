import { IEvent, getEventById, updateEvent } from '../../../services/event'
import { BsFillSuitHeartFill } from 'react-icons/bs'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { useUserStore } from '../../../store/user'
import { useEventStore } from '../../../store/event'
import { restApiCall } from '@shyft-to/js/dist/cjs/utils'
import { Network, ShyftSdk } from '@shyft-to/js'
import { useWallet } from '@solana/wallet-adapter-react'
import { shyft } from '../../../App'
import { signAndConfirmTransaction, signAndConfirmTransactionBe } from '../../../hooks'
import {TbGiftOff} from 'react-icons/tb'
import { HiGift } from 'react-icons/hi'
import axios from 'axios'
import { message } from '../../../components/message'

interface Props {
  event: IEvent
  handleCreateNFT: () => void
  isMe: boolean
}

export const Event = ({ event, handleCreateNFT, isMe }: Props) => {
  const { user: currentUser } = useUserStore();
  const { updateEventStore } = useEventStore();
  const { publicKey } = useWallet()

  const callback = (signature: any, result: any) => {
    console.log("Signature ", signature);
    console.log("result ", result);

    try {
      if (signature.err === null) {
        // setMssg("Minting successful. You can check your wallet");
        // setSuccess(true)
      }
      else {
        // setMssg("Signature Failed");
        // setError(true)

      }
    } catch (error) {
      // setMssg("Signature Failed, but check your wallet");
      // setError(true)
    }

  }

  const minNFT = async ({
    walletMaster,
    mint,
    publicKey,
  }: {
    walletMaster: string,
    mint: string,
    publicKey: string,
  }) => {
    try {
      const res: any = await axios({
        // Endpoint để mint NFTs
        url: 'https://api.shyft.to/sol/v1/nft/mint_detach',
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": 'Gcq9-xRnLV6KpAhT',
        },
        data: {
          network: Network.Devnet, // dev
          wallet: walletMaster, // publickey author
          master_nft_address: mint, // mint
          receiver: publicKey, // publickey user
          transfer_authority: false
        }
      });
  
      if (!res.data.success) {
        console.log('Some Error Occurred');
        return;
      }
      console.log(res, 'res')
      await signAndConfirmTransaction(Network.Devnet, res.data.result.encoded_transaction, callback).then(() => {
        message.success('Sign successfully transaction')
      }).catch((err) => {
        console.log(`${err} err loi `)
        message.error('Sign error transaction')
      });

    } catch (err) {
      console.warn(err);
    }
  }

  const checkUidSubscribed = (subscriberId: string[]) => {
    if (!currentUser.uid) return

    if(subscriberId.includes(currentUser.uid)) {
      message.success('You have registered')
      return
    }
  }

  const checkTicketLimit = (subscriberId: string[], ticketLimit: number) => {
    if (subscriberId.length === ticketLimit) {
      message.success('Ticket limit has expired')
      return
    }
  }

  const handleSubscribe = async () => {
    if (!event.id || !currentUser.uid) return

    if (event.subscriberId) {
      checkUidSubscribed(event.subscriberId)
      checkTicketLimit(event.subscriberId, event.ticketLimit)
    }

    const resEvent = await getEventById(event.id) as IEvent
    const nftReward = resEvent.nftReward
    const mint = nftReward[Math.floor(Math.random() * nftReward.length)];
    console.log(mint, '=================> get mint')
    if(!mint) {
      message.success('Event is not NFT reward')
      return
    }
    const masterNft = await shyft.nft.getNftByMint({
      network: Network.Devnet,
      mint: mint
    })

    console.log(masterNft.owner, 'wallet')
    console.log(mint, 'mint')
    console.log(publicKey?.toBase58(), 'publicKey?.toBase58()')
    console.log('-----------------------------------')
    console.log('=============> Get thanh cong data')

    if (!publicKey) {
      console.log('Not is publicKey')
      return
    }
    await minNFT({
      walletMaster: masterNft.owner,
      mint,
      publicKey: publicKey.toBase58()
    })
    
    const newEvent: IEvent = {
      ...resEvent,
      subscriberId: resEvent.subscriberId ? [...resEvent.subscriberId, currentUser.uid] : [currentUser.uid]
    };
    
    await updateEvent({ newEvent })
    updateEventStore(event.id, newEvent)
  }

  return (
    <div
      className='w-52 h-80 my-0 mx-auto group bg-slate-900 text-black rounded-md overflow-hidden shadow-2xl relative'
    >
      <div className='w-auto h-36 m-4'>
        <img
          className='w-full h-full group-hover:scale-105 ease-in duration-200 rounded-md'
          src={event.coverImage || '/statics/images/default-img.png'}
          alt={event.title}
          loading='lazy'
        />
      </div>
      <div className='bg-slate-900 h-full'>
        <div className='font-bold text-xl mb-2 text-white'>{event.title || 'Even Name'}</div>
        {/* <div className='text-xs pb-2'>{event.description}</div> */}
        <div className='flex flex-wrap ml-4'>
          <div className=' text-left text-slate-400 pr-2 font-normal'>Event day : </div>
          <div className=' text-left text-slate-400 font-normal'>
            {' '}{new Date(Number(event?.eventTime?.seconds) * 1000).toLocaleDateString() || null}
          </div>
        </div>
        <div className='flex flex-wrap ml-4'>
          <div className=' text-left text-slate-400 pr-2 font-normal'>Ticket Limit :</div>
          <div className=' text-left text-slate-400 font-normal'>{event.ticketLimit}</div>
        </div>
        <div className='flex flex-wrap ml-4'>
          <div className=' text-left text-slate-400 pr-2 font-normal'>NFT reward : </div>
          <div className=' text-left text-slate-400 font-normal flex items-center'>
          {' '}{ event.nftReward && event.nftReward.length ? <HiGift /> : <TbGiftOff />}
          </div>
        </div>
        <div className='justify-around hidden group-hover:flex'>
          {!isMe && <button type='submit' onClick={handleSubscribe} className='px-3 py-5 text-slate-600 text-2xl w-7 h-28 absolute btn-subscriber'>
            <BsFillSuitHeartFill className='btn-subscriber-icon' aria-description='Subscriber' />
          </button>}
          {isMe && <button
            onClick={handleCreateNFT}
            type='submit'
            className='tex btn-lg px-3 py-5 text-slate-600 text-2xl'
          >
            <IoIosAddCircleOutline className='hover:text-white' aria-description='Create NFT' />
          </button>}
        </div>
      </div>
    </div>
  )
}
