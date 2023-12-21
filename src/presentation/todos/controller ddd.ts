import { Request, Response } from "express"
import { prisma } from "../../data/postgres"
import { get } from 'env-var';
import { CreateTodoDto } from "../../domain/dtos";
import { UpdateTodoDto } from '../../domain/dtos/todos/update-todo.dto';
import { TodoRepository } from "../../domain";

interface Todos {
    id: number,
    text: string,
    completedAt: Date | null
}

export class TodosController {

    constructor(
        private readonly todoRepository: TodoRepository
    ) { }

    public getTodos = async (req: Request, res: Response) => {
        // const todos = await prisma.todo.findMany()
        // return res.json(todos)
        const todos = await this.todoRepository.getAll()
        return res.json(todos)
    }

    public getTodosById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        // if (isNaN(id)) return res.status(400).json({ error: "ID is not a number" });
        // // const todo = todos.find(todo => todo.id === id);
        // const todo = await prisma.todo.findFirst({
        //     where: { id },
        // });
        // (todo)
        //     ? res.json({ todo })
        //     : res.status(404).json({ error: "TODO with " + id + " not found" });
        try {
            const todo = await this.todoRepository.findbyId(id)
            return res.json(todo)
        } catch (error) {
            res.status(400).json({error})
        }

    }

    public createTodo = async (req: Request, res: Response) => {

        const [error, createTodoDto] =  CreateTodoDto.create(req.body)
        if (error) return res.status(400).json({ error})

        // const todo = await prisma.todo.create({
        //     data: createTodoDto!
        // });

        // res.json(todo)

        const todo = await this.todoRepository.create(createTodoDto!)
        res.json(todo)
    }

    public updateTodo = async (req: Request, res: Response) => {

        let id = +req.params.id
        const [error,updateTodoDto] = UpdateTodoDto.create({...req.body, id}) //si viene id en body lo ignora 
        if (error) return res.status(400).json({error})
        // const todo = await prisma.todo.findFirst({
        //     where: { id },
        // });
        // if (!todo) {
        //     res.status(404).json({ error: "TODO with " + id + " not found" });
        // } else {
        //     const { text, completedAt } = req.body
        //     const updatedTodo = await prisma.todo.update({
        //         where: { id },
        //         data: updateTodoDto!.values
        //     })
        //     res.json(updatedTodo)

        // }

        const updatedTodo = await this.todoRepository.updateById(updateTodoDto!)
        return res.json(updatedTodo)

    }

    public deleteTodo = async (req: Request, res: Response) => {
        let id = +req.params.id
        // if (isNaN(id)) return res.status(400).json({ error: "ID is not a number" })
        // //const todo = todos.find(todo => todo.id === id);
        // const deleted = await prisma.todo.delete({
        //     where: {
        //         id
        //     }
        // })

        // if (!deleted) return res.status(400).json({ error: 'TODO not found with ID + ' + id })

        // res.json(deleted)
        const deletedTodo = await this.todoRepository.deleteById(id)
        res.json(deletedTodo)
    }

}