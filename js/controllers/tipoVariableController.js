/* 
    Proyecto Final: Interprete de fórmulas tipo Excel
*/
 
import { TipoVariable } from '../models/tipoVariable.js';

const urlJson = '../../data/tipoVariables.json';
const lsName = "lsTipoVariables";
  

class TipoVariableController {

    constructor() {

        // carga json de tipos de variable
        let jsonData = localStorage.getItem(lsName);
        // console.log(jsonData);
        let tipoVariables = [];
    
        // verifica si existe el json de tipos de variable en local storage
        if ((jsonData === undefined) || (jsonData == null) ) {   // si no existe lo carga del json externo
    
            console.log('... cargando local storage de .json externo...');
    
            $.get(urlJson, function(data, estado) {
                if (estado === "success") {
                    // console.log(respuesta.tipoVariables);
                    // guarda el array de objetos 'TipoVariable' en localStorage
                    localStorage.setItem(lsName, JSON.stringify(data));
                    // guarda en el array
                    tipoVariables = data;
                }
            })
        } else {                                           // si existe lo parsea
            // console.log('cargando de local storage...', JSON.parse(jsonData));
            // guarda en el array
            tipoVariables = JSON.parse(jsonData);
        };
        this.tipoVariables = tipoVariables.map(tipoVariable => new TipoVariable(tipoVariable));
    };

    // obtiene un tipo de variable segun id
    get(id) {
        return this.tipoVariables.find(tipoVariable => tipoVariable.id == id);
    };

    // obtiene la lista de todos los tipos de variable
    getAll() {
        return this.tipoVariables;
    };
    
}

export { TipoVariableController };
