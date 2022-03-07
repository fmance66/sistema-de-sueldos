/* 
    Proyecto Final: Interprete de fórmulas tipo Excel
*/

// import * as formula from './formula.js';

// segun el estado devuelve la class con el color del semaforo verde, amarillo o rojo
const generateDivEstado = (estado) => { 

    let clase = '';

    switch (estado.toLowerCase()) {
        case 'abierta':
            clase = 'semaforo-verde';
            break;
        case 'activo':
            clase = 'semaforo-verde';
            break;
        case 'cerrada':
            clase = 'semaforo-rojo';
            break;
        case 'anulado':
            clase = 'semaforo-rojo';
            break;
        default:
            clase = 'semaforo-amarillo';
            break;
    };

    let texto = estado.charAt(0).toUpperCase() + estado.slice(1);
    return `<div class="tm-estado-semaforo ${clase}"></div>${texto}`;  
};

export { generateDivEstado };
