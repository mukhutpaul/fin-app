"use client"

import React, { useEffect, useState } from 'react'
import Wrapper from '../components/Wrapper'
import { useUser } from '@clerk/nextjs'
import EmojiPicker from 'emoji-picker-react'
import { addBudget, getBudgetsByUser } from '../actions'
import Notification from '../components/Notification'
import { Budget } from '@/type'
import Link from 'next/link'
import BudgetItem from '../components/BudgetItem'



const page = () => {
    const {user} = useUser()
    const [budgetName,setBudgetName] = useState<string>("")
    const [budgetAmont,setBudgetAmount] = useState<string>("")

    const [showEmojiPicker,setShowEmojiPicker] = useState<boolean>(false);

    const [selectedEmoji,setSelectedEmoji] = useState<string>("");
    const [notification,setNotification] = useState<string>("");
    const [budgets, setBudgets] = useState<Budget[]>([])
    const closeNotification = () => {
        setNotification("")
    }

    const handleEmodjiSelect = (emojiObject : {emoji : string}) =>{
        setSelectedEmoji(emojiObject.emoji)
        setShowEmojiPicker(false)
    }

    const handleAddBudget = async  () =>{
        try {
            const amount = parseFloat(budgetAmont)

            if(isNaN(amount) || amount <= 0){
                  throw new Error("le montant doit être un nombre possitif");
            }
            await addBudget(
                user?.primaryEmailAddress?.emailAddress as string,
                budgetName,
                amount,
                selectedEmoji
            )

            const modal = document.getElementById("my_modal_3") as HTMLDialogElement

            if(modal){
                modal.close()
            }

            setNotification("Nouveau Budget créé avec succè.")
            setBudgetName("")
            setBudgetAmount("")
            setSelectedEmoji("")
            setShowEmojiPicker(false)
            
        } catch (error) {
            setNotification(`Erreur : ${error}`)
            
        }
    }

    const fetchBudgets = async () => {
        if(user?.primaryEmailAddress?.emailAddress){
            try {
                const userBudgets = await getBudgetsByUser(user?.primaryEmailAddress?.emailAddress)
                setBudgets(userBudgets)

                
            } catch (error) {
                setNotification(`Erreur lors de la récuperation des budgets: ${error}`)
                
            }
        }
    }

    useEffect(() =>{
        fetchBudgets()
    },[user?.primaryEmailAddress?.emailAddress])

  return (
    <Wrapper>
        {notification && (
            <Notification message={notification} onclose={closeNotification}>
            </Notification>
        )}
      {/* You can open the modal using document.getElementById('ID').showModal() method */}
        <button className="btn rounded-full" onClick={()=>(document.getElementById('my_modal_3') as HTMLDialogElement).showModal()}>Nouveau Budget</button>
        <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
            <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle  btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 className="font-bold text-lg">
                Création d'un budget
            </h3>
            <p className="py-4">Permet de contrôler ces dépenses facilement</p>
            <div className='w-full flex flex-col'>
                <input 
                type="text"
                value={budgetName}
                placeholder='Nom du buget'
                onChange={(e) => setBudgetName(e.target.value)}
                className='input input-bordered mb-3'
                required
                 />
                <input 
                type="number"
                value={budgetAmont}
                placeholder='Amount'
                onChange={(e) => setBudgetAmount(e.target.value)}
                className='input input-bordered mb-3'
                required
                />


                <button
                className='btn rounded-full mb-3'
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                 {selectedEmoji || "Sélectionnez un emoji 🫵"}
                </button>


                {showEmojiPicker && (
                    <div className='flex justify-center items-center my-4'>
                        <EmojiPicker onEmojiClick={handleEmodjiSelect}/>
                    </div>
                )}

               

                <button 
                onClick={handleAddBudget}
                className='btn rounded-full'>
                    Ajouter Budget
                </button>

            </div>
        </div>
        </dialog>

        <ul className='grid md:grid-cols-3 gap-4 py-4'>
        { budgets.map((budget)=>(
            <Link href={""} key={budget.id}>
               <BudgetItem budget={budget}></BudgetItem>
            </Link>
        ))
        
        }

        </ul>
    </Wrapper>
  )
}

export default page