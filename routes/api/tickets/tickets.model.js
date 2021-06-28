const MongoDB = require('../../utilities/db');
const { ObjectId } = require('mongodb').ObjectID;

let db;
let coleccion;

(async function(){
    try {
      if (!coleccion){
        db = await MongoDB.getDB();
        coleccion = db.collection("helpDesk");
        if(process.env.ENSURE_INDEX == 1){

        }
      }
    }
    catch(ex) {
      console.log(ex);
      process.exit(1);
    }
})();

module.exports.nuevoTicket = async (fecha, tipo, observacion, servicio, identidad, nombre, correo)=>{
    try {

        let ticket = {
            fecha: fecha,
            tipo: tipo,
            observacion: observacion,
            servicioAfectado: servicio,

            usuario: {
                identidad: identidad,
                nombre: nombre,
                correo: correo
            },

            holder: {
                identidad: "",
                nombre: "",
                correo: "",
            },

            estado: "ACTIVO",

            notas:[],
            fechaCierre: "",

            usuarioCierre: {
                identidad: "",
                nombre: "",
                correo: ""
            }, 

            tipoCierre: "",

            evaluacion: {
                eficiencia: "",
                satisfaccion: "",
                conformidad: ""
            }
        }

        let result = await coleccion.insertOne(ticket);
        return result.ops;
    }
    catch(ex) {
        console.log(ex);
        throw(ex);
    }
}

module.exports.agregarNotaTicket = async (id, fecha, observacion, accion, identidad, nombre, correo) =>{
    try{
        const _id = new ObjectId(id);
        const filter = {"_id": _id};
        const updatePropiedades = {
            "$push": {   
                "notas": {
                    fecha: fecha,
                    observacion: observacion,
                    accion: accion,
                    usuario: {
                      identidad: identidad,
                      nombre: nombre,
                      correo: correo
                    }
                }
            }
        };

        let result = await coleccion.updateOne(filter, updatePropiedades);
        return result;
    } 
    catch(ex) {
        console.log(ex);
        throw(ex);
    }
}

module.exports.cerrarTicket = async (id, fecha, identidad, nombre, correo, tipoCierre) => {
    try {
        const _id = new ObjectId(id);
        const filter = { "_id": _id };
        const updatePropiedades = {
            "$set": {   
                "estado":"CERRADO",
                "fechaCierre":fecha,
                "usuarioCierre":{
                    identidad: identidad,
                    nombre: nombre,
                    correo: correo
                },
                "tipoCierre": tipoCierre
            }
        };
        let result = await coleccion.updateOne(filter, updatePropiedades);
        return result;
    } 
    catch (ex) {
        console.log(ex);
        throw (ex);
    }
}

module.exports.evaluarTicket = async (id, eficiencia, satisfaccion, conformidad) => {
    try {
        const _id = new ObjectId(id);
        const filter = { "_id": _id };
        const updatePropiedades = {
            "$set": {   
                "estado":"EVALUADO",
                "evaluacion": {
                    eficiencia: eficiencia,
                    satisfaccion: satisfaccion,
                    conformidad: conformidad
                } 
            }
        };

        let result = await coleccion.updateOne(filter, updatePropiedades);
        return result;
    } 
    catch (ex) {
        console.log(ex);
        throw (ex);
    }
}

module.exports.capturarTicket = async (id, identidad, nombre, correo) => {
    try {
        const _id = new ObjectId(id);
        const filter = { "_id": _id };
        const updatePropiedades = {
            "$set": {   
                "holder": {
                    identidad: identidad,
                    nombre: nombre, 
                    correo: correo
                } 
            }
        };

        let result = await coleccion.updateOne(filter, updatePropiedades);
        return result;
    } 
    catch (ex) {
        console.log(ex);
        throw (ex);
    }
}

module.exports.ticketsPorUsuario= async (usuario, estado, pagina) => {

    const items = 25;

    try {
        let options = {
            skip: (pagina - 1) * items,
            limit: items,
            sort:[["fecha", -1]]
        };

        const filter =  {estado: estado, "usuario.identidad": usuario};    
        
        let docsCursor = coleccion.find(filter, options);
        let rownum = await docsCursor.count();
        let rows = await docsCursor.toArray()
        return {rownum, rows, pagina};  
    } 
    catch (ex) {
      console.log(ex);
      throw (ex);
    }
}

module.exports.ticketsPorHolder= async (usuario, estado, pagina) => {

    const items = 25;

    try {
        let options = {
            skip: (pagina - 1) * items,
            limit: items,
            sort:[["fecha", -1]]
        };

        const filter =  {estado: estado, "holder.identidad": usuario};    
        
        let docsCursor = coleccion.find(filter, options);
        let rownum = await docsCursor.count();
        let rows = await docsCursor.toArray()
        return {rownum, rows, pagina};  
    } 
    catch (ex) {
        console.log(ex);
        throw (ex);
    }
}

module.exports.todosLosTickets = async (estado, pagina) => {

    const items = 25;

    try {
        let options = {
            skip: (pagina - 1) * items,
            limit: items
        };

        const filter =  {estado: estado};    
        
        let docsCursor = coleccion.find(filter, options);
        let rownum = await docsCursor.count();
        let rows = await docsCursor.toArray()
        return {rownum, rows, pagina};  
    } 
    catch (ex) {
      console.log(ex);
      throw (ex);
    }
}

module.exports.ticketsOrdenadosPorFecha = async (estado, pagina) => {

    const items = 25;

    try {
        let options = {
            skip: (pagina - 1) * items,
            limit: items,
            sort:[["fecha", -1]]
        };

        const filter =  {estado: estado};    
        
        let docsCursor = coleccion.find(filter, options);
        let rownum = await docsCursor.count();
        let rows = await docsCursor.toArray()
        return {rownum, rows, pagina};  
    } 
    catch (ex) {
      console.log(ex);
      throw (ex);
    }
}

module.exports.ticketPorId = async (id)=>{
    try {
        const _id = new ObjectId(id);
        const filter =  {_id: _id};
        let row = await coleccion.findOne(filter);
        return row;
    } 
    catch(ex) {
        console.log(ex);
        throw(ex);
    }
}
