import Express from 'express'
import { PrismaClient, User } from '@prisma/client'
import cors from "cors"

const prisma = new PrismaClient()
const app = Express()
app.use(Express.json())
app.use(cors())

app.get("/users", async (request, response) => {
    const users = await prisma.user.findMany()
    
    return response.status(200).json(users)
})

app.post("/users", async (request, response) => {
    const { name, email }= request.body

    const users = await prisma.user.findUnique({ where: { email } })
    
    if(!email){
        return response.json({ error: "Email é obrigatorio" })
    }
    
    if(users){
        return response.json({ error: "Email ja foi cadastrado" })
    }

    await prisma.user.create({ data: { name, email } })

    return response.status(200).json({ message: "Usuarios adicionado com sucesso" })
})

app.put("/users/:id", async (request, response) => {
    const { id } = request.params
    const { name }= request.body
    
    let user = await prisma.user.findUnique({ where: { id: Number(id) } })

    if(user?.name === name){
        return response.json({ error: "Usuario já possui esse nome" })
    }

    user = await prisma.user.update({
        where: { id: Number(id) },
        data: { name }
    })

    return response.status(200).json({ message: "Usuarios alterado com sucesso" })
})


app.delete("/users/:id", async (request, response) => {
    const { id } = request.params
    
    let user = await prisma.user.findUnique({ where: { id: Number(id) } })

    if(!user){
        return response.json({ error: "Usuario não existe" })
    }

    user = await prisma.user.delete({ where: { id: Number(id) }})
    
    return response.status(200).json({ message: "Usuarios deletado com sucesso" })
})


app.listen(9191, () => { console.log("Servidor iniciado") })
