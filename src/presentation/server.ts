
import express, { Router } from 'express'
import path from 'path'
import { stringify } from 'querystring';

interface Options {
    port: number,
    routes: Router,
    public_path: string,
}

export class Server {

    private app = express()
    private readonly port: number;
    private readonly publicPath: string;
    private readonly routes: Router;
    constructor(options: Options){
        const {port, routes, public_path} = options
        this.port = port 
        this.publicPath = public_path
        this.routes = routes
    }
    async start() {

        //MIDDLEWARES
        this.app.use(express.json()) // raw
        this.app.use(express.urlencoded({extended:true})) //x-www-url-encoded

        //PUBLIC FOLDER
        this.app.use(express.static(this.publicPath))

        //ROUTES
        this.app.use(this.routes)

        //SPA *
        this.app.get('*', (req,res)=>{
            const indexPath = path.join(__dirname + `../../../${this.publicPath}/index.html`)
            res.sendFile(indexPath)
        })

        this.app.listen(this.port, () => {
            console.log("Server running on port: " + this.port)

        })
    }

}