
import express, { Router } from 'express'
import path from 'path'
import { stringify } from 'querystring';
import compression from 'compression'
interface Options {
    port: number,
    routes: Router,
    public_path: string,
}

export class Server {

    public app = express()
    private readonly port: number;
    private readonly publicPath: string;
    private readonly routes: Router;
    private serverListener?:any;
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
        this.app.use(compression())
        //PUBLIC FOLDER
        this.app.use(express.static(this.publicPath))

        //ROUTES
        this.app.use(this.routes)

        //SPA *
        this.app.get('*', (req,res)=>{
            const indexPath = path.join(__dirname + `../../../${this.publicPath}/index.html`)
            res.sendFile(indexPath)
        })

        this.serverListener = this.app.listen(this.port, () => {
            console.log("Server running on port: " + this.port)

        })

    }
    public close() {
        this.serverListener?.close()
    }
}