/* 
    Proyecto Final: Interprete de fórmulas tipo Excel
*/

import { Categoria } from '../models/categoria.js';

const urlJson = '../../data/categorias.json';
const lsName = "lsCategorias";
 

class CategoriaController {

  constructor() {

    // carga json de categorias de categorias
    let jsonData = localStorage.getItem(lsName);
    // console.log(jsonData);
    let categorias = [];

    // verifica si existe el json de categorias en local storage
    if (jsonData == null || jsonData === undefined) {   // si no existe lo carga del json externo

        console.log('... cargando local storage de .json externo...');

        $.get(urlJson, function(data, estado) {
            if (estado === "success") {
                // console.log(respuesta.categorias);
                // guarda el array de objetos 'Categoria' en localStorage
                localStorage.setItem(lsName, JSON.stringify(data));
                // guarda en el array
                categorias = data;
            }
        })
    } else {                                           // si existe lo parsea
        // guarda en el array
        categorias = JSON.parse(jsonData);
    };
    this.categorias = categorias.map(categoria => new Categoria(categoria));
  }

  // obtiene una categoria segun id
  get(id) {
    return this.categorias.find(categoria => categoria.id == id);
  };

  // obtiene la lista de todas las categorias de empleados
  getAll() {
    return this.categorias;
  };  

}
   
export { CategoriaController };
