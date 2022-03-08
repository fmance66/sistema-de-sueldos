/* 
    Proyecto Final: Interprete de fórmulas tipo Excel
*/

import { getBaseUrl, generateDivEstado } from './utiles.js';
import { Recibo } from './models/recibo.js';
import { EmpleadoController } from './controllers/empleadoController.js';
import { LiquidacionController } from './controllers/liquidacionController.js';
import { ReciboController } from './controllers/reciboController.js';
import { UsuarioController } from './controllers/usuarioController.js';

const urlJson = '../data/recibos.json';
const lsName = "lsRecibos";


const cargarSelectLiquidacion = () => {

  let liquidacionSelect = document.querySelector('#selLiquidacion');
  const liquidaciones = new LiquidacionController();

  liquidaciones.getAll().forEach(function(liquidacion) {
    let opcion = document.createElement('option');
    opcion.value = liquidacion.id;
    opcion.text = liquidacion.descripcion;
    liquidacionSelect.add(opcion);
  });

  // console.log('liquidacionSelect', liquidacionSelect);

  // propone la última liquidacion como default
  liquidacionSelect.value = liquidaciones.liquidaciones[liquidaciones.liquidaciones.length - 1].id;

  return liquidacionSelect.value;
};

// carga tabla de recibos desde array de recibos
const armarTablaHTML = (idTabla, recibos) => {

  // console.log('recibos: ', recibos);

  let tablaRecibos = document.querySelector(idTabla);

  let tbody = document.createElement("tbody");  
  tbody.setAttribute("id", "tablaRecibosBody");
  tablaRecibos.appendChild(tbody);

  for (const recibo of recibos.recibos) {

    let tr = document.createElement("tr");

    // columna de checkbox
    let td = document.createElement("td");
    td.innerHTML = '<input type="checkbox" />';
    td.classList.add("tm-col-checkbox");
    tr.appendChild(td);

    // busca la liquidacion segun el idLiquidacion
    const liquidaciones = new LiquidacionController();
    let liquidacion = liquidaciones.get(recibo.idLiquidacion);

    // busca el empleado segun el legajo
    const empleados = new EmpleadoController();
    let empleado = empleados.get(recibo.legajo);

    for (let e in recibo) {

        if (recibo.hasOwnProperty(e)) {
            
          let td = document.createElement("td");
            
          if ((e == 'id') || (e == 'conceptos')) {     // los id y conceptos no los muestra, estan ocultos
              td.classList.add("oculto");
          }
            
          if (e == 'legajo') {
              // carga legajo
              td.innerHTML = `#${recibo[e]}`
              td.classList.add("tm-recibo-bold", "tm-col-recibo", `tm-col-${e}`);
              td.style.cursor = "pointer";
              tr.appendChild(td);
              // y carga nombre
              td = document.createElement("td");
              td.classList.add("tm-recibo-bold", "tm-col-nombre");
              td.innerHTML = empleado.nombre; 
          } else {
              // agrega la columna a la fila con una clase con el nombre del atributo de clase
              td.classList.add(`tm-col-${e}`);
              if (e.substring(0, 5) == "total") {
                td.innerHTML = recibo[e].toLocaleString('es-AR', { minimumFractionDigits: 2 , 
                                                                   maximumFractionDigits: 2 });
                td.style.textAlign = "right";
              } else {
                if (e == 'conceptos') {
                  td.innerHTML = JSON.stringify(recibo[e]);
                } else {
                  td.innerHTML = recibo[e];
                }
              }
          }
          // oculta el id y muestra el periodo de la liquidacion
          if (e == 'idLiquidacion') {     
              // carga idLiquidacion oculto
              td.innerHTML = recibo.idLiquidacion;
              td.classList.add("oculto");
              tr.appendChild(td);
              // carga el periodo del idLiquidacion
              td = document.createElement("td");
              td.classList.add("tm-col-periodo");
              td.innerHTML = liquidacion.periodo;
          }
                
          // semaforo de estado y periodo de liquidacion
          if (e == 'estado') {
            td.classList.add("tm-col-estado");
            td.innerHTML = generateDivEstado(recibo[e]);
          }

          if (recibo.estado == "activo") {
            // agrega clase al campo para uso futuro y convierte cursor tipo manito
            td.classList.add("tm-col-recibo");
            td.style.cursor = "pointer";
          }

          tr.appendChild(td);
        }
    }

    // columna con icono de eliminar
    td = document.createElement("td");
    td.innerHTML = '<a href="#" class="tm-recibo-delete-link">' +
                    '<i class="far fa-trash-alt tm-recibo-delete-icon" />' +
                '</a>';
    td.classList.add("tm-col-delete");
    tr.appendChild(td);

    // agrega clase a la fila para usar con el "click"
    tr.classList.add("tm-fila-recibo");
    tbody.appendChild(tr);
  }
}
 
// carga los recibos desde el .json y arma tabla de recibos
const iniciar = () => {

  const usuarios = new UsuarioController();

  let userLogon = usuarios.getUserLogon();
  if (userLogon == null || userLogon === undefined) {
      window.location.href = getBaseUrl() + '/pages/login.html';
  }

  // carga el select de liquidaciones filtrado por idLiquidacion
  let idLiquidacion = cargarSelectLiquidacion();
  const recibos = new ReciboController();
  recibos.recibos = recibos.getAll(idLiquidacion);
  armarTablaHTML("#tablaRecibos", recibos);
};

// arma tabla html dinamica (read only) desde las liquidaciones en localStorage
window.onload = iniciar();

// eventos de fila de tabla
$(document).ready(function() {  

  // reenvia a la pagina edit-liquidacion.html (jquery)
  $(document).on("click", ".tm-fila-recibo", function() { 

      let tabla = document.getElementById("tablaRecibos");  
      let fila = $(this).closest('tr')[0];   // guarda la fila seleccionada

      let tds = fila.querySelectorAll("td");

      const recibo = new Recibo({
        id: parseInt(fila.querySelector(".tm-col-id").innerText),                            // oculto
        legajo: fila.querySelector(".tm-col-legajo").innerText.replace('#', ''), 
        // nombre = fila.querySelector(".tm-col-nombre").innerText, 
        idLiquidacion: parseInt(fila.querySelector(".tm-col-idLiquidacion").innerText),     // oculto
        // periodo = fila.querySelector(".tm-col-periodo").innerText, 
        estado: fila.querySelector(".tm-col-estado").innerText,
        totalRemunerativo: fila.querySelector(".tm-col-totalRemunerativo").innerText,
        totalDeducciones: fila.querySelector(".tm-col-totalDeducciones").innerText,
        totalNoRemunerativo: fila.querySelector(".tm-col-totalNoRemunerativo").innerText,
        totalNeto: fila.querySelector(".tm-col-totalNeto").innerText,
        conceptos: JSON.parse(fila.querySelector(".tm-col-conceptos").innerText)
      }); 
        
    //   console.log(`recibo: ${recibo.mostrar()}`);
      
    if (recibo.estado == "Activo") {
    // if (recibo.estado == "activo") {
        // console.log(`objRecibo: ${JSON.stringify(recibo)}`);
        sessionStorage.setItem("objRecibo", JSON.stringify(recibo));
        window.location.href = getBaseUrl() + '/edit-recibo.html';
      }
  });

  // anula el evento click para el checkbox
  $(document).on("click", ".tm-col-checkbox", function(e) { 

    console.log('se hizo click en "tm-col-checkbox"');
    e.stopPropagation(); 
  });

  // anula el evento click para el boton delete
  $(document).on("click", ".tm-col-delete", function(e) { 
    
    console.log('se hizo click en "tm-col-delete"');
    e.stopPropagation(); 

    // console.log('va a ejecutar eliminarRecibo()...');

    // obtengo la fila seleccionada (tr )donde se hizo el click
    let fila = e.target.parentNode.parentNode.parentNode;
    // console.log('fila: ', fila);
    let id = parseInt(fila.querySelector(".tm-col-id").innerText.replace('#',''));
    // console.log('id: ', id);
    // elimina la fila del array y actualiza el localStorage
    const recibos = new ReciboController();
    recibos.eliminar(id);
    // elimina la fila de la tabla html
    fila.remove();
    // mensaje de exito
    toastr.options = {
      "closeButton": true,
      "positionClass": "toast-top-right",
      "preventDuplicates": true,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "2000",
    }
    toastr.success('El registro fue eliminado con éxito...','Eliminar recibo');

  });

  // cambia el color de fila editable
  $(document).on("mouseover", ".tm-fila-recibo", function(e) { 
      // console.log('se hizo click en "onmouseover"');
    let estado = this.querySelector(".tm-col-estado").innerText;
    if (estado == 'Activo') {
        $(this).css({
        'background-color': '#6987a5'
      });
    }
  });

  // restaura el color de fila editable
  $(document).on("mouseout", ".tm-fila-recibo", function(e) { 
      // console.log('se hizo click en "onmouseout"');
    $(this).css({
      'background-color': '#4f667c'
    });
  });
  
});

// cambio la seleccion de liquidacion
$("#selLiquidacion").on("change", function() { 
  // carga la tabla html con el idLiquidacion seleccionado
  let idLiquidacion = this.value;
  $("#tablaRecibosBody").remove();              // vacia la tabla html
  const recibos = new ReciboController();
  recibos.recibos = recibos.getAll(idLiquidacion);
  armarTablaHTML("#tablaRecibos", recibos);
});
