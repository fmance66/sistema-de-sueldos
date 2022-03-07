/* 
    Proyecto Final: Interprete de fórmulas tipo Excel
*/

import { Recibo } from '../models/recibo.js';

// const urlJson = '../../data/recibos.json';
const urlJson = '../../data/recibos.json';
const lsName = "lsRecibos";

class ReciboController {

  constructor() {

    // carga json de recibos
    let jsonData = localStorage.getItem(lsName);
    // console.log(jsonData);
    let recibos = [];

    // verifica si existe el json de recibos en local storage
    if ((jsonData === undefined) || (jsonData == null)) {   // si no existe lo carga del json externo

        console.log('... cargando local storage de .json externo...');

        $.get(urlJson, function(data, estado) {
            if (estado === "success") {
                // console.log(respuesta.recibos);
                // guarda el array de objetos 'Recibo' en localStorage
                localStorage.setItem(lsName, JSON.stringify(data));
                // guarda en el array
                recibos = data;
            }
        })
    } else {                                           // si existe lo parsea
        // console.log('cargando de local storage...', JSON.parse(jsonData));
        // guarda en el array
        recibos = JSON.parse(jsonData);
    };
    this.recibos = recibos.map(recibo => new Recibo(recibo));
  }

  // obtiene la lista de todos los recibos
  getAll() {
    return this.recibos;
  };

  // obtiene la lista de todos los recibos de una liquidacion
  getAll(idLiquidacion) {
    return this.recibos.filter(recibo => recibo.idLiquidacion == idLiquidacion);
  };
  
  getUltId() {
    return Math.max.apply(Math, this.recibos.map(recibo => recibo.id));
  };

  guardar() {
    localStorage.setItem(lsName, JSON.stringify(this.recibos));
  };

  agregar(recibo) {
    
    console.log('recibo antes: ', recibo);
    recibo.id = this.getUltId() + 1;
    console.log('this.getUltId(): ', this.getUltId());
    console.log('recibo despues: ', recibo);
    this.recibos.push(recibo);
    this.guardar();
  };

  eliminar(id) {
    console.log('elimina recibo con id: ', id, );
    this.recibos = this.recibos.filter(recibo => recibo.id !== id);
    this.guardar();
  };

  eliminarRecibosLiquidacion(idLiquidacion) {
    this.recibos = this.recibos.filter(recibo => recibo.idLiquidacion !== idLiquidacion);
    this.guardar();
  };

}

export { ReciboController };
