import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

const Home: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>NFT Drop</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className=''>NFT Drop</h1>
    </div>
  )
}

export default Home

// npm install disintegrate - uninstalled
// npm install html2canvas - uninstalled
// npm install @thirdweb-dev/react @thirdweb-dev/sdk ethers

