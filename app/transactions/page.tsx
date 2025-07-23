"use client"

import { Transaction } from '@/type'
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'

import Wrapper from '../components/Wrapper'
import { getTransactionsByEmailAndPeriod } from '../actions'

const page = () => {

    const {user} = useUser()
    const [transaction,setTransaction] = useState<Transaction[]>([])
    const [loading,setLoading] = useState<boolean>(false)

    const fetchTransactions = async(period:string) => {
        if(user?.primaryEmailAddress?.emailAddress){
            setLoading(true)
            try {

                const transactionData = await getTransactionsByEmailAndPeriod(user?.primaryEmailAddress?.emailAddress,period)
                setTransaction(transactionData)
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
        <div className="overflow-x-auto">
        {loading ? (
        <div className='flex justify-center items-center'>
          <span className="loading loading-ring loading-md"></span>
        </div>
        ): transaction.length === 0 ?(
           <div></div>
        ):(
            <div></div>
        )}
        </div>
    </Wrapper>
  )
}

export default page