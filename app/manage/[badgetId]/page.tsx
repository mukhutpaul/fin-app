"use client"
import { getTransactionsByBudgetId } from '@/app/actions'
import budgets from '@/data'
import React, { useEffect, useState } from 'react'

const page = ({params} : {params: Promise<{budgetId : string}>}) => {

    const [budgetId,setBudgetId] = useState<string>('')

    async function  fetchBudgetData(budgetId : string){
       try {
        if(budgetId){
            const budgetId = await getTransactionsByBudgetId(budgetId)
        }
        
       } catch (error) {
        console.error(`Erreur lors de la recuperations des transactions ${error}`)
        
       }
    }

    useEffect(()=>{
        const getId = async () => {
            const resolvedParams = await params;
            setBudgetId(resolvedParams.budgetId)
            fetchBudgetData(resolvedParams.budgetId)
        }
    },[params])
  return (
    <div>
        
    </div>
  )
}

export default page