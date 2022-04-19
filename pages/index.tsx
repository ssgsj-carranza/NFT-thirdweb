import type { NextPage, GetServerSideProps } from 'next'
import Head from 'next/head'
import {sanityClient, urlFor} from '../sanity';
import Link from 'next/link';
import { Collection } from '../typings';

// describes shape of object
interface Props {
  collections: Collection[]
}

const Home = ({collections}: Props) => {
  return (
    <div className="">
      <Head>
        <title>iizwiiz NFT</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex h-screen bg-[url('https://www.photofunky.net/output/image/c/6/c/6/c6c6f0/photofunky.gif')] bg-cover bg-center">
          <div className="m-auto">
            <div>
              {collections.map((collection) => (
                <>
                  {/* <div className='flex flex-col items-center cursor-pointer transition-all duration-200 hover:scale-105 justify-between'>
                    <img className='h-80 w-96 rounded-2xl object-cover' 
                        src={urlFor(collection.mainImage).url()}
                        alt=''
                    />
                  </div> */}

                  {/* <div>
                    <h2 className='text-3xl'>{collection.title}</h2>
                    <p className='mt-2 text-sm text-white'>{collection.description}</p>
                  </div> */}
                  
                  <Link href={`/nft/${collection.slug.current}`}>
                    <button className='animate-bounce font-bold rounded-full z-30 text-white px-4 py-2 hover:bg-gradient-to-br from-purple-400 to-yellow-500 hover:rounded-full hover:shadow-lg transition duration-200 ease-out'
                    >{collection.title}</button>
                  </Link>
                </>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home;

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
// npm install  react-hot-toast
// npm install --save-dev tailwindcss-visuallyhidden

