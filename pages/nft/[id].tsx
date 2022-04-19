import React, { useEffect, useState } from 'react'
import { useAddress, useDisconnect, useMetamask, useNFTDrop } from "@thirdweb-dev/react";
import type { GetServerSideProps } from 'next'
import { sanityClient, urlFor } from '../../sanity';
import { Collection } from '../../typings';
import Link from 'next/link';
import { BigNumber } from 'ethers';
import toast, {Toaster} from 'react-hot-toast';

interface Props {
    collection: Collection
}

function NFTDropPage({collection}: Props) {
    const [claimedSupply, setClaimedSupply] = useState<number>(0);
    const [totalSupply, setTotalSupply] = useState<BigNumber>();
    const nftDrop = useNFTDrop(collection.address);
    const [loading, setLoading] = useState<boolean>(true);
    const [priceInEth, setPriceInEth] = useState<string>();
    //AUTH
    const connectWithMetamask = useMetamask();
    const address = useAddress();
    const disconnect = useDisconnect();

    useEffect(() => {
        if (!nftDrop) return;
        
        const fetchPrice = async () => {
            const claimConditions = await nftDrop.claimConditions.getAll();
            setPriceInEth(claimConditions?.[0].currencyMetadata.displayValue);
        }
        fetchPrice();
    }, [nftDrop])

    useEffect(() => {
        if (!nftDrop) return;

        const fetchNFTDropData = async () => {
            setLoading(true);

            const claimed = await nftDrop.getAllClaimed();
            const total = await nftDrop.totalSupply();

            setClaimedSupply(claimed.length);
            setTotalSupply(total);
            setLoading(false);
        }
        fetchNFTDropData();
    }, [nftDrop])

    const mintNft = () => {
        if (!nftDrop || !address) return;
        const quantity = 1; //how many unique nfts to claim
        
        setLoading(true);
        const notification = toast.loading('Minting...', {
            style: {
                background: 'white',
                color: 'green',
                fontWeight: 'bolder',
                fontSize: '17px',
                padding: '20px',
            }
        })

        nftDrop.claimTo(address, quantity).then(async(tx) => {
            const receipt = tx[0].receipt
            const claimedTokenId = tx[0].id
            const claimedNFT = await tx[0].data()

            toast('NFT succesfully minted', {
                duration: 8000,
                style: {
                    background: 'white',
                    color: 'green',
                    fontWeight: 'bolder',
                    fontSize: '17px',
                    padding: '20px',
                }
            })

            console.log(receipt);
            console.log(claimedTokenId);
            console.log(claimedNFT);
        }).catch((err) => {
            console.log(err)
            toast('Whoops... Something went wrong', {
                style: {
                    background: 'red',
                    color: 'white',
                    fontWeight: 'bolder',
                    fontSize: '17px',
                    padding: '20px',
                }
            })
        }).finally(() => {
            setLoading(false);
            toast.dismiss(notification);
        })
    }

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
        <Toaster position='bottom-center' />
        {/* left side */}
        <div className="bg-gradient-to-br from-black via-purple-900 to-black lg:col-span-4">
            <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
                <div className="bg-gradient-to-br from-black via-purple-900 to-black p-2 rounded-xl">
                    <img className="w-44 rounded-xl object-cover lg:h-96 lg:w-72 inset-0 transform hover:rotate-320 hover:translate-x-full hover:scale-150 transition duration-300" 
                            src={urlFor(collection.previewImage).url()} 
                            alt=""
                        />
                </div>
                <div className='text-center p-5 space-y-2'>
                    <h1 className="text-4xl font-bold text-white">{collection.nftCollectionName}</h1>
                    <h2 className="text-xl text-gray-300">{collection.description}</h2>
                </div>
            </div>
        </div>

        {/* right side */}
        <div className="flex flex-1 flex-col p-12 lg:col-span-6 bg-[url(https://64.media.tumblr.com/b9a9eced348b19efa6f8a2adbf094127/ceca5a517d4ecdfe-4a/s540x810/61e82908511e82a3c5b1d7cf717fe57bd43437dd.gifv)] bg-cover">
            {/* header */}
            <header className="flex items-center justify-between">
                <Link href={'/'}>
                    <h1 className=' text-white w-52 cursor-pointer text-xl font-extralight sm:w-80'>The{' '}<span className='font-extrabold underline decoration-pink-600/50'>iizwiiz</span>{' '}NFT Market Place</h1>
                </Link>
                <button className='rounded-full bg-gradient-to-br from-purple-900 via-black to-purple-900 text-white px-4 py-2 text-xs font-bold lg:px-5 lg:py-3 lg:text-base hover:shadow-lg cursor-pointer hover:border-none hover:hue-rotate-60 hover:scale-75 transition duration-200 ease-out'
                        onClick={() => address ? disconnect() : connectWithMetamask()}
                >
                    {address ? 'Sign Out' : 'Sign In'}
                </button>
            </header>
            <hr className='my-2 border'/>
            {address && (
                <p className='text-rose-400 font-sm text-center'>You're logged in with wallet {address.substring(0, 5)}...{address.substring(address.length - 5)}</p>
            )}
            
            {/* content */}
            <div className='mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:space-y-0 lg:justify-center'>
                {/* <img className='w-80 object-cover pb-10 lg:h-45'
                     src={urlFor(collection.mainImage).url()} 
                     alt="" 
                /> */}
                <h1 className='text-white text-3xl font-bold lg:text-5xl lg:font-extrabold'>{collection.title}</h1>
                {loading ? (
                    <p className='pt-2 text-xl text-green-300 animate-pulse'>Loading Collection supply count.....</p>
                ):(
                    <p className='pt-2 text-xl text-green-300'>{claimedSupply}/{totalSupply?.toString()} NFT's claimed</p>
                )}

                {loading && (
                    <svg role="status" className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                )}
            </div>
            {/* mint button */}
            <button onClick={mintNft}
                    className='h-16 w-full text-white rounded-full bg-gradient-to-br from-black via-purple-900 to-black mt-10 hover:shadow-lg hover:border-none hover:scale-105 transition duration-200 ease-out font-bold disabled:bg-gray-400'
                    disabled={loading || claimedSupply === totalSupply?.toNumber() || !address}
            >
                {loading ? (
                    <button disabled type="button" className="text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 inline-flex items-center">
                    <svg role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                    </svg>
                    Loading...
                </button>
                ): claimedSupply === totalSupply?.toNumber() ? (
                    <>SOLD OUT</>
                ): !address ? (
                    <>Sign in to Mint</>
                ): (
                    <span className='font-bold'>Mint NFT ({priceInEth} ETH)</span>
                )}
            </button>            
        </div>
    </div>
  )
}

export default NFTDropPage

//dynamic query below
export const getServerSideProps: GetServerSideProps = async({params}) => {
    const query = `*[_type == 'collection' && slug.current == $id][0]{
        _id,
        title,
        address,
        description,
        nftCollectionName,
        mainImage {
          asset
        },
        previewImage {
          asset
        },
        slug {
          current
        },
        creator -> {
          _id,
          name,
          address,
          slug{
            current
          },
        },
      }`

      const collection = await sanityClient.fetch(query, {
          id: params?.id
      })

      if(!collection){
          return {
              notFound: true
          }
      }

      return {
          props: {
              collection,
          }
      }
}