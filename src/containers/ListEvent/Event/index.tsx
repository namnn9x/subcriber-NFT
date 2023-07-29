import { IEvent, getEventById, updateEvent } from '../../../services/event'
import { BsFillSuitHeartFill } from 'react-icons/bs'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { useUserStore } from '../../../store/user'
import { useEventStore } from '../../../store/event'
import { restApiCall } from '@shyft-to/js/dist/cjs/utils'
import { Network, ShyftSdk } from '@shyft-to/js'
import { useWallet } from '@solana/wallet-adapter-react'
import { shyft } from '../../../App'
import { signAndConfirmTransactionBe } from '../../../hooks'
import {TbGiftOff} from 'react-icons/tb'
import { HiGift } from 'react-icons/hi'
import axios from 'axios'

interface Props {
  event: IEvent
  handleCreateNFT: () => void
  isMe: boolean
}

var myHeaders = new Headers();
myHeaders.append("x-api-key", "bvXLpPQsl-jO7w2M");


// detach
// try {
//   const detach = await restApiCall('bvXLpPQsl-jO7w2M', {
//     method: 'post',
//     url: 'nft/mint_detach',
//     data: {
//       network: Network.Devnet, // dev
//       wallet: '13Qr7d7VNh2b2AYw3pyNqfkFL8S1Ei3hdAaNT6MaqGHS', // publickey author
//       master_nft_address: mint, // mint
//       receiver: 'BmuyGf2DBGMEkmQH8wF7quLK58M7EBR7vfTk25NjadY4', // publickey user
//       transfer_authority: false,
//     },
//   })
//   console.log(detach, 'detach')
// } catch (error) {
//   console.log(error, 'error')
// }

// var raw = JSON.stringify({
//   "network": "devnet",
//   "wallet": "2fmz8SuNVyxEP6QwKQs6LNaT2ATszySPEJdhUDesxktc",
//   "master_nft_address": "ByjAvSWaU7ffupEFM6BnG4s2nx55xU1vjMXC1JRQTHhS",
//   "receiver": "BmuyGf2DBGMEkmQH8wF7quLK58M7EBR7vfTk25NjadY4",
//   "transfer_authority": false,
//   "message": "Thank you"
// });

// const requestOptions: any = {
//   method: 'POST',
//   headers: myHeaders,
//   body: raw,
//   redirect: 'follow'
// };

// fetch("https://api.shyft.to/sol/v1/nft/mint_detach", requestOptions)
//   .then(response => response.text())
//   .then(result => console.log(result))
//   .catch(error => console.log('error', error));

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


  const handleSubscribe = async () => {
    if (!event.id || !currentUser.uid) return

    const resEvent = await getEventById(event.id) as IEvent
    const nftReward = resEvent.nftReward
    const mint = nftReward[Math.floor(Math.random() * nftReward.length)];
    console.log(mint, '=================> get mint')

    const masterNft = await shyft.nft.getNftByMint({
      network: Network.Devnet,
      mint: mint
    })
    console.log(masterNft, 'masterNft')
    console.log(publicKey?.toBase58(), 'publicKey')

    axios({
      // Endpoint to mint NFTs
      url: 'https://api.shyft.to/sol/v1/nft/mint_detach',
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.REACT_APP_SHYFT_API_KEY!,
      },
      data: {
        network: Network.Devnet, // dev
        wallet: masterNft.owner, // publickey author
        master_nft_address: mint, // mint
        receiver: publicKey?.toBase58(), // publickey user
        transfer_authority: false
      }
    })
      // Handle the response from backend here
      .then(async (res: any) => {
        console.log(res.data);
        if(res.data.success === true)
        {
          const transaction = res.data.result.encoded_transaction;
          console.log(res);
          //send this transaction to the SHYFT JS SDK which will authenticate the transaction after approval from the sender
        }
        else
        {
          console.log('Some Error Occurred');
        }
        
      })
      // Catch errors if any
      .catch((err: any) => {
        console.warn(err);
        // setMssg("Failed! Some error occurred");
        
      });
   
    const requestOptions: any = {
      method: 'POST',
      headers: myHeaders,
      body: {
        
      },
      redirect: 'follow'
    };
    

    fetch("https://api.shyft.to/sol/v1/nft/mint_detach", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));

    // try {
    //   await signAndConfirmTransactionBe(Network.Devnet, detach.result.encoded_transaction, callback)
    // } catch (error) {
    //   console.log(error)
    // }

    // Save id user subscriber

    // const newEvent: IEvent = {
    //   ...resEvent,
    //   subscriberId: [ ...resEvent.subscriberId, currentUser.uid]
    // }
    // await updateEvent({ newEvent })
    // updateEventStore(event.id, newEvent)
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
        <div className='flex flex-wrap'>
          <div className=' text-left text-white'>NFT reward:</div>
          <div className=' text-left flex items-center text-white'>
            { event.nftReward && event.nftReward.length ? <HiGift /> : <TbGiftOff />}
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
