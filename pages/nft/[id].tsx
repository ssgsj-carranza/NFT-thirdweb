import React from 'react'

function NFTDropPage() {
  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
        {/* left side */}
        <div className="bg-gradient-to-br from-cyan-800 to-rose-500 lg:col-span-4">
            <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
                <div className="bg-gradient-to-br from-orange-200 to-purple-600 p-2 rounded-xl">
                    <img className="w-44 rounded-xl object-cover lg:h-96 lg:w-72" 
                        src="https://cdn.benzinga.com/files/images/story/2021/boredapeyachtclub_nft_image_16.png" 
                        alt="" 
                    />
                </div>
                <div className='text-center p-5 space-y-2'>
                    <h1 className="text-4xl font-bold text-white">NFTs</h1>
                    <h2 className="text-xl text-gray-300">A collection on NFTs not screenshotted</h2>
                </div>
            </div>
        </div>

        {/* right side */}
        <div className="flex flex-1 flex-col p-12 lg:col-span-6">
            {/* header */}
            <header className="flex items-center justify-between">
                <h1 className='w-52 cursor-pointer text-xl font-extralight sm:w-80'>The{' '}<span className='font-extrabold underline decoration-pink-600/50 hover:animate-spin'>iizwiiz</span>{' '}NFT Market Place</h1>
                <button className='rounded-full bg-rose-400 text-white px-4 py-2 text-xs font-bold lg:px-5 lg:py-3 lg:text-base hover:shadow-lg cursor-pointer hover:border-none hover:text-rose-400 hover:bg-white transition duration-200 ease-out'>Sign In</button>
            </header>
            
            {/* content */}

            {/* mint button */}
        </div>
    </div>
  )
}

export default NFTDropPage