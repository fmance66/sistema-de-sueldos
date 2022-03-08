/* Proyecto Final: Interprete de fórmulas tipo Excel
   Las formulas vienen en un string y devuelven un resultado
   
   Operadores:
    +  --> suma 
    -  --> resta
    *  --> multiplicacion
    /  --> division 
    ^  --> potenciacion

   Variables:
    : --> identificador
    
    ej: :IMPORTE, :FECHA_TOPE  etc

   Condicional (no desarrollado todavía):

    SI(<condicion>;<sentencia por TRUE>;<sentencia por FALSE>)

    ej: SI(:IMPORTE > 100; IMPORTE; IMPORTE * 1.1)

*/

// librerias
import { getBaseUrl } from './utiles.js';
import { armarTablaHTML } from './liquidacion.js';

// controladores
import { TipoVariableController } from './controllers/tipoVariableController.js';
import { VariableController } from './controllers/variableController.js';
import { TipoConceptoController } from './controllers/tipoConceptoController.js';
import { ConceptoController } from './controllers/conceptoController.js';
import { CategoriaController } from './controllers/categoriaController.js';
import { EmpleadoController } from './controllers/empleadoController.js';
import { UsuarioController } from './controllers/usuarioController.js';
import { TipoLiquidacionController } from './controllers/tipoLiquidacionController.js';
import { LiquidacionController } from './controllers/liquidacionController.js';
import { ReciboController } from './controllers/reciboController.js';


const iniciar = () => {

    // let baseUrl  = getBaseUrl();
    // console.log('--- main.js iniciar() ---');
    // console.log('baseUrl: ', baseUrl);

    // carga todos los json en localStorage si no existen
    const tipoVariables = new TipoVariableController();
    const variables = new VariableController();
    const tipoConceptos = new TipoConceptoController();
    const conceptos = new ConceptoController();
    const categorias = new CategoriaController();
    const empleados = new EmpleadoController();
    const usuarios = new UsuarioController();
    const tipoLiquidaciones = new TipoLiquidacionController();
    const liquidaciones = new LiquidacionController();
    const recibos = new ReciboController();

    let userLogon = usuarios.getUserLogon();
    if (userLogon == null || userLogon === undefined) {
        window.location.href = getBaseUrl() + '/pages/login.html';
    }

    // personaliza mensaje de bienvenida al usuario logoneado
    let mensajeBienvenida = document.querySelector("#msgBienvenida");
    let parrafo = document.createElement("p");
    parrafo.innerHTML = `<p class="text-white mt-5 mb-5">Bienvenido, <b>${userLogon.nombre}</b></p>`;
    mensajeBienvenida.appendChild(parrafo);


    // muestras las liquidaciones
    armarTablaHTML("#tablaLiquidacionesIndex", liquidaciones, true);
};

// arma tabla html dinamica (read only) desde las liquidaciones en localStorage
window.onload = iniciar();

  
