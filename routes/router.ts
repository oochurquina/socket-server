import {Router,Request,Response} from 'express';
import Server from '../classes/server';
import {usuariosConectados } from '../sockets/socket';

const router = Router();
router.get('/mensajes',(req: Request, res: Response)=>{
    res.json({
        ok: true,
        msj: 'Mensaje GET'
    });
});
router.post('/mensajes',(req: Request, res: Response)=>{
    const {cuerpo,de} = req.body;
    const server = Server.instance;
    const payload= {de,cuerpo};
    server.io.emit('mensaje-nuevo',payload)
    res.json({
        ok: true,
        msj: 'Mensaje POST',
        de,
        cuerpo,
    });
});


router.post('/mensajes/:id',(req: Request, res: Response)=>{
    const {cuerpo,de} = req.body;
    const {id} = req.params;
    const payload = {
        de,
        cuerpo
    };
    const server = Server.instance;
    server.io.in(id).emit('mensaje-privado', payload);
    res.json({
        ok: true,
        msj: 'Mensaje POST',
        cuerpo,
        de,
        id
    });
});

router.get('/usuarios',(req: Request, res: Response)=>{
    const server = Server.instance; //obtener la instancia del server
    server.io.clients((err:any, clientes: string[])=>{
        if (err){
            return res.json({ok: false,err}):
        }
        res.json({ok: true,clientes});
    });
});
// obtener usuarios id y sus nombres
router.get('/usuarios/detalle',(req:Request,res: Response)=>{
    res.json({
        ok : true,
        clientes: usuariosConectados.getLista();
    });
});

export default router;