"use client"
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import { getTotalTransactionAmount } from '../actions';
import Wrapper from '../components/Wrapper';
import { CircleDollarSign } from 'lucide-react';

const page = () => {

    const {user} = useUser();
    const [totalAmount,setTotalAmount] = useState<number | null>(null)
    const [isloading,setIsLoading] = useState(true)
    
    
    const fetchData = async () => {
        setIsLoading(true)

        try {
            const email = user?.primaryEmailAddress?.emailAddress as string
            
            if(email){
                const amout = await getTotalTransactionAmount(email)
                setTotalAmount(amout)
                setIsLoading(false)

            }
            
            
        } catch (error) {

            console.error("Erreur lors de la récuperation des données:",error);
            
        }
    }

    useEffect(()=>{
      fetchData()
    },[user])


  return (
    <Wrapper>
    {isloading ?(
       <div className='flex justify-center items-center'>
        <span className="loading loading-ring loading-xs"></span>
        <span className="loading loading-ring loading-sm"></span>
        <span className="loading loading-ring loading-md"></span>
        <span className="loading loading-ring loading-lg"></span>
        <span className="loading loading-ring loading-xl"></span>
       </div>
    ): (
    <div>
        <div className='grid md:grid-cols-3 gap-4'>
            <div className='border-2 border-base-300 p-5 flex justify-between
                items-center rounded-xl'>
                
                <div className='flex flex-col'>
                    <span className='text-gray-500 text-sm'>Total des transactions</span>
                    <span className='text-2xl font-bold text-accent'>
                        {totalAmount !== null ? `${totalAmount} $`: 'N/A'}
                    </span>
                </div>

                <CircleDollarSign className='bg-accent h-9 w-9 rounded-full p-1 text-white'/>

            </div>

            <div className='border-2 border-base-300 p-5 flex justify-between
                items-center rounded-xl'>
                
                <div className='flex flex-col'>
                    <span className='text-gray-500 text-sm'>Total des transactions</span>
                    <span className='text-2xl font-bold text-accent'>
                        {totalAmount !== null ? `${totalAmount} $`: 'N/A'}
                    </span>
                </div>

                <CircleDollarSign className='bg-accent h-9 w-9 rounded-full p-1 text-white'/>

            </div>

            <div className='border-2 border-base-300 p-5 flex justify-between
                items-center rounded-xl'>
                
                <div className='flex flex-col'>
                    <span className='text-gray-500 text-sm'>Total des transactions</span>
                    <span className='text-2xl font-bold text-accent'>
                        {totalAmount !== null ? `${totalAmount} $`: 'N/A'}
                    </span>
                </div>

                <CircleDollarSign className='bg-accent h-9 w-9 rounded-full p-1 text-white'/>

            </div>

            </div>

        </div>
    )}
    </Wrapper>
  )
}

export default page