import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser'
import Server from './classes/server';
import pacienteRoutes from './routes/paciente.routes';




const server = new Server();

server.app.use(cors());

// Body parser
server.app.use( bodyParser.urlencoded({extended: true}) );
server.app.use( bodyParser.json() );


//rutas
server.app.use('/pacientes', pacienteRoutes)


// connect to db
mongoose.connect('mongodb://35.202.133.187:27017/proyecto',{useNewUrlParser: true, useCreateIndex: true}, (err => {
    if ( err ) throw err;
    console.log('database proyecto online');
}))

server.start(()=> {
    console.log(`Servicdor corriendo en puerto ${server.port}`);
});