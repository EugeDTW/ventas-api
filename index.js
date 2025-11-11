var express = require('express'); //Tipo de servidor: Express
var bodyParser = require('body-parser'); //Convierte los JSON
var cors = require('cors');
var app = express(); //Inicializo express
var port = process.env.PORT || 3000; //Ejecuto el servidor en el puerto 3000

// Convierte una petición recibida (POST-GET...) a objeto JSON
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());
let vector = [{
  id: "1",
  cliente: "Juana Pérez",
  vendedor: "Carlos López",
  instalador: "Pedro Ruiz",
  fechaMedicion: "2025-10-05",
  fechaAprobacionCliente: "2025-10-10",
  fechaPedidoFabrica: "2025-10-12",
  fechaAvisoInstalador: "2025-10-15",
  fechaEntregaCliente: "2025-10-25",
  fechaInstalacion: "2025-11-16",
  estado: "vendida",
  notas: "Cocina en L blanca"
},{
  id: "2",
  cliente: "Jaume Solis",
  vendedor: "Pepe Sanches",
  instalador: "Pablo Ruiz",
  fechaMedicion: "2025-10-05",
  fechaAprobacionCliente: "2025-10-10",
  fechaPedidoFabrica: "2025-10-12",
  fechaAvisoInstalador: "2025-10-15",
  fechaEntregaCliente: "2025-10-25",
  fechaInstalacion: "2025-11-10",
  estado: "pendiente",
  notas: "Cocina simple negra"
}] 

app.get('/api/ventas/:id', function(req, res){
    const { id } = req.params
    let pos = vector.findIndex((vta) => vta.id==id); 
    if(pos != -1){
        res.status(200).send(vector[pos]);
    }else{
        res.status(404).send("Venta no encontrada")
    }
    
});

app.get("/api/ventas", function(req, res){ 

    res.status(200).send(vector)

}); 


app.get("/api/proximas-instalaciones/:dias?", function(req, res){ 

    var dias = req.params.dias //defino constante dias que va a tomar el valor de lo que le paso por la url.
    if(dias === undefined){
        dias=7
    }
    const nuevoVector = vector.filter(x=>(calculaPlazo(x)<dias)); //metodo filter de array donde lo que cumple con condicion, lo manda a nuevo vector
    res.status(200).send(nuevoVector)    
    
}); 

app.get("/api/instalaciones-atrasadas", function(req,res){

    const nuevoVector = vector.filter(x=>(calculaPlazo(x)<0 && x.estado!='instalada'))
    res.status(200).send(nuevoVector)

})


function calculaPlazo(x) { //x es cada elemento del vector que evalua filter
   const d = Date.parse(x.fechaInstalacion) //Lo convierte a un obj tipo fecha porque es string. para eso se usa parse. 

   dif  =  (d - new Date()) / (1000 * 60 * 60 * 24)  //la diferencia te la da en miliseg por eso lo convertimos a dias. 
  
  return dif 
};

//< dias //si es falso, filter lo descarta. si es true filter lo agrega a nuevo vector

app.post("/api/ventas", function(req,res){
    vector.push(req.body)
    res.status(201).send("Venta creada")
});

app.put("/api/ventas", function(req,res){
    let pos= vector.findIndex((vta) => vta.id==req.body.id)
    if(pos!= -1){ // si existe lo borro
        vector.splice(pos,1)
        vector.push(req.body)
        res.status(200).send(req.body)} //muestro lo que le mande para modificar
    else{
        res.status(404).send("No se encontro el dato")
    }
})

app.delete("/api/ventas/:id", function(req,res){
    const { id } = req.params //forma de obtener parametros por la url
    let pos = vector.findIndex((vta) => vta.id==id); 
    if(pos != -1){
        vector.splice(pos,1)
        res.status(204).end();
    }else{
        res.status(404).send("Venta no encontrada")
    }
})

//Pongo el servidor a escuchar
app.listen(port, function(){
    console.log(`Server running in http://localhost:${port}`);
});


/**
 * req = request. en este objeto voy a tener todo lo que reciba del cliente
 * res = response. Voy a responderle al cliente
 
app.get('/saludo', function(req,res){
    console.log(req.query) //Los pedidos get reciben los datos del req.query
    res.send(`Hola ${req.query.nombre}, que tal?`)
})

app.post('/nombreDelPedido', function(req,res) {
    console.log(req.body) //Los pedidos post reciben los datos del req.body
    res.send("ok")
})*/
