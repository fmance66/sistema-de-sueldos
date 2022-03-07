/* Proyecto Final: Interprete de fórmulas tipo Excel

*/

// librerias
import { armarTablaHTML } from './liquidacion.js';
import { LiquidacionController } from './controllers/liquidacionController.js';
import { UsuarioController } from './controllers/usuarioController.js';


const iniciar = () => {

    const usuarios = new UsuarioController();

    let userLogon = usuarios.getUserLogon();
    if (userLogon == null || userLogon === undefined) {
        // console.log('window.location.href = "../pages/login.html"');
        window.location.href = "../pages/login.html";
    }
  
    const liquidaciones = new LiquidacionController();
    armarTablaHTML("#tablaLiquidaciones", liquidaciones, false);
}

// arma tabla html dinamica (read only) desde las liquidaciones en localStorage
window.onload = iniciar();

  