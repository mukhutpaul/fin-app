"use client"
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import { getReachedBudgets, getTotalTransactionAmount, getTotalTransactionCount } from '../actions';
import Wrapper from '../components/Wrapper';
import { CircleDollarSign, Landmark, PiggyBank } from 'lucide-react';

const page = () => {

    const {user} = useUser();
    const [totalAmount,setTotalAmount] = useState<number | null>(null)
    const [isloading,setIsLoading] = useState(true)
    const [totalCount,setTotalCount] = useState<number | null>(null)
    const [reachedBudgetsRatio, setReachedBudgetsRatio] = useState<string | null>(null)
    
    
    const fetchData = async () => {
        setIsLoading(true)

        try {
            const email = user?.primaryEmailAddress?.emailAddress as string
            
            if(email){
                const count = await getTotalTransactionCount(email)
                const amout = await getTotalTransactionAmount(email)
                const recheadBudget = await getReachedBudgets(email)
                setTotalAmount(amout)
                setTotalCount(count)
                setReachedBudgetsRatio(recheadBudget)
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
                    <span className='text-gray-500 text-sm'>Nombre des transactions</span>
                    <span className='text-2xl font-bold text-accent'>
                        {totalCount !== null ? `${totalCount}`: 'N/A'}
                    </span>
                </div>

                <PiggyBank className='bg-accent h-9 w-9 rounded-full p-1 text-white'/>

            </div>

            <div className='border-2 border-base-300 p-5 flex justify-between
                items-center rounded-xl'>
                
                <div className='flex flex-col'>
                    <span className='text-gray-500 text-sm'>Budgets atteints</span>
                    <span className='text-2xl font-bold text-accent'>
                        {reachedBudgetsRatio || 'N/A'}
                    </span>
                </div>

                <Landmark className='bg-accent h-9 w-9 rounded-full p-1 text-white'/>

            </div>

        </div>

        <div className='w-full md:flex mt-4'>
            <div className='rounded-xl md:w-2/3'>
                 <div>
                    <BarChart width={730} height={250} data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="pv" fill="#8884d8" />
                    <Bar dataKey="uv" fill="#82ca9d" />
                    </BarChart>
                 </div>

            </div>

            <div className='rounded-xl md:w-1/3 ml-4'>

            </div>

        </div>

    </div>
    )}
    </Wrapper>
  )
}

export default page