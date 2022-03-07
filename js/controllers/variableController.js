/* 
    Proyecto Final: Interprete de fórmulas tipo Excel
*/
 
import { Variable } from '../models/variable.js';

const urlJson = '../../data/variables.json';
const lsName = "lsVariables";


class VariableController {

  constructor () {

    // carga json de variables
    let jsonData = localStorage.getItem(lsName);
    // console.log(jsonData);
    let variables = [];

    // console.log(jsonData);

    // verifica si existe el json de variables en local storage
    if ((jsonData === undefined) || (jsonData == null)) {   // si no existe lo carga del json externo

        console.log('... cargando local storage de .json externo...');

        $.get(urlJson, function(data, estado) {
            if (estado === "success") {
                // console.log(respuesta.variables);
                // guarda el array de objetos 'Variable' en localStorage
                localStorage.setItem(lsName, JSON.stringify(data));
                // guarda en el array
                variables = data;
            }
        })
    } else {                                           // si existe lo parsea
        // console.log('cargando de local storage...', JSON.parse(jsonData));
        // guarda en el array
        variables = JSON.parse(jsonData);
    };
    this.variables = variables.map(variable => new Variable(variable));
  };

  // obtiene una variable por su nombre
  get(nombre) {
    return this.variables.find(variable => variable.nombre == nombre);
  };

  // obtiene la lista de todos las variables
  getAll() {
    return this.variables;
  };

  // obtiene la lista de todas las variables internas (idTipoVariable = 6)
  getVariablesInternas = () => {
    return this.variables.filter(variable => variable.idTipoVariable == 6);
  };
  
  getUltId() {
    // console.log('getUltIdVariable', this.variables);
    let ultId = Math.max.apply(Math, this.variables.map(variable => variable.id));
    // let ultId = this.variables.length;
    // console.log(ultId);
    return(ultId);
  };

  guardar() {
    localStorage.setItem(lsName, JSON.stringify(this.variables));
  };

  agregar(variable) {
    // console.log('agregarVariable (antes)', this.variables);
    this.variables.push(variable);
    // console.log('agregarVariable (despues)', this.variables);
    this.guardar();
  };

  actualizar(variable) {
    // console.log('actualizarVariable (antes)', this.variables);
    let obj = this.variables.find((elemento, index) => {
        if (elemento.id == variable.id) {
          this.variables[index] = variable;
            // console.log('encontre --> ', variable);
            return true;        // para de buscar
        }
    });
    // console.log('actualizarVariable (despues)', this.variables);
    this.guardar();
  };

  // devuelve el array variables ordenado por 'nombre'
  ordenar() {
    let array = this.variables;

    array.sort(function(a, b) {
        if (a.nombre > b.nombre) {
            return 1;
        } else if (a.nombre < b.nombre) {
            return -1;
        } else {
            return 0;
        }
    });

    return array;
  }

}  

export { VariableController };
