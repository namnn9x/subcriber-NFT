import { IEvent, getEventById, updateEvent } from '../../../services/event'
import { BsFillSuitHeartFill } from 'react-icons/bs'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { useUserStore } from '../../../store/user'
import { useEventStore } from '../../../store/event'
import { restApiCall } from '@shyft-to/js/dist/cjs/utils'
import { Network, Nft, ShyftSdk } from '@shyft-to/js'
import { useWallet } from '@solana/wallet-adapter-react'
import { shyft } from '../../../App'
import { signAndConfirmTransaction, signAndConfirmTransactionBe } from '../../../hooks'
import { TbGiftOff } from 'react-icons/tb'
import { HiGift } from 'react-icons/hi'
import axios from 'axios'
import { message } from '../../../components/message'
import { useEffect, useState } from 'react'

interface Props {
  event: IEvent
  handleCreateNFT: () => void
  isMe: boolean
}

export const Event = ({ event, handleCreateNFT, isMe }: Props) => {
  const { user: currentUser } = useUserStore();
  const { updateEventStore } = useEventStore();
  const { publicKey } = useWallet()
  const [currentMasterNft, setMasterNft] = useState<Nft>()
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
    event,
  }: {
    walletMaster: string,
    mint: string,
    publicKey: string,
    event: IEvent,
  }) => {
    try {
      const res: any = await axios({
        // Endpoint để mint NFTs
        url: 'https://api.shyft.to/sol/v1/nft/mint_detach',
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_SHYFT_API_KEY!,
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
      await signAndConfirmTransactionBe(Network.Devnet, res.data.result.encoded_transaction, callback).then(async () => {

        const newEvent: IEvent = {
          ...event,
          subscriberId: (event.subscriberId ? [...event.subscriberId, currentUser.uid] : [currentUser.uid]) as string[]
        };

        // await updateEvent({ newEvent })
        // updateEventStore(event.id as string, newEvent)
        // message.success('Sign successfully transaction')
      }).catch((err) => {
        console.log(`${err} err loi `)
        message.error('Sign error transaction')
      });

    } catch (err) {
      console.warn(err);
    }
  }
  const checkUidSubscribed = (subscriberId: string[]) => {
    if (!event || !currentUser.uid || !subscriberId) return

    if (subscriberId.includes(currentUser.uid)) {
      return true
    }
  }

  const checkTicketLimit = (subscriberId: string[], ticketLimit: number) => {
    if (!event || !currentUser.uid || !subscriberId) return

    if (subscriberId.length === ticketLimit) {
      message.success('Ticket limit has expired')
      return
    }
  }

  const handleSubscribe = async () => {
    if (!event.id || !currentUser.uid) return

    // const check = checkUidSubscribed(event.subscriberId)
    // if (check) {
    //   message.success('You have registered')
    //   return
    // }
    checkTicketLimit(event.subscriberId, event.ticketLimit)

    const resEvent = await getEventById(event.id) as IEvent
    const nftReward = resEvent.nftReward
    const mint = nftReward[Math.floor(Math.random() * nftReward.length)];
    console.log(mint, '=================> get mint')
    if (!mint) {
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

    setMasterNft(masterNft)
    // await minNFT({
    //   walletMaster: masterNft.owner,
    //   mint,
    //   publicKey: publicKey.toBase58(),
    //   event: resEvent,
    // })
  }

  useEffect(() => {
    void (() => {
      setTimeout(async () => {
        if (currentMasterNft) {
          if (!event.id) {
            console.log('Not event id')
            return
          }
          if (!publicKey) {
            console.log('Not is publicKey')
            return
          }
          const resEvent = await getEventById(event.id) as IEvent
          await minNFT({
            walletMaster: currentMasterNft.owner,
            mint: currentMasterNft.mint,
            publicKey: publicKey.toBase58(),
            event: resEvent,
          })
        }
      }, (2000))
    })()
  }, [currentMasterNft])

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
            {' '}{event.nftReward && event.nftReward.length ? <HiGift /> : <TbGiftOff />}
          </div>
        </div>
        <div className='justify-around hidden group-hover:flex'>
          {checkUidSubscribed(event.subscriberId)
            ? !isMe && <button type='submit' onClick={handleSubscribe} className='px-3 py-5 text-2xl absolute w-8 h-7 btn-subscriber-icon-1'>
              <BsFillSuitHeartFill className={''} />
            </button>
            :
            !isMe && <button type='submit' onClick={handleSubscribe} className='px-3 py-5 text-slate-600 text-2xl w-7 h-28 absolute btn-subscriber'>
              <BsFillSuitHeartFill className={`btn-subscriber-icon`} aria-description='Subscriber' />
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
