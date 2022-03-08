/* 
    Proyecto Final: Interprete de fórmulas tipo Excel
*/

// librerias
import { getBaseUrl, generateDivEstado } from './utiles.js';

// models
import { Liquidacion } from './models/liquidacion.js';

// controladores
import { TipoLiquidacionController } from './controllers/tipoLiquidacionController.js';
import { LiquidacionController } from './controllers/liquidacionController.js';


// carga tabla de liquidaciones desde array de liquidaciones
const armarTablaHTML = (idTabla, liquidaciones, isReadOnly) => {

  let tablaLiquidaciones = document.querySelector(idTabla);

  // console.log('idTabla: ', idTabla, '  isReadOnly: ', isReadOnly);
  
  let tbody = document.createElement("tbody");
  tablaLiquidaciones.appendChild(tbody);

  // console.log('liquidaciones: ', liquidaciones);
  // console.log('liquidaciones: ', JSON.stringify(liquidaciones));

  for (const liquidacion of liquidaciones.liquidaciones) {
    
    let tr = document.createElement("tr");

    // columna de checkbox, solo si no es read-only
    if (!isReadOnly) {
      let td = document.createElement("td");
      td.innerHTML = '<input type="checkbox" />';
      td.classList.add("tm-col-checkbox");
      tr.appendChild(td);
    };

    // busca el tipo de liquidacion segun el idTipoLiquidacion
    const tipoLiquidaciones = new TipoLiquidacionController();
    let tipoLiquidacion = tipoLiquidaciones.get(liquidacion.idTipoLiquidacion);

    // console.log('tipoLiquidacion: ', tipoLiquidacion);

    for (let e in liquidacion) {

        if (liquidacion.hasOwnProperty(e)) {

            let td = document.createElement("td");

            // console.log('liquidacion[e]: ', typeof(liquidacion[e]), liquidacion[e]);
            
            // oculta el idTipoLiquidacion y muestra la descripcion del tipo de liquidacion
            if (e == 'idTipoLiquidacion') {     
              // carga idTipoLiquidacion oculto
              td.innerHTML = liquidacion.idTipoLiquidacion;
              td.classList.add("oculto", `tm-col-${e}`);
              tr.appendChild(td);
              // carga la descripcion del idTipoLiquidacion
              td = document.createElement("td");
              td.classList.add("tm-col-tipoLiquidacion");
              td.innerHTML = tipoLiquidacion.descripcion;
            } else {
              // agrega la columna a la fila con una clase con el nombre del atributo de clase
              td.classList.add(`tm-col-${e}`);
              if (e == 'id') {
                td.innerHTML = `#${liquidacion[e]}`
              } else {
                  td.innerHTML = liquidacion[e]
              }
            }

            if (e == 'id' || e == 'descripcion' || e == 'periodo') {
                td.classList.add("tm-liquidacion-bold");
            };
              
            // semaforo de estado
            if (e == 'estado') {       
              td.innerHTML = generateDivEstado(liquidacion[e]);
            }

            // si no es read-only agrega clase al campo para uso futuro y convierte cursor tipo manito
            if (liquidacion.estado == "abierta" && !isReadOnly) {
              td.classList.add("tm-col-liquidacion");
              td.style.cursor = "pointer";
            }

            tr.appendChild(td);
        }
    }

    // columna con icono de eliminar, solo si no es read-only
    if (!isReadOnly) {
      let td = document.createElement("td");
      td.innerHTML = '<a href="#" class="tm-liquidacion-delete-link">' +
                        '<i class="far fa-trash-alt tm-liquidacion-delete-icon" />' +
                     '</a>';
      td.classList.add("tm-col-delete");
      tr.appendChild(td);

      // agrega clase a la fila para usar en el click
      tr.classList.add("tm-fila-liquidacion");
    }

    tbody.appendChild(tr);
  };
};

// eventos de fila de tabla
$(document).ready(function() {  

  // reenvia a la pagina edit-liquidacion.html (jquery)
  $(document).on("click", ".tm-fila-liquidacion", function() { 

    // console.log('click en tablaLiquidaciones');

      // obtengo la fila seleccionada (tr )donde se hizo el click
      let tabla = document.getElementById("tablaLiquidaciones");  
      let fila = $(this).closest('tr')[0];   // guarda la fila seleccionada
      // console.log(fila);

      let tds = fila.querySelectorAll("td");

      const liquidacion = new Liquidacion({
        id: parseInt(fila.querySelector(".tm-col-id").innerText.replace('#','')),
        periodo: fila.querySelector(".tm-col-periodo").innerText,
        descripcion: fila.querySelector(".tm-col-descripcion").innerText,
        idTipoLiquidacion: parseInt(fila.querySelector(".tm-col-idTipoLiquidacion").innerText),    // oculto
        // tipoLiquidacion: fila.querySelector(".tm-col-tipoLiquidacion").innerText,
        estado: fila.querySelector(".tm-col-estado").innerText.toLowerCase(),
        fechaPago: fila.querySelector(".tm-col-fechaPago").innerText
      }); 

      // console.log(liquidacion);
      
      if (liquidacion.estado == "abierta") {
        // console.log(`objLiquidacion: ${JSON.stringify(liquidacion)}`);
        sessionStorage.setItem("objLiquidacion", JSON.stringify(liquidacion));
        // console.log('window.location.href = "edit-liquidacion.html"');
        window.location.href = getBaseUrl() + '/pages/edit-liquidacion.html';
      }
  });

  // anula el evento click para el checkbox
  $(document).on("click", ".tm-col-checkbox", function(e) { 

    // console.log('se hizo click en "tm-col-checkbox"');
    e.stopPropagation() 
  });

  // anula el evento click para el boton delete
  $(document).on("click", ".tm-col-delete", function(e) { 

    // console.log('se hizo click en "tm-col-delete"');
    e.stopPropagation(); 
    
    // console.log('va a ejecutar eliminarLiquidacion()...');

    // obtengo la fila seleccionada (tr )donde se hizo el click
    let fila = e.target.parentNode.parentNode.parentNode;
    console.log('fila: ', fila);
    let id = parseInt(fila.querySelector(".tm-col-id").innerText.replace('#',''));
    // console.log('id: ', id);
    // elimina la fila del array y actualiza el localStorage
    const liquidaciones = new LiquidacionController();
    liquidaciones.eliminar(id);
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
    toastr.success('El registro fue eliminado con éxito...','Eliminar liquidación');
  });

  // cambia el color de fila editable
  $(document).on("mouseover", ".tm-fila-liquidacion", function(e) { 

    // console.log('se hizo click en "onmouseover"');
    let estado = this.querySelector(".tm-col-estado").innerText;
    // console.log('mouseover on: ', estado);
    if (estado == 'Abierta') {
      $(this).css({
        'background-color': '#6987a5'
      });
    }
  });

  // restaura el color de fila editable
  $(document).on("mouseout", ".tm-fila-liquidacion", function(e) { 

    // console.log('se hizo click en "onmouseover"');
    $(this).css({
      'background-color': '#4f667c'
    });
  });

});


export { armarTablaHTML };
