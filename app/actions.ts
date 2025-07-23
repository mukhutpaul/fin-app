'use server'

import budgets from "@/data";
import prisma from "@/lib/prisma";
import { Budget,Transaction } from "@/type";
import { Sumana } from "next/font/google";

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

export const deleteBudget = async (budgetId: string) => {
    try {
        await prisma.transaction.deleteMany({
            where : {
                budgetId
            }
    
        })

        await prisma.budget.delete({
            where : {
                id: budgetId  
            }
        })
        
    } catch (error) {
        console.error('Erreur lors de la suppression du budget et de ses transactions assoxiées:', error);
        throw error; 
    }
}
export const deleteTransaction = async (transactionId: string) => {
    try {
        const transaction = await prisma.transaction.findUnique({
            where : {
                id: transactionId
            }
    
        })

        if(!transaction) {
            throw new Error('Transaction non trouvée.')
        }

        await prisma.transaction.delete({
            where : {
                id: transactionId
            }
        });

        
    } catch (error) {
        console.error('Erreur lors de la suppression des transactions:', error);
        throw error; 
    }
}

export async function getTransactionsByEmailAndPeriod(email: string, period: string) {
    try {
        const now = new Date();
        let dateLimit

        switch (period) {
            case 'last30':
                dateLimit = new Date(now)
                dateLimit.setDate(now.getDate() - 30);
                break
            case 'last90':
                dateLimit = new Date(now)
                dateLimit.setDate(now.getDate() - 90);
                break
            case 'last7':
                dateLimit = new Date(now)
                dateLimit.setDate(now.getDate() - 7);
                break
            case 'last365':
                dateLimit = new Date(now)
                dateLimit.setFullYear(now.getFullYear() - 1);
                break
            default:
                throw new Error('Période invalide.');
        }

        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                budgets: {
                    include: {
                        transactions: {
                            where: {
                                createdAt: {
                                    gte: dateLimit
                                }
                            },
                            orderBy: {
                                createdAt: 'desc'
                            }
                        }
                    }

                }
            }
        })


        if (!user) {
            throw new Error('Utilisateur non trouvé.');
        }

        const transactions = user.budgets.flatMap(budjet =>
            budjet.transactions.map(transaction => ({
                ...transaction,
                budgetName: budjet.name,
                budgetId: budjet.id
            }))
        )

        return transactions

    } catch (error) {
        console.error('Erreur lors de la récupération des transactions:', error);
        throw error;
    }
}

//dashboard

export async function getTotalTransactionAmount(email: string){
    try {
        const user = await prisma.user.findUnique({
            where : {email},
            include : {
                budgets : {
                    include : {
                        transactions : true
                    }
                }
            }
        })
        
        if(!user) throw new Error("Utilisateur non trouvé.");

        const totalAmount = user.budgets.reduce((sum,budget) => {
            return sum + budget.transactions.reduce((budgetSum, transaction) => budgetSum + transaction.amount,0)
        },0)

        return totalAmount
    } catch (error) {
        console.error("Erreur lors du calcul du montant total des transactions:",error)
        throw error;
        
    }
}

export async function getTotalTransactionCount(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                budgets: {
                    include: {
                        transactions: true
                    }
                }
            }
        })

        if (!user) throw new Error("Utilisateur non trouvé");

        const totalCount = user.budgets.reduce((count, budget) => {
            return count + budget.transactions.length
        }, 0)

        return totalCount
    } catch (error) {
        console.error("Erreur lors du comptage des transactions:", error);
        throw error;
    }

}

export async function getReachedBudgets(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                budgets: {
                    include: {
                        transactions: true
                    }
                }
            }
        })

        if (!user) throw new Error("Utilisateur non trouvé");

        const totalBudgets = user.budgets.length;
        const reachedBudgets = user.budgets.filter(budjet => {
            const totalTransactionsAmount = budjet.transactions.
                reduce((sum, transaction) => sum + transaction.amount, 0)
            return totalTransactionsAmount >= budjet.amount
        }).length

        return `${reachedBudgets}/${totalBudgets}`
    } catch (error) {
        console.error("Erreur lors du calcul des budgets atteints:", error);
        throw error;
    }

}

export async function getUserBudgetData(email: string) {
    try {

         const user = await prisma.user.findUnique({
            where: { email },
            include: {
                budgets: {
                    include: {
                        transactions: true
                    }
                }
            }
        });

        if(!user) {
            console.error("Utilisateur non trouvé.")
        }

        const data = user?.budgets.map(budget => {
            const totalTransactionAmount = budget.transactions.reduce((sum,transaction) => sum + transaction.amount,0); 

            return {
                budgetName : budget.name,
                totalBudgetAmount : budget.amount,
                totalTransactionAmount
            }
        })

        return data;
        
    } catch (error) {
        console.error("Erreur lors de la récuperation des données budgétaires:",error)
        throw error;
        
    }
}


