/* 
    Proyecto Final: Interprete de fórmulas tipo Excel
*/
 
// librerias
import { getBaseUrl } from '../utiles.js';

// models
import { TipoConcepto } from '../models/tipoConcepto.js';

// const urlJson = '../../data/tipoConceptos.json';
const urlJson = getBaseUrl() + '/data/tipoConceptos.json';

const lsName = "lsTipoConceptos";
  

class TipoConceptoController {

    constructor() {

        // carga json de tipos de concepto
        let jsonData = localStorage.getItem(lsName);
        // console.log(jsonData);
        let tipoConceptos = [];
    
        // verifica si existe el json de tipos de concepto en local storage
        if ((jsonData === undefined) || (jsonData == null) ) {   // si no existe lo carga del json externo
    
            console.log('... cargando local storage de .json externo...');
    
            $.get(urlJson, function(data, estado) {
                if (estado === "success") {
                    // console.log(respuesta.tipoConceptos);
                    // guarda el array de objetos 'TipoConcepto' en localStorage
                    localStorage.setItem(lsName, JSON.stringify(data));
                    // guarda en el array
                    tipoConceptos = data;
                }
            })
        } else {                                           // si existe lo parsea
            // console.log('cargando de local storage...', JSON.parse(jsonData));
            // guarda en el array
            tipoConceptos = JSON.parse(jsonData);
        };
        this.tipoConceptos = tipoConceptos.map(tipoConcepto => new TipoConcepto(tipoConcepto));
    };

    // obtiene un tipo de concepto segun id
    get(id) {
        return this.tipoConceptos.find(tipoConcepto => tipoConcepto.id == id);
    };

    // obtiene la lista de todos los tipos de concepto
    getAll() {
        return this.tipoConceptos;
    };
    
}

export { TipoConceptoController };
