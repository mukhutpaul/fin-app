"use client"

import React, { useEffect, useState } from 'react'
import Wrapper from '../components/Wrapper'
import { useUser } from '@clerk/nextjs'
import EmojiPicker from 'emoji-picker-react'


const page = () => {
    const {user} = useUser()
    const [budgetName,setBudgetName] = useState<string>("")
    const [budgetAmont,setBudgetAmount] = useState<string>("")

    const [showEmojiPicker,setShowEmojiPicker] = useState<boolean>(false);

    const [selectedEmoji,setSelectedEmoji] = useState<string>("");

    const handleEmodjiSelect = (emojiObject : {emoji : string}) =>{
        setSelectedEmoji(emojiObject.emoji)
        setShowEmojiPicker(false)
    }

  return (
    <Wrapper>
      {/* You can open the modal using document.getElementById('ID').showModal() method */}
        <button className="btn rounded" onClick={()=>(document.getElementById('my_modal_3') as HTMLDialogElement).showModal()}>Nouveau Budget</button>
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
                placeholder='Nom du buget'
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

               

                <button className='btn rounded-full'>
                    Ajouter Budget
                </button>

            </div>
        </div>
        </dialog>
    </Wrapper>
  )
}

export default page