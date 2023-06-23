import { Router } from "express"
import userController from "./controllers/userController"

const router = Router()

router.get("/users", userController.GetUser)

router.post("/users", userController.CreateUser)

router.put("/users/:id", userController.UpdateUser)

router.delete("/users/:id", userController.DeleteUser)


export default router