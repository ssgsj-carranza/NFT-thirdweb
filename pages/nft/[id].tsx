import React, { useEffect, useState } from 'react'
import { useAddress, useDisconnect, useMetamask, useNFTDrop } from "@thirdweb-dev/react";
import type { GetServerSideProps } from 'next'
import { sanityClient, urlFor } from '../../sanity';
import { Collection } from '../../typings';
import Link from 'next/link';
import { BigNumber } from 'ethers';

interface Props {
    collection: Collection
}

function NFTDropPage({collection}: Props) {
    const [claimedSupply, setClaimedSupply] = useState<number>(0);
    const [totalSupply, setTotalSupply] = useState<BigNumber>();
    const nftDrop = useNFTDrop(collection.address);
    const [loading, setLoading] = useState<boolean>(true);
    //AUTH
    const connectWithMetamask = useMetamask();
    const address = useAddress();
    const disconnect = useDisconnect();

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

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
        {/* left side */}
        <div className="bg-gradient-to-br from-cyan-800 to-rose-500 lg:col-span-4">
            <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
                <div className="bg-gradient-to-br from-orange-200 to-purple-600 p-2 rounded-xl">
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
        <div className="flex flex-1 flex-col p-12 lg:col-span-6">
            {/* header */}
            <header className="flex items-center justify-between">
                <Link href={'/'}>
                    <h1 className='w-52 cursor-pointer text-xl font-extralight sm:w-80'>The{' '}<span className='font-extrabold underline decoration-pink-600/50'>iizwiiz</span>{' '}NFT Market Place</h1>
                </Link>
                <button className='rounded-full bg-rose-400 text-white px-4 py-2 text-xs font-bold lg:px-5 lg:py-3 lg:text-base hover:shadow-lg cursor-pointer hover:border-none hover:text-rose-400 hover:bg-white transition duration-200 ease-out'
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
                <img className='w-80 object-cover pb-10 lg:h-45'
                     src={urlFor(collection.mainImage).url()} 
                     alt="" 
                />
                <h1 className='text-3xl font-bold lg:text-5xl lg:font-extrabold'>{collection.title}</h1>
                {loading ? (
                    <p className='pt-2 text-xl text-green-500 animate-pulse'>Loading Collection supply count.....</p>
                ):(
                    <p className='pt-2 text-xl text-green-500'>{claimedSupply}/{totalSupply?.toString()} NFT's claimed</p>
                )}
            </div>
            {/* mint button */}
            <button className='h-16 w-full text-white rounded-full bg-rose-400 mt-10 hover:shadow-lg hover:border-none hover:text-rose-400 hover:bg-white transition duration-200 ease-out font-bold'>
                Mint NFT (0.01 ETH)
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