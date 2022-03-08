/* 
    Proyecto Final: Interprete de fórmulas tipo Excel
*/

import { Recibo } from './models/recibo.js';
import { ConceptoController } from './controllers/conceptoController.js';
import { EmpleadoController } from './controllers/empleadoController.js';
import { LiquidacionController } from './controllers/liquidacionController.js';
import { TipoConceptoController } from './controllers/tipoConceptoController.js';

// carga tabla de conceptos de recibo dinamica
const armarTablaHTML = (idTabla, listaConceptosRecibo) => {

  console.log('conceptos: ', listaConceptosRecibo);

  let tablaConceptos = document.querySelector(idTabla);

  let tbody = document.createElement("tbody");  
  tbody.setAttribute("id", "tablaConceptosReciboBody");
  tablaConceptos.appendChild(tbody);

  for (const conceptoRecibo of listaConceptosRecibo) {

    // console.log('conceptoRecibo: ', conceptoRecibo);

    let tr = document.createElement("tr");

    // columna de checkbox
    let td = document.createElement("td");
    td.innerHTML = '<input type="checkbox" />';
    td.classList.add("tm-col-checkbox");
    tr.appendChild(td);

    // busca el concepto segun el id del concepto
    const conceptoController = new ConceptoController();
    let concepto = conceptoController.get(conceptoRecibo.id);
    // console.log('concepto: ', concepto);

    // busca el tipoConcepto segun el concepto
    const tipoConceptos = new TipoConceptoController();
    let tipoConcepto = tipoConceptos.get(concepto.tipoConcepto);
    // console.log('tipoConcepto: ', tipoConcepto);

    for (let e in conceptoRecibo) {

        if (conceptoRecibo.hasOwnProperty(e)) {

          // console.log(e);
            
          let td = document.createElement("td");
            
          // if (e == 'id') {     // los id no los muestra, estan ocultos
          //     td.classList.add("oculto");
          // }
            
          if (e == 'id') {
              // carga id
              td.classList.add("tm-concepto-bold", "tm-col-concepto", `tm-col-${e}`);
              td.style.cursor = "pointer";
              td.innerHTML = conceptoRecibo[e];
              tr.appendChild(td);
              // y carga descripcion
              td = document.createElement("td");
              td.classList.add("tm-concepto-bold", "tm-col-concepto", "tm-col-descripcion");
              if ((concepto.mostrado == null) || (concepto.mostrado == "")) {
                td.innerHTML = concepto.descripcion; 
              } else {
                td.innerHTML = concepto.mostrado; 
              }
          } else {
            
            if (e == 'resultado') {                 // asigna el resultado a la columna haber o deduccion

              let haber = 0.00;
              let deduccion = 0.00;

              // console.log('tipoConcepto.operacion: ', tipoConcepto.operacion);

              switch (tipoConcepto.operacion) {
                case '+':
                  haber = conceptoRecibo[e];
                  break;
                case '-':
                  deduccion = conceptoRecibo[e];
                  break;
              }
              
              // console.log(haber, deduccion);

              td = document.createElement("td");
              td.classList.add("tm-col-concepto", "tm-col-haber");
              td.innerHTML = haber.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
              td.style.textAlign = "right";
              tr.appendChild(td);

              td = document.createElement("td");
              td.classList.add("tm-col-concepto", "tm-col-deduccion");
              td.innerHTML = deduccion.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
              td.style.textAlign = "right";

            } else {
              td.classList.add(`tm-col-${e}`);         // agrega clase con el nombre del atributo
              td.innerHTML = conceptoRecibo[e];
            }
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


// carga los datos del recibo desde sessionStorage
const cargarDatosRecibo = () => {

  // obtiene los datos del recibo desde el sessionStorage
  const recibo = new Recibo(
    JSON.parse(sessionStorage.getItem("objRecibo"))
  );

  // console.log(recibo);
  // console.log(recibo.conceptos[0]);

  // asigna valores desde el objeto recibo
  const liquidaciones = new LiquidacionController();          // busca la liquidacion segun el idLiquidacion
  let liquidacion = liquidaciones.get(recibo.idLiquidacion);
  console.log(liquidacion.descripcion);
  // console.log(document.querySelector("#descripcionLiquidacion"));
  document.querySelector("#descripcionLiquidacion").innerHTML = liquidacion.descripcion;
  document.querySelector("#id").value = recibo.id;
  document.querySelector("#legajo").innerHTML = recibo.legajo;
  const empleados = new EmpleadoController();                // busca el empleado segun el legajo
  let empleado = empleados.get(recibo.legajo);
  console.log(empleado.nombre);
  document.querySelector("#nombre").innerHTML = empleado.nombre;
  document.querySelector("#estado").value = recibo.estado;
  document.querySelector("#totalRemunerativo").innerHTML = recibo.totalRemunerativo;
  document.querySelector("#totalDeducciones").innerHTML = recibo.totalDeducciones;
  document.querySelector("#totalNoRemunerativo").innerHTML = recibo.totalNoRemunerativo;
  document.querySelector("#totalNeto").innerHTML = recibo.totalNeto;

  // armar tabla de recibos de conceptos
  armarTablaHTML("#tablaConceptosRecibo", recibo.conceptos);

}

// datepicker para fechas (jquery)
$(function() {
  $("#fechaNacimiento").datepicker({
    defaultDate: "01/02/2022"
  });
});


// carga los datos del recibo desde la sessionStorage
window.onload=cargarDatosRecibo();

