/* 
    Proyecto Final: Interprete de fórmulas tipo Excel
*/
  
// librerias
import { getBaseUrl } from '../utiles.js';

// models
import { Concepto } from '../models/concepto.js';

// const urlJson = '../../data/conceptos.json';
const urlJson = getBaseUrl() + '/data/conceptos.json';

const lsName = "lsConceptos";
  
class ConceptoController {

  constructor() {

    // carga json de conceptos
    let jsonData = localStorage.getItem(lsName);
    // console.log(jsonData);
    let conceptos = [];

    // verifica si existe el json de conceptos en local storage
    if (jsonData == null || jsonData === undefined) {   // si no existe lo carga del json externo

        console.log('... cargando local storage de .json externo...');

        $.get(urlJson, function(data, estado) {
            if (estado === "success") {
                // console.log(respuesta.conceptos);
                // guarda el array de objetos 'Concepto' en localStorage
                localStorage.setItem(lsName, JSON.stringify(data));
                // guarda en el array
                conceptos = data;
            }
        })
    } else {                                           // si existe lo parsea
        // guarda en el array
        conceptos = JSON.parse(jsonData);
    };
    this.conceptos = conceptos.map(concepto => new Concepto(concepto));
  }

  // obtiene una concepto segun id
  get(id) {
    return this.conceptos.find(concepto => concepto.id == id);
  };

  // obtiene la lista de todos los conceptos de liquidacions
  getAll() {
    return this.conceptos;
  };  

}
   
export { ConceptoController };
