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

export async function getBudgetsByUser(email:string){
    try {
        const user = await prisma.user.findUnique({
            where : {
                email
            },
            include : {
                budgets : {
                    include : {
                        transactions:true
                    }

                }
            }
        })

        if(!user) {
            throw new Error("Utilisater non trouvé")
        }

        return user.budgets
        
    } catch (error) {
        console.error("Erreur lors de la récupération des budgest:",error);
        throw error;
        
    }
}

export async function getTransactionsByBudgetId(budgetId:string){
     try {
        const budget = await prisma.budget.findUnique({
            where : {
                id: budgetId
            },
            include : {
                transactions : true
            }
        })

        if(!budget){
            throw new Error("Budget non trouvé");
        }

        return budget;
        
     } catch (error) {
        console.error("Erreur lors de la recyupération des transations.")
        throw error;
        
     }

}

export async function addTransactionsToBudget(
    budgetId:string,
    amount: number,
    description: string
){
    try {

        const budget = await prisma.budget.findUnique({
            where : {
                id : budgetId
            },
            include : {
                transactions: true
            }
        })

        if(!budget){
            throw new Error("Budget non trouvé.")
        }

        const totalTransactons = budget.transactions.reduce((sum,transaction) => {
                return sum + transaction.amount
        },0)

        const totalWithNewTransaction = totalTransactons + amount

        if(totalWithNewTransaction > budget.amount){
            throw new Error('Le montant total des transactions dépasses le montant du budget.');
        }

        const newTransaction = await prisma.transaction.create({
            data : {
                amount,
                description,
                emoji : budget.emoji,
                budget : {
                    connect : {
                        id : budget.id,
                    }

                }
            }


        })

        
    } catch (error) {
        console.error("Erreur lors de l'ajout de la transaction:",error);
        throw error
        
    }
    
}