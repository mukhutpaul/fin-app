"use client"
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import { getLastBudgets, getLastTransactions, getReachedBudgets, getTotalTransactionAmount, getTotalTransactionCount, getUserBudgetData } from '../actions';
import Wrapper from '../components/Wrapper';
import { CircleDollarSign, Landmark, PiggyBank } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Budget, Transaction } from '@/type';
import Link from 'next/link';
import BudgetItem from '../components/BudgetItem';
import TransactionItem from '../components/TransactionItem';

const page = () => {

    const {user} = useUser();
    const [totalAmount,setTotalAmount] = useState<number | null>(null)
    const [isloading,setIsLoading] = useState(true)
    const [totalCount,setTotalCount] = useState<number | null>(null)
    const [reachedBudgetsRatio, setReachedBudgetsRatio] = useState<string | null>(null)
    const [budgetData,setBudgetData] = useState<any[]>([])
    const [transactions,setTransaction] = useState<Transaction[]>([]);
    const [budgets,setBudget] = useState<Budget[]>([])
    
    
    const fetchData = async () => {
        setIsLoading(true)

        try {
            const email = user?.primaryEmailAddress?.emailAddress as string
            
            if(email){
                const count = await getTotalTransactionCount(email)
                const amout = await getTotalTransactionAmount(email)
                const recheadBudget = await getReachedBudgets(email)
                const budgetData = await getUserBudgetData(email)
                const lastTransaction = await getLastTransactions(email)
                const lastBudget = await getLastBudgets(email)
                setTotalAmount(amout)
                setTotalCount(count)
                setReachedBudgetsRatio(recheadBudget)
                setBudgetData(budgetData)
                setBudget(lastBudget)
                setTransaction(lastTransaction)
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
                 <div className='border-2 border-base-300 p-5 rounded-xl'>
                      <h3 className='text-lg font-semibold mb-3'>
                        Statistiques ( en $ )
                      </h3>

                    <ResponsiveContainer height={250} width="100%">
            
                    <BarChart width={730} height={250} data={budgetData}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="budgetName" />
                    <Tooltip />
        
                    <Bar 
                    name="Budget"
                    dataKey="totalBudgetAmount"
                    radius={[10,10,0,0]}
                    fill="#EF9FBC" />
                    <Bar 
                    radius={[10,10,0,0]}
                    name="Dépensé"
                    dataKey="totalTransactionsAmount" 
                    fill="#EEAF3A" />
                    </BarChart>
                    </ResponsiveContainer>
                 </div>

                 <div className='mt-4 border-2 border-base-300 p-5 rounded-xl'>
                    <h3 className='text-lg font-semibold mb-3'>
                    Dernieres transactions
                   </h3>

                    <ul className='divide-y divide-base-300'>
                 {transactions.map((transaction) => (
                    <TransactionItem 
                    key={transaction.id}  
                    transaction={transaction} >

                    </TransactionItem>
                 ))}
            </ul>

                 </div>

            </div>

            <div className='rounded-xl md:w-1/3 ml-4'>
               
                <h3 className='text-lg font-semibold my-4 md:mb-4 md:mt-0'>
                    Derniers budgets
                </h3>

                   <ul className='grid md:grid-cols-1 gap-4 py-4'>
                        {budgets.map((budget)=>(
                            <Link href={`/manage/${budget.id}`} key={budget.id}>
                               <BudgetItem budget={budget} enableHover={1}></BudgetItem>
                            </Link>
                        ))
                        
                        }
                    </ul>

            </div>

        </div>

    </div>
    )}
    </Wrapper>
  )
}

export default page