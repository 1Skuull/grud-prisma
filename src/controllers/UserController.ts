import { Request, Response } from "express";
import { prisma } from "../prisma"


async function GetUser(request:Request, response:Response){
    const users = await prisma.user.findMany()
    
    return response.status(200).json(users)
}


async function CreateUser(request:Request, response:Response){
    const { name, email }= request.body

    const users = await prisma.user.findUnique({ where: { email } })
    
    if(!email){
        return response.status(401).json({ error: "Email é obrigatorio" })
    }
    
    if(users){
        return response.status(401).json({ error: "Email ja foi cadastrado" })
    }

    await prisma.user.create({ data: { name, email } })

    return response.status(200).json({ message: "Usuarios adicionado com sucesso" })
}


async function UpdateUser(request:Request, response:Response){
    const { id } = request.params
    const { name }= request.body
    
    let user = await prisma.user.findUnique({ where: { id: Number(id) } })

    if(user?.name === name){
        return response.status(401).json({ error: "Usuario já possui esse nome" })
    }

    user = await prisma.user.update({
        where: { id: Number(id) },
        data: { name }
    })

    return response.status(200).json({ message: "Usuarios alterado com sucesso" })
}


async function DeleteUser(request:Request, response:Response){
    const { id } = request.params
    
    let user = await prisma.user.findUnique({ where: { id: Number(id) } })

    if(!user){
        return response.status(401).json({ error: "Usuario não existe" })
    }

    user = await prisma.user.delete({ where: { id: Number(id) }})
    
    return response.status(200).json({ message: "Usuarios deletado com sucesso" })
}

export default { GetUser, CreateUser, UpdateUser, DeleteUser }