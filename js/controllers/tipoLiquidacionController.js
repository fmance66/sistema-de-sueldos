/* 
    Proyecto Final: Interprete de fórmulas tipo Excel
*/

// librerias
import { getBaseUrl } from '../utiles.js';

// models
import { TipoLiquidacion } from '../models/tipoLiquidacion.js';

// const urlJsonTipoLiquidaciones = '../../data/tipoLiquidaciones.json';
const urlJson = getBaseUrl() + '/data/tipoLiquidaciones.json';
const lsTipoLiquidaciones = "lsTipoLiquidaciones";


class TipoLiquidacionController {

  constructor () {

    // carga json de tipos de liquidacion
      let jsonData = localStorage.getItem(lsTipoLiquidaciones);
      let tipoLiquidaciones = [];
      // console.log(jsonData);

      // verifica si existe el json de tipos de liquidación en local storage
      if (jsonData == null || jsonData === undefined) {   // si no existe lo carga del json externo
          console.log('... cargando local storage de .json externo...');
          $.get(urlJsonTipoLiquidaciones, function(data, estado) {
              if (estado === "success") {
                  localStorage.setItem(lsTipoLiquidaciones, JSON.stringify(data));
                  tipoLiquidaciones = data;
              }
          })
      } else {                                           // si existe lo parsea
          tipoLiquidaciones = JSON.parse(jsonData);
      };
      this.tipoLiquidaciones = tipoLiquidaciones.map(tipoLiquidacion => new TipoLiquidacion(tipoLiquidacion));
  };

  // obtiene el tipo de liquidacion segun id
  get(id) {
    return this.tipoLiquidaciones.find(tipoLiquidacion => tipoLiquidacion.id == id);
  };

  // obtiene la lista de todas los tipos de liquidaciones
  getAll() {
    return this.tipoLiquidaciones;
  };
  
  getUltId() {
    // console.log('tipoLiquidacion.getUltId', this.tipoLiquidaciones);
    let ultId = Math.max.apply(Math, this.tipoLiquidaciones.map(tipoLiquidacion => tipoLiquidacion.id));
    // let ultId = this.tipoLiquidaciones.length;
    // console.log(ultId);
    return(ultId);
  };

} 

export { TipoLiquidacionController };
