import { Request, Response } from "express"
import { prisma } from "../../data/postgres"
import { get } from 'env-var';
import { CreateTodoDto } from "../../domain/dtos";
import { UpdateTodoDto } from '../../domain/dtos/todos/update-todo.dto';
import { CreateTodo, DeleteTodo, GetTodo, GetTodos, TodoRepository, UpdateTodo } from "../../domain";
import { CustomError } from "../../domain/errors/custom.error";

interface Todos {
    id: number,
    text: string,
    completedAt: Date | null
}

export class TodosController {

    constructor(
        private readonly todoRepository: TodoRepository
    ) { }

    private handleErrorRespnse = (res: Response, error: unknown) => {

        if(error instanceof CustomError){
            return res.status(error.statusCode).json({error:error.message})
        }

        return res.status(500).json({error:"Internal Server Error | Check Logs"})

    }

    public getTodos = (req: Request, res: Response) => {
        new GetTodos(this.todoRepository)
            .execute()
            .then(todos => res.json(todos))
            .catch(error => res.status(400).json({error}));
    }

    public getTodosById = (req: Request, res: Response) => {
        const id = +req.params.id;
        new GetTodo(this.todoRepository)
            .execute(id)
            .then(todo=>res.json(todo))
            .catch(error=>this.handleErrorRespnse(res,error))
    }

    public createTodo = (req: Request, res: Response) => {

        const [error, createTodoDto] =  CreateTodoDto.create(req.body)
        if (error) return res.status(400).json({ error})

        new CreateTodo(this.todoRepository)
            .execute(createTodoDto!)
            .then(todo=>res.status(201).json(todo))
            .catch(error=>this.handleErrorRespnse(res,error))
    }

    public updateTodo = (req: Request, res: Response) => {

        let id = +req.params.id
        const [error,updateTodoDto] = UpdateTodoDto.create({...req.body, id}) //si viene id en body lo ignora 
        if (error) return res.status(400).json({error})

        new UpdateTodo(this.todoRepository)
            .execute(updateTodoDto!)
            .then(todo=>res.json(todo))
            .catch(error=>this.handleErrorRespnse(res,error))
    }

    public deleteTodo = (req: Request, res: Response) => {
        let id = +req.params.id
        new DeleteTodo(this.todoRepository)
            .execute(id)
            .then(todo=>res.json(todo))
            .catch(error=>this.handleErrorRespnse(res,error))
    }

}