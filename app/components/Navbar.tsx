"use client"
import { UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { checkAndAddUser } from '../actions'

const Navbar = () => {
    const {isLoaded,isSignedIn,user} =useUser();

    useEffect(() => {
        if(user?.primaryEmailAddress?.emailAddress){
            checkAndAddUser(user?.primaryEmailAddress?.emailAddress)

        }
    },[user])

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
                    <Link href={"/budgets"} 
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
                    <Link href={"/budgets"} 
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

            <div className='flex items-center justify-between'>
                <div className='flex text-2xl items-center font-bold'>
                    e <span className='text-accent'>.Track</span>
                </div>
                <div className='flex mt-2 justify-center'>
                    <Link href={"/sign-in"} 
                    className='btn rounded-full btn-sm'
                    >
                        Se connecter
                    </Link>
                    <Link href={"/sign-up"}
                    className='btn mx-4 rounded-full btn-sm btn-accent'
                    >
                        S'inscrire
                    </Link>
                   
                </div>
                     
            </div>

            ))
        )}


    </div>
  )
}

export default Navbar