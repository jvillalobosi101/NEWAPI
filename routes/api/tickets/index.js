const express = require('express');
const router = express.Router();
const { nuevoTicket, agregarNotaTicket, cerrarTicket, evaluarTicket, capturarTicket, ticketPorId, todosLosTickets, ticketsOrdenadosPorFecha, ticketsPorUsuario, ticketsPorHolder } = require('./tickets.model');

router.post(
    "/nuevo",
    async (req, res)=>{
        try {
            let { fecha, tipo, observacion, servicio, identidad, nombre, correo } = req.body;
            let docInserted = await nuevoTicket(fecha, tipo, observacion, servicio, identidad, nombre, correo);
            res.status(200).json(docInserted);
        }
        catch(ex) {
            res.status(500).json({"msg":"Error"});
        }
    }
);

router.put(
    "/agregarnota/:id",
    async (req, res)=>{
        try {
            const {id} = req.params;
            const { fecha, observacion, accion, identidad, nombre, correo } = req.body;
            let result = await agregarNotaTicket(id, fecha, observacion, accion, identidad, nombre, correo);
            res.status(200).json(result);
        }
        catch(ex) {
            res.status(500).json({"msg":"Error"});
        }
    }
);

router.put(
    "/cerrar/:id",
    async (req, res)=>{
        try {
            const {id} = req.params;
            const { fecha, identidad, nombre, correo, tipoCierre } = req.body;
            let result = await cerrarTicket(id, identidad, nombre, correo, tipoCierre);
            res.status(200).json(result);
        }
        catch(ex) {
            res.status(500).json({ "msg": "Error" });
        }
    }
);
router.put(
    "/evaluar/:id",
    async (req, res)=>{
        try {
            const {id} = req.params;
            const { eficiencia, satisfaccion, conformidad } = req.body;
            let _eficiencia = parseInt(eficiencia);
            let _satisfaccion = parseInt(satisfaccion);
            let _conformidad = parseInt(conformidad);

            let result = await evaluarTicket(id, _eficiencia, _satisfaccion, _conformidad);
            res.status(200).json(result);
        }
        catch(ex) {
            res.status(500).json({"msg":"Error"});
        }
    }
);

router.put(
    "/capturarticket/:id",
    async (req, res)=>{
        try {
            const {id} = req.params;
            const { identidad, nombre, correo } = req.body;
            let result = await capturarTicket(id, identidad, nombre, correo);
            res.status(200).json(result);
        }
        catch(ex) {
            res.status(500).json({"msg":"Error"});
        }
    }
);

router.get(
    "/ticketsbyuser/:usuario/:estado/:page",
    async (req, res)=>{
        try {
            let {usuario, estado, page} = req.params;
            let rows = await ticketsPorUsuario(usuario, estado, page);
            res.status(200).json(rows);
        }
        catch(ex) {
            res.status(500).json({"msg":"Error"});
        }
    }
);

router.get(
    "/ticketsbyholder/:usuario/:estado/:page",
    async (req, res)=>{
        try {
            let {usuario, estado, page} = req.params;
            let rows = await ticketsPorHolder(usuario, estado, page);
            res.status(200).json(rows);
        }
        catch(ex) {
            res.status(500).json({"msg":"Error"});
        }
    }
);

router.get(
    "/:estado/:page",
    async (req, res)=>{
        try {
            let {estado, page} = req.params;
            let rows = await todosLosTickets(estado, page);
            res.status(200).json(rows);
        }
        catch(ex) {
            res.status(500).json({"msg":"Error"});
        }
    }
);

router.get(
    "/ticketsage/:estado/:page",
    async (req, res)=>{
        try {
            let {estado, page} = req.params;
            let rows = await ticketsOrdenadosPorFecha(estado, page);
            res.status(200).json(rows);
        }
        catch(ex) {
            res.status(500).json({"msg":"Error"});
        }
    }
);

router.get(
    "/ticketbyid/:id",
    async (req, res)=>{
        try {
            let {id} = req.params;
            let row = await getById(id);
            res.status(200).json(row);
        }
        catch(ex) {
            res.status(500).json({ "msg": "Error" });
        }
    }
);
module.exports = router;
