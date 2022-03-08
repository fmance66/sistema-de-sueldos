/* 
    Proyecto Final: Interprete de fórmulas tipo Excel
*/
 
// librerias
import { generateDivEstado } from './utiles.js';

// models
import { Variable } from './models/variable.js';

// controladores
import { VariableController } from './controllers/variableController.js';
import { TipoVariableController } from './controllers/tipoVariableController.js';
import { UsuarioController } from './controllers/usuarioController.js';


// carga tabla de variables desde array de variables obtenido de json externo
const armarTablaHTML = (idTabla, variables) => {

  let tablaVariables = document.querySelector(idTabla);

  // console.log('idTabla: ', idTabla);
  // console.log('tablaVariables: ', tablaVariables);
    
  let tbody = document.createElement("tbody");
  tablaVariables.appendChild(tbody);
  
  // console.log('variables: ', JSON.stringify(variables));

  for (const variable of variables.variables) {
    let tr = document.createElement("tr");

    // columna de checkbox
    let td = document.createElement("td");
    td.innerHTML = '<input type="checkbox" />';
    td.classList.add("tm-col-checkbox");
    tr.appendChild(td);

    // console.log('variable: ', variable);

    // busca el tipo de variable según el idTipoVariable
    const tipoVariables = new TipoVariableController();
    let tipoVariable = tipoVariables.get(variable.idTipoVariable);

    // console.log('tipoVariable:', tipoVariable);

    for (let e in variable) {

        if (variable.hasOwnProperty(e)) {

            let td = document.createElement("td");

            if (e == 'id') {     // el id no lo muestra, esta oculto
                td.classList.add("oculto");
            }
          
            // oculta el id y muestra la descripcion del tipo de variable
            if (e == 'idTipoVariable') {     
                // carga idTipoVariable oculto
                td.innerHTML = variable.idTipoVariable;
                td.classList.add("oculto", `tm-col-${e}`);
                tr.appendChild(td);
                // carga la descripcion del tipo de variable
                td = document.createElement("td");
                td.classList.add("tm-col-descripcion");
                td.innerHTML = tipoVariable.descripcion;
            } else {
                // agrega la columna a la fila con una clase con el nombre del atributo de clase
                td.classList.add(`tm-col-${e}`);
                td.innerHTML = variable[e];
            }

            if (e == 'nombre') {
                td.classList.add("tm-variable-bold");
            }; 
              
            // semaforo de estado
            if (e == 'estado') {
                td.innerHTML = generateDivEstado(variable[e]);
            }

            // agrega clase al campo y convierte cursor para usar con el "click"
            // agrega la columna a la fila con una clase con el nombre del atributo de clase
            if (variable.estado == "activo") {
              td.classList.add("tm-col-variable");
              td.style.cursor = "pointer";
            }

            tr.appendChild(td);                
        }
    }

    // columna con icono de eliminar
    td = document.createElement("td");
    td.innerHTML = '<a href="#" class="tm-variable-delete-link">' +
                    '<i class="far fa-trash-alt tm-variable-delete-icon" />' +
                '</a>';
    td.classList.add("tm-col-delete");
    tr.appendChild(td);

    // agrega clase a la fila para usar en un futuro
    tr.classList.add("tm-fila-variable");

    tbody.appendChild(tr);
  }
}

// eventos de fila de tabla
$(document).ready(function() {  

  // reenvia a la pagina edit-liquidacion.html (jquery)
  $(document).on("click", ".tm-fila-variable", function() { 
    let tabla = document.getElementById("tablaVariables");  
    let fila = $(this).closest('tr')[0];   // guarda la fila seleccionada
    console.log(fila);

    let tds = fila.querySelectorAll("td");

    const variable = new Variable({
      id: parseInt(fila.querySelector(".tm-col-id").innerText),                           // oculto
      nombre: fila.querySelector(".tm-col-nombre").innerText,
      valor: fila.querySelector(".tm-col-valor").innerText,
      idTipoVariable: parseInt(fila.querySelector(".tm-col-idTipoVariable").innerText),   // oculto
      // tipoVariable: fila.querySelector(".tm-col-tipoVariable").innerText,               
      estado: fila.querySelector(".tm-col-estado").innerText.toLowerCase()
    }); 
    
    if (variable.estado == "activo") {
      // console.log(`objVariable: ${JSON.stringify(variable)}`);
      sessionStorage.setItem("objVariable", JSON.stringify(variable));
      window.location.href = getBaseUrl() + '/pages/edit-variable.html';
    }
  });
    
  // anula el evento click para el checkbox
  $(".tm-fila-variable").on("click", ".tm-col-checkbox", function(e) { 
    // console.log('se hizo click en "tm-col-checkbox"');
    e.stopPropagation() 
  });

  // anula el evento click para el boton delete
  $(".tm-fila-variable").on("click", ".tm-col-delete", function(e) { 
    // console.log('se hizo click en "tm-col-delete"');
    e.stopPropagation() 
  });

  // cambia el color de fila editable
  $(".tm-fila-variable").on("mouseover", function() { 
      let estado = this.querySelector(".tm-col-estado").innerText;
      if (estado == 'Activo') {
        $(this).css({
          'background-color': '#6987a5'
        });
      }
    });
    
  // restaura el color de fila editable
  $(".tm-fila-variable").on("mouseout", function() { 
    $(this).css({
      'background-color': '#4f667c'
    });
  });
    
});

// carga tabla de tipos de variables desde array obtenido de json externo
const armarTablaHtmlTipo = (idTabla, tipoVariables) => {
    
  // carga table de variables desde array de variables
  let tablaTipoVariables = document.querySelector(idTabla);

  // console.log('idTabla: ', idTabla);
  // console.log('tablaTipoVariables: ', tablaTipoVariables);

  let tbody = document.createElement("tbody");
  tablaTipoVariables.appendChild(tbody);

  for (const tipoVariable of tipoVariables.tipoVariables) {

      let tr = document.createElement("tr");

      for (let e in tipoVariable) {

          if (tipoVariable.hasOwnProperty(e)) {

              let td = document.createElement("td");

              if (e == 'id') {     // el id no lo muestra, esta oculto
                  td.classList.add("oculto");
              }

              td.innerHTML = tipoVariable[e];

              if (e == 'descripcion') {
                  td.classList.add("tm-variable-bold", "w-100", "tm-nombre-variable");
              } else {
                  td.classList.add("tm-nombre-variable");
              }; 
                
              // semaforo de estado
              if (e == 'estado') {
                  td.innerHTML = generateDivEstado(tipoVariable[e]);
              }

              // agrega la columna a la fila con una clase con el nombre del atributo de clase
              td.classList.add(`tm-col-${e}`);
              tr.appendChild(td);
          }
      }

      // columna con icono de eliminar
      let td = document.createElement("td");
      td.innerHTML = '<a href="#" class="tm-variable-delete-link">' +
                      '<i class="far fa-trash-alt tm-variable-delete-icon"/>' +
                  '</a>';
      td.classList.add("tm-col-delete");
      tr.appendChild(td);

      // // agrega clase a la fila para usar en el click (uso futuro)
      tr.classList.add("tm-fila-tipo-variable");
      tbody.appendChild(tr);
  }
}

// reenvia a la pagina edit-liquidacion.html (jquery)
$(".tm-fila-tipo-variable").on("click", function() {
  let tabla = document.getElementById("tablaTipoVariables");  
  let fila = $(this).closest('tr')[0];   // guarda la fila seleccionada
  // console.log(fila);

  let tds = fila.querySelectorAll("td");

  const tipoVariable = new TipoVariable(); 
  tipoVariable.id = fila.querySelector(".tm-col-id").innerText;             // oculto
  tipoVariable.descripcion = fila.querySelector(".tm-col-descripcion").innerText;
  variable.estado = fila.querySelector(".tm-col-estado").innerText;

  // console.log(`tipoVariable: ${tipoVariable.mostrar()}`);
  
  if (tipoVariable.estado == "Activo") {
  //   console.log(`objVariable: ${JSON.stringify(variable)}`);
    sessionStorage.setItem("objTipoVariable", JSON.stringify(tipoVariable));
    window.location.href = getBaseUrl() + '/pages/edit-variable.html';
  }
});

// anula el evento click para el boton delete
$(".tm-fila-tipo-variable").on("click", ".tm-col-delete", function(e) { 
// console.log('se hizo click en "tm-col-delete"');
e.stopPropagation() 
});

const iniciar = () => {

  const usuarios = new UsuarioController();

  let userLogon = usuarios.getUserLogon();
  if (userLogon == null || userLogon === undefined) {
      window.location.href = getBaseUrl() + '/pages/login.html';
  }

  const variables = new VariableController();
  armarTablaHTML("#tablaVariables", variables);

  const tipoVariables = new TipoVariableController();
  armarTablaHtmlTipo("#tablaTipoVariables", tipoVariables);
}

window.onload = iniciar();

