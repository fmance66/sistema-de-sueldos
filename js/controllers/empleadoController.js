/* 
    Proyecto Final: Interprete de fórmulas tipo Excel
*/

// librerias
import { getBaseUrl } from '../utiles.js';

// models
import { Empleado } from '../models/empleado.js';
// import { Categoria } from '../models/categoria.js';

// controladores
import { CategoriaController } from './categoriaController.js';
import { VariableController } from './variableController.js';

// const urlJson = '../../data/empleados.json';
const urlJson = getBaseUrl() + '/data/empleados.json';

const lsName = "lsEmpleados";
  
class EmpleadoController {

  constructor() {

    // carga json de empleados
    let jsonData = localStorage.getItem(lsName);
    // console.log(jsonData);
    let empleados = [];

    // verifica si existe el json de empleados en local storage
    if (jsonData == null || jsonData === undefined) {   // si no existe lo carga del json externo

        console.log('... cargando local storage de .json externo...');

        $.get(urlJson, function(data, estado) {
            if (estado === "success") {
                // console.log(respuesta.empleados);
                // guarda el array de objetos 'Empleado' en localStorage
                localStorage.setItem(lsName, JSON.stringify(data));
                // guarda en el array
                empleados = data;
            }
        })
    } else {                                           // si existe lo parsea
        // console.log('cargando de local storage...', JSON.parse(jsonData));
        // guarda en el array
        empleados = JSON.parse(jsonData);
    };
    this.empleados = empleados.map(empleado => new Empleado(empleado));
  };


  // obtiene un empleado según el legajo informado
  get(legajo) {
    return this.empleados.find(empleado => empleado.legajo == legajo);
  };

  // obtiene la lista de todos los empleados
  getAll() {
    return this.empleados;
  };

  cargarVariablesEmpleado(legajo) {

    // obtiene los datos del empleado para asignar a las variables internas
    let empleado = this.get(legajo);
    console.log('empleado: ', empleado);
      
    // obtiene el sueldo bruto del empleado de la categoría
    const categorias = new CategoriaController();
    let categoria = categorias.get(empleado.idCategoria);
    console.log('categoria: ', categoria);

    // obtine todas las variables de tipo internas (idTipoVariable = 6)
    const variables = new VariableController();
    let variablesInternas = variables.getVariablesInternas();
    console.log('variablesInternas: ', variablesInternas);
    
    // recorre las variables internas para asignar los datos del empleado
    variablesInternas.forEach(function(variable) {
        console.log('variable: ', variable);

        switch (variable.nombre) {
            case '#SUELDO_BRUTO':
                variable.valor = categoria.sueldoBruto;
                break;
            case '#FECHA_INGRESO':
                variable.valor = variable.id, empleado.fechaIngreso;
                break;
            case '#NOMBRE_OBRA_SOCIAL':
                variable.valor = variable.id, empleado.obraSocial;
                break;
            default: 
                null;     // ver que hacer!!!
                break;
        }

        // actualiza la variable en el array global y json
        variables.actualizar(variable);
    });
  };  
}      

export { EmpleadoController };
