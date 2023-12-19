import { Request, Response } from "express"

interface Todos {
    id: number,
    text: string,
    completedAt: Date | null
}

let todos : Todos[]= [
    { id: 1, text: "Play", completedAt: new Date() },
    { id: 2, text: "Buy", completedAt: new Date() },
    { id: 3, text: "Eat", completedAt: new Date() },
]

export class TodosController {

    constructor(){}

    public getTodos = (req:Request, res:Response) => {
        return res.json(todos)
    }

    public getTodosById = (req:Request, res:Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({error:"ID is not a number"})
        const todo = todos.find(todo => todo.id === id);
        (todo)
            ? res.json({ todo })
            : res.status(404).json({ error: "TODO with " + id + " not found" });
    }

    public createTodo = (req:Request, res:Response) => {
        const {text = '',} = req.body

        if(!text) res.status(400).json({error:'Text property is required'})
        
        const newTodo = {
            id: todos.length + 1,
            text:text,
            completedAt: null
        }
        todos.push(newTodo)

        res.json(newTodo)
    }

    public updateTodo = (req: Request, res: Response) => {
        
        let id = +req.params.id
        if (isNaN(id)) return res.status(400).json({error:"ID is not a number"})
        const todo = todos.find(todo => todo.id === id);

        if (!todo) return res.status(404).json({ error: 'TODO not found with ID + ' + id })

        const {text, completedAt} = req.body

        todo.text = text || todo.text;

        (completedAt === null)
            ?  todo.completedAt = null
            :  todo.completedAt = new Date ( completedAt || todo.completedAt)
        res.json(todo)
    }

    public deleteTodo = (req:Request, res: Response) => {
        let id = +req.params.id
        if (isNaN(id)) return res.status(400).json({error:"ID is not a number"})
        const todo = todos.find(todo => todo.id === id);

        if (!todo) return res.status(404).json({ error: 'TODO not found with ID + ' + id })

        todos.splice(todos.indexOf(todo),1)
        res.json(todo)
    }

}