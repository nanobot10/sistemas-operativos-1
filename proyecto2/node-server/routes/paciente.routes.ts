import { Router, Response, Request } from "express";
import redis from "redis"
import { Paciente } from '../models/paciente.model';



const pacienteRoutes = Router();


pacienteRoutes.get('/', async (req: any, res: Response) => {
    
    const pacientes = await Paciente.find().limit(10);
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

pacienteRoutes.get('/last', (req: any, res: Response) => {
    
    const redisClient = redis.createClient({
        host: '35.202.133.187',
        port: 6379,
        db: '15'
    });

    console.log('connect to redis database');

    redisClient.lrange('casoscovid',0,-1, (err, data: any[]) => {

        if(err) {
            res.json({
                success: false,
                data
            });
        } else {
            
            
            res.json({
                success: true,
                paciente: JSON.parse(data[0])
            });
        }

    });

});

pacienteRoutes.get('/last', (req: any, res: Response) => {
    
    const redisClient = redis.createClient({
        host: '35.202.133.187',
        port: 6379,
        db: '15'
    });

    console.log('connect to redis database');

    redisClient.lrange('casoscovid',0,1, (err, data: any[]) => {

        if(err) {
            res.json({
                success: false,
                data
            });
        } else {
            
            
            res.json({
                success: true,
                paciente: JSON.parse(data[0])
            });
        }

    });

});

pacienteRoutes.get('/ages', (req: any, res: Response) => {
    
    const redisClient = redis.createClient({
        host: '35.202.133.187',
        port: 6379,
        db: '15'
    });

    console.log('connect to redis database');

    redisClient.lrange('casoscovid',0,-1, (err, data: any[]) => {

        if(err) {
            res.json({
                success: false,
                data
            });
        } else {
            const pacientes = data.map( item => { return JSON.parse(item)});
            let ages = new Map<number, number>();
            pacientes.forEach( (item: any) => {
                const edad = item.edad;
                if( edad >= 0 && edad <= 10 ) {
                    ages.set(0, ages.has(0) ? Number(ages.get(0)) + 1 : 1);
                } else if ( edad > 10 && edad <= 20 ) {
                    ages.set(10, ages.has(10) ? Number(ages.get(10)) + 1 : 1);
                } else if ( edad > 20 && edad <= 30 ) {
                    ages.set(20, ages.has(20) ? Number(ages.get(20)) + 1 : 1);
                } else if ( edad > 30 && edad <= 40 ) {
                    ages.set(30, ages.has(30) ? Number(ages.get(30)) + 1 : 1);
                } else if ( edad > 40 && edad <= 50 ) {
                    ages.set(40, ages.has(40) ? Number(ages.get(40)) + 1 : 1);
                } else if ( edad > 50 && edad <= 60 ) {
                    ages.set(50, ages.has(50) ? Number(ages.get(50)) + 1 : 1);
                } else if ( edad > 60 && edad <= 70 ) {
                    ages.set(60, ages.has(60) ? Number(ages.get(60)) + 1 : 1);
                } else if ( edad > 70 && edad <= 80 ) { 
                    ages.set(70, ages.has(70) ? Number(ages.get(70)) + 1 : 1);
                } else if ( edad > 80 ) {
                    ages.set(80, ages.has(80) ? Number(ages.get(80)) + 1 : 1);
                }
            });

            // console.log(ages);

            let result: any[] = [];
            ages.forEach((value, key) => {
                result.push({
                    age: key + '-' + (key + 10) + ' años',
                    value
                });
            });

            // console.log(result);

            res.json({
                success: true,
                pacientes: result
            });
        }

    });

});


export default pacienteRoutes;