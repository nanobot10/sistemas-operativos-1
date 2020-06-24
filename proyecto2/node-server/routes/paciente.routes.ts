import { Router, Response, Request } from "express";
import { Paciente } from '../models/paciente.model';

const pacienteRoutes = Router();


pacienteRoutes.get('/', async (req: any, res: Response) => {
    
    const pacientes = await Paciente.find();
    res.json({
        success: true,
        pacientes
    })

});

pacienteRoutes.get('/top-3', async (req: any, res: Response) => {
    
    const pacientes = await Paciente.aggregate([
        {
            $group : {
                _id: "$departamento",
                total: { $sum: 1 }
            }
        }
    ]).sort({total: -1}).limit(3);
    res.json({
        success: true,
        pacientes
    })

});

export default pacienteRoutes;