'use server'

import prisma from "@/lib/prisma";

export async function checkAndAddUser(email:string | undefined){
    if(!email)return;

    try {
        const existingUser = await prisma.user.findUnique({
            where : {
                email
            }
        })

        if(!existingUser){
            await prisma.user.create({
                data : {email}
            })
            
            console.log("Nouvel utilisateur ajouté dans la bdd");
        
        }else{
            console.log("Utilisateur déjà présent dans la bdd");
    
        }
       
    } catch (error) {
        console.error("Error lors de la verification de l'utilisateur",error);
        
    }
}

export async function addBudget(email:string | undefined,name: string,amount:number,selectedEmoji:string){

    try {

        const user = await prisma.user.findUnique({
            where : {email}
        })

        if(!user){
            throw new Error("Utilisateur non trouvé");
        }

        await prisma.budget.create({
            data : {
                name,
                amount,
                emoji: selectedEmoji,
                userId : user.id
            }
        })
        
    } catch (error) {
        console.log("Erreur lors de l'ajout du budget",error);
        throw error
    }
}