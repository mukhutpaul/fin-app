"use client"
import { UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

const Navbar = () => {
    const {isLoaded,isSignedIn,user} =useUser()
  return (
    <div className='bg-base-200/30 px-5 md:px-[10%] py-4'>
        {isLoaded && (
            (isSignedIn ? (
                <>
               <div className='flex justify-between items-center'>
                <div className='flex text-2xl items-center font-bold'>
                    e <span className='text-accent'>.Track</span>
                </div>

                <div className='md:flex hidden'>
                    <Link href={""} 
                    className='btn rounded-full'
                    >Mes budgets
                    </Link>
                    <Link href={""}
                    className='btn mx-4 rounded-full'
                    >Tableau de bord
                    </Link>
                    <Link href={""}
                    className='btn rounded-full'
                    >Mes transactions
                    </Link>
                </div>
                <UserButton/>

               </div>
               <div className='md:hidden flex mt-2 justify-center'>
                    <Link href={""} 
                    className='btn rounded-full btn-sm'
                    >Mes budgets
                    </Link>
                    <Link href={""}
                    className='btn mx-4 rounded-full btn-sm'
                    >Tableau de bord
                    </Link>
                    <Link href={""}
                    className='btn rounded-full btn-sm'
                    >Mes transactions
                    </Link>
                </div>
                </>
            ) : (

                <div>
                     <div className='md:hidden flex mt-2 justify-center'>
                    <Link href={""} 
                    className='btn rounded-full btn-sm'
                    >Mes budgets
                    </Link>
                    <Link href={""}
                    className='btn mx-4 rounded-full btn-sm'
                    >Tableau de bord
                    </Link>
                    <Link href={""}
                    className='btn rounded-full btn-sm'
                    >Mes transactions
                    </Link>
                </div>
                     
                </div>

            ))
        )}


    </div>
  )
}

export default Navbar