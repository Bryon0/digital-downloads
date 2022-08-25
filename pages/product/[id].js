import Head from 'next/head'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from "next/router";
import prisma from 'lib/prisma'
import { getProduct } from 'lib/data'

import Heading from 'components/Heading'

export default function Product({ product }) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const loading = status === 'loading'

  if (loading) {
    return null
  }
  
  if (!product) {
    return null
  }

  return (
    <div>
      <Head>
        <title>Digital Downloads</title>
        <meta name='description' content='Digital Downloads Website' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Heading />

      <div className='flex justify-center'>
        <div className='border flex flex-col w-full md:w-2/3 xl:w-1/3 mx-auto px-4 mt-10'>
          <div className='flex justify-between py-10'>
            {product.image && (
              <img src={product.image} className='w-14 h-14 flex-initial' />
            )}
            <div className='flex-1 ml-3'>
              <p>{product.title}</p>
              {product.free ? (
                <span className='bg-white text-black px-1 uppercase font-bold'>
                  free
                </span>
              ) : (
                <p>${product.price / 100}</p>
              )}
            </div>
            <div className=''>
            {!session && <p>Login first</p>}
              {session && (
                <>
                  {session.user.id !== product.author.id ? (
                    	<button
                      className='text-sm border p-2 font-bold uppercase'
                      onClick={async () => {
                        if (product.free) {
                          await fetch('/api/download', {
                            body: JSON.stringify({
                              product_id: product.id,
                            }),
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            method: 'POST',
                          })
                    
                          router.push('/dashboard')
                        } else {
                    
                        }    
                      }}
                    >
                      {product.free ? 'DOWNLOAD' : 'PURCHASE'}
                    </button>
                  ) : (
                    'Your product'
                  )}
                </>
              )}
            </div>
          </div>
          <div className='mb-10'>
            {product.description}
          </div>
          <div className='mb-10'>
            Created by
            <Link href={`/profile/${product.author.id}`}>
              <a className='font-bold underline ml-1'>{product.author.name}</a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  let product = await getProduct(context.params.id, prisma)
	product = JSON.parse(JSON.stringify(product))

  return {
    props: {
      product,
    },
  }
}