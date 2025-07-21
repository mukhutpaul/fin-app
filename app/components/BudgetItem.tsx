import { Budget } from '@/type'
import React from 'react'

interface BudgetItemProps {
    budget : Budget
}

const BudgetItem : React.FC<BudgetItemProps> = ({budget}) => {

    const transacionCount = budget.transactions ? budget.transactions.length : 0;
    const totalTransactionAmount = budget.transactions ? budget.transactions.reduce((sum,transaction) => sum + transaction.amount,0)
    : 0

    const remainingAmount = budget.amount - totalTransactionAmount

    return (
    <li 
    key={budget.id}
    className='p-4 rounded-xl border-2 border-base-300 list-none'
    >
    <div className='flex items-center justify-between'>
        <div className='flex items-center'>
            <div className='bg-accent/20 text-xl h-10 w-10 rounded-full flex justify-center items-center'>
                {budget.emoji}
            </div>
            <div className='flex flex-col ml-3'>
                <span className='font-bold text-xl'>{budget.name}</span>
                <span className='text-gray-500 text-sm'>{transacionCount} transaction(e)</span>

            </div>
        </div>

        <div className='text-xl font-bold tetx-accent'>
           {budget.amount} $
        </div>


    </div>
    </li>
  )
}

export default BudgetItem