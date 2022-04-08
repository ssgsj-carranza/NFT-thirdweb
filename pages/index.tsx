import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';


const Home: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>iizwiiz NFT</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-screen bg-[url('https://www.photofunky.net/output/image/c/6/c/6/c6c6f0/photofunky.gif')] bg-cover bg-center">
        <div className="m-auto">
          <Link href='/nft/nft'>
            <button className=' animate-bounce font-bold rounded-full z-30 text-white px-4 py-2 hover:bg-gradient-to-br from-purple-400 to-yellow-500 hover:rounded-full hover:shadow-lg transition duration-200 ease-out'
            >iizwiiz NFT Drop</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home

// npm install disintegrate - uninstalled
// npm install html2canvas - uninstalled
// npm install @thirdweb-dev/react @thirdweb-dev/sdk ethers
// npm install -g @sanity/cli
