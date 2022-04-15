import type { NextPage, GetServerSideProps } from 'next'
import Head from 'next/head'
import {sanityClient, urlFor} from '../sanity';
import Link from 'next/link';

// describes shape of object
interface Props {
  colelctions: Collection[]
}

const Home = ({collections}: Props) => {
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

export const getServerSideProps: GetServerSideProps = async () => {
  const query = `*[_type == 'collection']{
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

  const collections = await sanityClient.fetch(query)
  console.log(collections);

  return {
    props: {
      collections
    }
  }
}

// npm install disintegrate - uninstalled
// npm install html2canvas - uninstalled
// npm install @thirdweb-dev/react @thirdweb-dev/sdk ethers
// npm install -g @sanity/cli
// npm install next-sanity @sanity/image-url
//
