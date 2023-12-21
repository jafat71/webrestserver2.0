import { TodoEntity } from "../entities/todo.entity";
import { CreateTodoDto } from '../dtos/todos/create-todo.dto';
import { UpdateTodoDto } from '../dtos/todos/update-todo.dto';


export abstract class TodoDatasource {

    abstract create(createTodoDto: CreateTodoDto): Promise<TodoEntity>
    abstract getAll():Promise<TodoEntity[]>
    abstract findbyId(id:number): Promise<TodoEntity>;
    abstract updateById(updateTodoDto: UpdateTodoDto): Promise<TodoEntity>
    abstract deleteById(id:number): Promise<TodoEntity>    

}