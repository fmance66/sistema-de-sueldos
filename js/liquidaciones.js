/* Proyecto Final: Interprete de fórmulas tipo Excel

*/

// librerias
import { getBaseUrl } from './utiles.js';
import { armarTablaHTML } from './liquidacion.js';

// controladores
import { LiquidacionController } from './controllers/liquidacionController.js';
import { UsuarioController } from './controllers/usuarioController.js';


const iniciar = () => {

    const usuarios = new UsuarioController();

    let userLogon = usuarios.getUserLogon();
    if (userLogon == null || userLogon === undefined) {
        window.location.href = getBaseUrl() + '/pages/login.html';
    }
  
    const liquidaciones = new LiquidacionController();
    armarTablaHTML("#tablaLiquidaciones", liquidaciones, false);
}

// arma tabla html dinamica (read only) desde las liquidaciones en localStorage
window.onload = iniciar();

  