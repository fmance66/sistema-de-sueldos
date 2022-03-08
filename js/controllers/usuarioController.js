/* 
    Proyecto Final: Interprete de fórmulas tipo Excel
*/

// librerias
import { getBaseUrl } from '/js/utiles.js';

// controladores
import { Usuario } from '../models/usuario.js';

// const urlJson = '../../data/usuarios.json';
const urlJson = getBaseUrl() + '/data/usuarios.json';

const lsName = "lsUsuarios";
const ssName = "ssUser";
  
class UsuarioController {

  constructor() {

    // carga json de usuarios
    let jsonData = localStorage.getItem(lsName);
    // console.log(jsonData);
    let usuarios = [];

    // verifica si existe el json de usuarios en local storage
    if (jsonData == null || jsonData === undefined) {   // si no existe lo carga del json externo

        console.log('... cargando local storage de .json externo...');

        $.get(urlJson, function(data, estado) {
            if (estado === "success") {
                // console.log(respuesta.usuarios);
                // guarda el array de objetos 'Usuario' en localStorage
                localStorage.setItem(lsName, JSON.stringify(data));
                // guarda en el array
                usuarios = data;
            }
        })
    } else {                                           // si existe lo parsea
        // console.log('cargando de local storage...', JSON.parse(jsonData));
        // guarda en el array
        usuarios = JSON.parse(jsonData);
    };
    this.usuarios = usuarios.map(usuario => new Usuario(usuario));
  };

  // obtiene un usuario según el id informado
  get(id) {
    return this.usuarios.find(usuario => usuario.id == id);
  };

  // obtiene la lista de todos los usuarios
  getAll() {
    return this.usuarios;
  };

  // obtiene el usuario logoneado
  getUserLogon() {
    let idUserLogon = sessionStorage.getItem(ssName);
    return this.get(idUserLogon);
  };

  // setea el usario logoneado
  setUserLogon(id) {
    sessionStorage.setItem(ssName, id);
  };
}      

export { UsuarioController };
