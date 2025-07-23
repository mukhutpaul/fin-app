"use client"

import { Transaction } from '@/type'
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'

import Wrapper from '../components/Wrapper'
import { getTransactionsByEmailAndPeriod } from '../actions'
import TransactionItem from '../components/TransactionItem'

const page = () => {

    const {user} = useUser()
    const [transactions,setTransactions] = useState<Transaction[]>([])
    const [loading,setLoading] = useState<boolean>(false)

    const fetchTransactions = async(period:string) => {
        if(user?.primaryEmailAddress?.emailAddress){
            setLoading(true)
            try {

                const transactionData = await getTransactionsByEmailAndPeriod(user?.primaryEmailAddress?.emailAddress,period)
                setTransactions(transactionData)
                setLoading(false)
            } catch (error) {
                console.error("Erreur lors de la transaction:",error)
                
            }
        }
    }

    useEffect(() => {
        fetchTransactions("last30")

    },[user?.primaryEmailAddress?.emailAddress])
  return (
    <Wrapper>
        <div className="overflow-x-auto w-full bg-base-200/35 rounded-xl p-5">
        {loading ? (
        <div className='flex justify-center items-center'>
            <span className="loading loading-ring loading-xs"></span>
            <span className="loading loading-ring loading-sm"></span>
            <span className="loading loading-ring loading-md"></span>
            <span className="loading loading-ring loading-lg"></span>
            <span className="loading loading-ring loading-xl"></span>
        </div>
        ): transactions.length === 0 ?(
           <div className='flex justify-center items-center h-full'>
            <span className='text-gray-500 text-sm'>Aucune transaction à afficher.</span>
           </div>
        ):(
            <ul className='divide-y divide-base-300'>
                 {transactions.map((transaction) => (
                    <TransactionItem 
                    key={transaction.id}  
                    transaction={transaction} >

                    </TransactionItem>
                 ))}
            </ul>
        )}
        </div>
    </Wrapper>
  )
}

export default page