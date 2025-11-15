var express = require("express"); //Tipo de servidor: Express
var bodyParser = require("body-parser"); //Convierte los JSON
var cors = require("cors");
var app = express(); //Inicializo express
var port = process.env.PORT || 3000; //Ejecuto el servidor en el puerto 3000

// Convierte una petición recibida (POST-GET...) a objeto JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
let vector = [
  {
    id: "1",
    cliente: "Juana Pérez",
    vendedor: "Carlos López",
    instalador: "Pedro Ruiz",
    fechaMedicion: "2025-10-05",
    fechaAprobacionCliente: "2025-10-10",
    fechaPedidoFabrica: "2025-08-12",
    fechaAvisoInstalador: "2025-10-15",
    fechaEntregaCliente: "2025-10-05",
    fechaInstalacion: "2025-11-10",
    estado: "instalada",
    notas: "Cocina en L blanca",
  },
  {
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
    notas: "Cocina simple negra",
  },
  {
    id: "3",
    cliente: "Maria Sanchez",
    vendedor: "Pepe Sanches",
    instalador: "Pablo Ruiz",
    fechaMedicion: "2025-10-05",
    fechaAprobacionCliente: "2025-10-10",
    fechaPedidoFabrica: "2025-10-12",
    fechaAvisoInstalador: "2025-10-15",
    fechaEntregaCliente: "2025-10-25",
    fechaInstalacion: "2025-11-18",
    estado: "pendiente",
    notas: "Cocina azul",
  },
];

app.get("/api/ventas/proximas-instalaciones/:dias?", function (req, res) {
  var dias = req.params.dias; //defino constante dias que va a tomar el valor de lo que le paso por la url.
  if (dias === undefined) {
    dias = 7;
  }
  // filter por (calculaPlazo() < dias) //si es falso, filter lo descarta. si es true filter lo agrega a nuevo vector
  const nuevoVector = vector.filter(
    (x) =>
      calculaPlazo(x) < dias && calculaPlazo(x) > 0 && x.estado == "pendiente"
  ); //metodo filter de array donde lo que cumple con condicion, lo manda a nuevo vector
  res.status(200).send(nuevoVector);
});

app.get("/api/ventas/instalaciones-atrasadas", function (req, res) {
  const nuevoVector = vector.filter(
    (x) => calculaPlazo(x) < 0 && x.estado != "instalada"
  );
  res.status(200).send(nuevoVector);
});

app.get("/api/ventas/:id", function (req, res) {
  const { id } = req.params;
  let pos = vector.findIndex((vta) => vta.id == id);
  if (pos != -1) {
    res.status(200).send(vector[pos]);
  } else {
    res.status(404).send({ mensaje: "venta no encontrada" });
  }
});

app.get("/api/ventas", function (req, res) {
  res.status(200).send(vector);
});

// devuelve cantidad de días entre fecha actual y x.fechaInstalacion
function calculaPlazo(x) {
  //x es cada elemento del vector que evalua filter
  const d = Date.parse(x.fechaInstalacion); //Lo convierte a un obj tipo fecha porque es string. para eso se usa parse.

  dif = (d - new Date()) / (1000 * 60 * 60 * 24); //la diferencia te la da en miliseg por eso lo convertimos a dias.

  return dif;
}

app.post("/api/ventas", function (req, res) {
  // encuentro el mayor id...
  let idmax = vector.reduce(
    (ant, act) => (ant && ant.id > act.id ? ant.id : act.id),
    1
  );
  // ... y le sumo 1 (genero el id para la nueva entidad)
  idNuevo = parseInt(idmax) + 1;

  // agrego el nuevo id a los datos
  req.body.id = idNuevo;

  vector.push(req.body);
  res.status(201).send({ mensaje: "venta creada" });
});

app.put("/api/ventas/:id", function (req, res) {
  const { id } = req.params;
  let pos = vector.findIndex((vta) => vta.id == id); //req.body.id);

  if (pos != -1) {
    // si existe lo borro...
    vector.splice(pos, 1);
    // ...y agrego el modificado
    vector.push(req.body);
    // y devuelvo lo que le mande para modificar
    res.status(200).send(req.body);
  } else {
    res.status(404).send({ mensaje: "venta no encontrada" });
  }
});

app.delete("/api/ventas/:id", function (req, res) {
  const { id } = req.params; //forma de obtener parametros por la url
  let pos = vector.findIndex((vta) => vta.id == id);
  if (pos != -1) {
    vector.splice(pos, 1);
    res.status(200).send({ mensaje: "venta borrada" });
  } else {
    res.status(404).send({ mensaje: "venta no encontrada" });
  }
});

//Pongo el servidor a escuchar
app.listen(port, function () {
  console.log(`Server running in http://localhost:${port}`);
});
