"use client"
import {addTransactionsToBudget, deleteBudget, deleteTransaction, getTransactionsByBudgetId } from '@/app/actions'
import BudgetItem from '@/app/components/BudgetItem'
import Notification from '@/app/components/Notification'
import Wrapper from '@/app/components/Wrapper'
import budgets from '@/data'
import { Budget } from '@/type'
import { Send, Trash } from 'lucide-react'
import { redirect } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = ({params} : {params: Promise<{budgetId : string}>}) => {
//console.log(params)
const [budgetId,setBadgetId] = useState<string>('') 
const [budget,setBudget] = useState<Budget>() 

const [description,setDescription] = useState<string>('')
const [amount,setAmount] = useState<string>('')

const [notification,setNotification] = useState<string>("");
const closeNotification = () => {
        setNotification("")
    }


async function  fetchBudgetData(budgetId : string){

   try {
        if(budgetId){
          const budgetData = await getTransactionsByBudgetId(budgetId)
          setBudget(budgetData)
          console.log(budgetData)
        }
        console.log(budgetId)
       } catch (error) {
        console.error(`Erreur lors de la recuperations des transactions ${error}`)
        
       }
    }

   
  useEffect(()=>{
    const getId = async () => {
    const  resolvedParams = await params;

    setBadgetId(resolvedParams.budgetId)
    fetchBudgetData(resolvedParams.budgetId)
    console.log(resolvedParams)
    }
    getId()
    },[params])

    const handeleAddTransaction = async () => {
       if(!amount || !description ){
        setNotification("Veuillez remplir tous les champs")
        return;

       }

       try {
        const amountNumber = parseFloat(amount);

        if(isNaN(amountNumber) || amountNumber <= 0){
          setNotification("Le monant doit être un nombre possitif.")
        }

        const newTransaction = await addTransactionsToBudget(budgetId,amountNumber,description)
        setNotification('Transaction ajoutée avec succès')
        fetchBudgetData(budgetId)
        setAmount('')
        setDescription('')

        return  newTransaction;
      
       } catch (error) {
          setNotification("Vous avez dpassé le budget")
       }
    }

  const handleDeleteBudget = async () => {
    const confirmed = window.confirm(
      "Etes-vous sûr de vouloir supprimer ce budget et toutes ses transactions associées ?"
    )

    if(confirmed){
      try {
        await deleteBudget(budgetId)
      } catch (error) {
        
      }
      redirect("/budgets")
    }
  } 

  const handleDeleteTransaction = async (transactionId:string) =>{
    const confirmed = window.confirm(
      "Etes-vous sûr de vouloir supprimer ce budget et toutes ses transactions associées ?"
    )

    if(confirmed){
      try {
        await deleteTransaction(transactionId)
        fetchBudgetData(budgetId)
        setNotification("Dépense suprimée")
      } catch (error) {
        
      }
      // redirect("/budgets")
    }
  } 

  return (
    <Wrapper>
     {notification && (
        <Notification message={notification} onclose={closeNotification}>
        </Notification>
      )}
    <div>
      {budget && (
        <div className='flex md:flex-row flex-col'>
          <div className='md:w-1/3'>
            <BudgetItem budget={budget} enableHover={0} />
            <button
            onClick={() =>handleDeleteBudget()}
             className="btn mt-4 rounded-full">Supprimer le budget</button>

            <div className='space-y-4 flex flex-col mt-4'>
                <input 
                type="text"
                id = "description"
                value={description}
                placeholder='Description'
                onChange={(e) => setDescription(e.target.value)}
                className='input input-bordered w-full'
                required
                 />

                <input 
                type="number"
                id = "amount"
                value={amount}
                placeholder='Montant'
                onChange={(e) => setAmount(e.target.value)}
                className='input input-bordered w-full'
                required
                 />

                <button
                onClick={handeleAddTransaction}
                className='btn rounded-full'
                >
                 Ajouter votre dépense
                </button>

            </div>
          </div>

          {budget?.transactions && budget.transactions.length>0 ?(
              <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 md:mt-0 mt-4 md:w-2/3 ml-4">
                  <table className="table">
                    {/* head */}
                    <thead>
                      <tr>
                        <th></th>
                        <th>Montant</th>
                        <th>Description</th>
                        <th>Date</th>
                        <th>Heure</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* row 1 */}
                      {budget.transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className='text-lg md:text-3xl'>{transaction.emoji}</td>
                        <td>{transaction.description}</td>
                        <td>
                          <div className='badge badge-accent badge-xs md:badge-sm'>
                            -{transaction.amount} $
                          </div>
                        </td>
                         <td>{transaction.createdAt.toLocaleDateString("fr-FR")}</td>
                        <td>{transaction.createdAt.toLocaleTimeString("fr-FR",
                          {
                            hour : "2-digit",
                            minute: "2-digit",
                            second : "2-digit"
                         }
                        )}</td>
                        <td>
                          <button
                          onClick={() => handleDeleteTransaction(transaction.id)}
                           className='btn btn-sm rounded-full'>
                              <Trash className='w-4' />
                          </button>
                        </td>
                      
                      </tr>
                      ))}
                     
                    
                    </tbody>
                  </table>
                </div>
          ):(
            <div className='md:w-2/3 mt-10 md:ml-4 flex items-center justify-center'>
              <Send className='w-8 h-8 text-accent b' strokeWidth={1.5}/>
                 <span className='text-gray-500 ml-2'>Aucune transaction.</span>
            </div>

          )}
        </div>
       
      )}
        
    </div>
    </Wrapper>
  )
}

export default page