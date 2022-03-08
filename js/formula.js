/* Proyecto Final: Interprete de fórmulas tipo Excel
   Las formulas vienen en un string y devuelven un resultado
*/   

import { Variable } from './models/variable.js';
import { VariableController } from './controllers/variableController.js';
  
// constantes de condicionales
const VARIABLE_IDENTIFICADOR    = ':';
const CONDICIONAL_IDENTIFICADOR = 'SI';
const CONDICIONAL_INICIO        = '(';
const CONDICIONAL_SEPARADOR     = ';';
const CONDICIONAL_FIN           = ')';

// conjuntos de caracteres
const SetNumeros            = '0123456789';
const SetMinusculas         = 'abcdefghijklmnopqrstuvwxyz';
const SetMayusculas         = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const SetSeparadores        = ',; ';
const SetLetras             = SetMinusculas + SetMayusculas + SetSeparadores;
const SetOperadores         = '+-/|\*^=';
const SetDelimitadores      = SetOperadores + CONDICIONAL_INICIO + CONDICIONAL_FIN;
const SetOtrosCaracteres    = '#_.';       // otros caracteres validos para variables

const SetCaracteresVariable = SetMinusculas + SetMayusculas + SetNumeros + SetOtrosCaracteres;

// obtiene el valor de la variable del array y la devuelve como string
const getValorVariable = (nombreVariable) => {

    // busca la variable en el array por el nombre (parametro)
    const variableController = new VariableController();
    let variableEncontrada = variableController.get(nombreVariable);
    
    if (variableEncontrada == undefined ) {
        // console.log(`variable buscada ${nombreVariable}, no encontrada se solicita valor...`);
        
        // si una variable no existe pide ingresarla
        let valor = prompt(`Por favor ingrese un valor para la variable: ${nombreVariable}\n` + 
                           `si es string poner entre "", por ejemplo: "ROJO"`);

        // actualiza la variable con el valor ingresado
        variableEncontrada.valor = valor;
        variableController.actualizar(variableEncontrada);
        return valor;
        
} else {
        // console.log(`variable buscada ${nombreVariable}, encontrada ${variableEncontrada.mostrar()}`);

        // evalua si el tipo es un string
        if (typeof(variableEncontrada.valor) != 'string') {
            return String(variableEncontrada.valor);
        } else {
            return variableEncontrada.valor;
        }
    }

} 

// obtiene el nombre de la variable del parametro formula indicado en la posicion parámetro
const getNombreVariable = (formula, posicion) => {
    
    let posicionInicial = posicion + VARIABLE_IDENTIFICADOR.length;
    let posicionFinal = posicionInicial;
    
    for (let ii = posicionInicial;  ii <= formula.length - 1; ii++) {
        if (SetCaracteresVariable.indexOf(formula.substr(ii, 1)) == -1) {
            break;
        }
        posicionFinal = ii; 
    }

    let nombreVariable = formula.substr(posicionInicial, posicionFinal - posicionInicial + 1);

    // console.log(`formula: ${formula} nombreVariable: ${nombreVariable}`);
    
    return nombreVariable;
}

// determina si hay una variable en la fórmula
const hayVariable = (formula) => {
    return formula.indexOf(VARIABLE_IDENTIFICADOR) >= 0;
}

// obtiene la primer variable del parametro formula y devuelve un objeto con el nombre y valor de la misma
const getVariable = (formula) => {

    let posIdentificador = formula.indexOf(VARIABLE_IDENTIFICADOR);

    let variableNombre = getNombreVariable(formula, posIdentificador);
    let variableValor  = getValorVariable (variableNombre);

    // console.log(`variableNombre: ${variableNombre}, variableValor: ${variableValor}`);

    return {
        'nombre': variableNombre,
        'valor' : variableValor
    };

    // const variable = new Variable(variableNombre, variableValor);
    // return variable;
}

// realiza la cuenta con la expresion informada como parametro, ej: 4 + 2, 3 * 6, etc
const resultadoCuenta = (expresion) => {
    // console.log(`ejecuta resultadoCuenta, expresion: ${expresion}`);
    return Function('return ' + expresion)();
}


// devuelve el condicional principal de una formula       
const getCondicional = (formula) => {
  
    let condicional = ''; 
    let condicionalesAbiertos = 0;
    let posCondicional = formula.indexOf(CONDICIONAL_IDENTIFICADOR);
    let posCondicionalFin = formula.lastIndexOf(CONDICIONAL_FIN);
    
    for (let ii = posCondicional; ii <= posCondicionalFin; ii++) {

        if ((formula.substr, ii, 1) == CONDICIONAL_FIN && condicionalesAbiertos == 0) {
            break;
        }

        condicional = condicional + formula.substr(ii, 1);
        
        if (formula.substr(ii, 1) == CONDICIONAL_INICIO) {
            condicionalesAbiertos++;
        }

        if (formula.substr(ii, 1) == CONDICIONAL_FIN) {
            condicionalesAbiertos--;
        }

    }
    return condicional;
}
    

// devuelve TRUE si la condicion es verdadera, FALSE si no       
const cumpleCondicion = (condicion) => {

    condicion = condicion.trim();

    // console.log(`cumpleCondicion --> condicion: ${condicion}`);

    if (condicion == null) {
        return false;        // en realidad no se pudo evaluar porque es nula
    }

    if (hayVariable(condicion)) {

        let variable = getVariable(condicion);

        // console.log(`cumpleCondicion hay variable: ${variable.nombre} = ${variable.valor}`);
        if (variable.valor.indexOf('"' > -1)) {
            console.log('... la variable tiene comillas ...');
        }
    
        let resultadoVariable = calculoFormula(variable.valor);  
        
        if (condicion == VARIABLE_IDENTIFICADOR + variable.nombre) {
            null;      // no se reemplaza la variable en la formula
        } else {
            if (variable.valor.indexOf('"' > -1)) {
                return cumpleCondicion(condicion.replace(VARIABLE_IDENTIFICADOR + variable.nombre, '"' + resultadoVariable + '"'));
            }
            else {
                return cumpleCondicion(condicion.replace(VARIABLE_IDENTIFICADOR + variable.nombre, resultadoVariable));
            }
        }
    } else {
        // evalua la condicion y devuelve verdadero o falso segun corresponda
        return Function('return ' + condicion + ' == true')();   
    }
}

const splitCondicional = (condicional) => {

    let condicion = ''; 
    let operandoV = ''; 
    let operandoF = ''; 
    let parte = 0;
    let condicionalesAbiertos = 0;

    if (condicional != null) {
        // elimina el identificador del condicional y el comienzo del mismo 
        let posCondicional = condicional.indexOf(CONDICIONAL_IDENTIFICADOR);          
        let posCondicionalInicio = condicional.indexOf(CONDICIONAL_INICIO, posCondicional);
        condicional = condicional.substr(posCondicionalInicio + 1, condicional.length - posCondicionalInicio);
                              
        // elimina el fin del condicional y lo de atras para devolver la condicion pura 
        let posCondicionalFin = condicional.lastIndexOf(CONDICIONAL_FIN);
        condicional = condicional.substr(0, posCondicionalFin);
    }
    
    for (ii = 0; ii <= condicional.length - 1; ii++) {

        if ((condicional.substr(ii, 1) == CONDICIONAL_SEPARADOR) && (condicionalesAbiertos == 0)) {
            parte++;
        }

        switch (parte) {
            case 0:
                if (condicional.substr(ii, 1) != CONDICIONAL_SEPARADOR || condicionalesAbiertos > 0) {
                    condicion = condicion + condicional.substr(ii, 1);
                }
                break;
            case 1:
                if (condicional.substr(ii, 1) != CONDICIONAL_SEPARADOR || condicionalesAbiertos > 0) {
                    operandoV = operandoV + condicional.substr(ii, 1);
                }
                break;
            case 2:
                if (condicional.substr(ii, 1) != CONDICIONAL_SEPARADOR || condicionalesAbiertos > 0) {
                    operandoF = operandoF + condicional.substr(ii, 1);
                }
                break;
        }
        
        if (condicional.substr(ii, 1) == CONDICIONAL_INICIO) {
            condicionalesAbiertos++;
        }
        
        if (condicional.substr(ii, 1) == CONDICIONAL_FIN) {
            condicionalesAbiertos--;
        }
    }

    return {
            'condicion': condicion,
            'operandoV': operandoV,
            'operandoF': operandoF
    };
}

// Resuelve la formula que viene como parámetro (falta desarrollar condicionales)
const calculoFormula = (formula) => {

    let resultado = '';

    // console.log(`formula: ${formula}`);

    formula = formula.trim();

    // si no hay condicionales
    if (formula == null || formula.indexOf(CONDICIONAL_IDENTIFICADOR + CONDICIONAL_INICIO) == -1) {  

        // console.log('no hay condicional');

        if (hayVariable(formula)) {     // hay variable

            // console.log('hay variable');
            
            let variable = getVariable(formula);

            // console.log(`variable: ${variable.nombre} = ${variable.valor}`);

            resultado = calculoFormula(variable.valor);  
            
            if (formula == VARIABLE_IDENTIFICADOR + variable.nombre) {
                null;                 // no se reemplaza la variable en la formula, termina CalculoFormula
            } else {
                resultado = calculoFormula(formula.replace(VARIABLE_IDENTIFICADOR + variable.nombre, resultado));
            }
        } else {                      // no hay variable hace la cuenta

            // console.log('NO hay variable');

            resultado = resultadoCuenta(formula);       // termina CalculoFormula
        }  
    
    } else {            // hay condicionales

        // console.log('hay condicional');
    
        let condicional = getCondicional(formula);

        if (condicional != null) {

            oCondicional = splitCondicional(condicional);

            if (oCondicional != null) {

                if (cumpleCondicion(oCondicional.condicion)) {       // el condicional dio verdadero
                    resultado = calculoFormula(oCondicional.operandoV);
                } else {
                    resultado = calculoFormula(oCondicional.operandoF);
                } 
            
                if (formula == condicional) {
                    null;      // no se reemplaza el condicional en la formula
                } else {
                    resultado = calculoFormula(formula.replace(condicional, resultado));
                }
            } 
        } 
    }                                              

    console.log(`formula: ${formula}, resultado: ${resultado}`);

    return resultado;
}

// muestra por consola el resultado de la cuenta o formula
const calcularYMostrar = (formula, funcion) => {
    switch (funcion.toLowerCase()) {
        case 'cuenta': 
            console.log(`... ejecución de ResultadoCuenta (${formula}) ==> ${resultadoCuenta(formula)}`);
            break;
        case 'formula': 
            console.log(`... ejecución de CalculoFormula (${formula}) ==> ${calculoFormula(formula)}`);
            break;
        default: 
            console.log(`... ejecución de CalculoFormula (${formula}) ==> ${calculoFormula(formula)}`);
            break;
    }
  }
  

export { resultadoCuenta, calculoFormula, calcularYMostrar };
