/* 
    Proyecto Final: Interprete de fórmulas tipo Excel
*/

// import * as utiles from './utiles.js';
import { Variable } from './models/variable.js';
import { TipoVariableController } from './controllers/tipoVariableController.js';
import { VariableController } from './controllers/variableController.js';

  
// carga los datos de la variable desde sessionStorage
const cargarDatosVariable = () => {

  // obtiene los datos de la variable desde el sessionStorage
  const variable = new Variable(
    JSON.parse(sessionStorage.getItem("objVariable"))
  );

  // console.log(variable);

  // busca el tipo de variable segun el idTipoVariable
  const tipoVariables = new TipoVariableController();
  let tipoVariable = tipoVariables.get(variable.idTipoVariable);
  // console.log(tipoVariable);

  // carga el select de tipo de variable desde el json
  let tipoVariableSelect = document.querySelector('#selTipoVariable');
  tipoVariables.getAll().forEach(function(tipoVariable) {
    let opcion = document.createElement('option');
    opcion.value = tipoVariable.id;
    opcion.text = tipoVariable.descripcion;
    tipoVariableSelect.add(opcion);
  });
  
  // asigna valores desde el objeto variable
  document.querySelector("#id").value = variable.id;
  document.querySelector("#nombre").value = variable.nombre;
  document.querySelector("#valor").value = variable.valor;
  document.querySelector("#selTipoVariable").value = tipoVariable.id;
  document.querySelector("#estado").value = variable.estado;
}

// datepicker para fechas (jquery)
$(function() {
  $("#fecha").datepicker({
    defaultDate: "01/02/2022"
  });
});

$(function() {
  $("#btnActualizar").click(function() {
    console.log('hizo click en actualizar!!!');

    const variable = new Variable({
      id: parseInt(document.querySelector("#id").value),
      nombre: document.querySelector("#nombre").value,
      valor: document.querySelector("#valor").value,
      idTipoVariable: parseInt(document.querySelector("#selTipoVariable").value),
      estado: document.querySelector("#estado").value
    }); 

    console.log(variable);

    // actualiza variable en array y local storage
    const variables = new VariableController();
    variables.actualizar(variable);

    // muestra mensaje de exito
    toastr.success('El registro fue actualizado con éxito...','Actualizar variable');
  });
});

// carga los datos del recibo desde la sessionStorage
window.onload=cargarDatosVariable();
