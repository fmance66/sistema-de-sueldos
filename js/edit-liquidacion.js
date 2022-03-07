/* 
    Proyecto Final: Interprete de fórmulas tipo Excel
*/

import { Liquidacion } from './models/liquidacion.js';
import { TipoLiquidacionController } from './controllers/tipoLiquidacionController.js';
import { LiquidacionController } from './controllers/liquidacionController.js';

 
// carga los datos de la liquidacion desde sessionStorage
const cargarDatosLiquidacion = () => {

  // obtiene los datos de la liquidacion desde el sessionStorage
  const liquidacion = new Liquidacion(
    JSON.parse(sessionStorage.getItem("objLiquidacion"))
  );

  // console.log(liquidacion);

  // busca el tipo de liquidacion segun el idTipoLiquidacion
  const tipoLiquidaciones = new TipoLiquidacionController();
  let tipoLiquidacion = tipoLiquidaciones.get(liquidacion.idTipoLiquidacion);

  // carga el select de tipo de liquidaciones desde el json
  let tipoLiquidacionSelect = document.querySelector('#selTipoLiquidacion');
  tipoLiquidaciones.getAll().forEach(function(tipoLiquidacion) {
    let opcion = document.createElement('option');
    opcion.value = tipoLiquidacion.id;
    opcion.text = tipoLiquidacion.descripcion;
    tipoLiquidacionSelect.add(opcion);
  });

  // asigna valores desde el objeto liquidacion
  document.querySelector("#id").value = liquidacion.id;
  document.querySelector("#selTipoLiquidacion").value = tipoLiquidacion.id;
  document.querySelector("#periodo").value = liquidacion.periodo;
  document.querySelector("#descripcion").value = liquidacion.descripcion;
  document.querySelector("#fechaPago").value = liquidacion.fechaPago;
  document.querySelector("#estado").value = liquidacion.estado;
}

$(function() {
    $('.periodpicker').datepicker({
        dateFormat: "mm/yy",
        changeMonth: true,
        changeYear: true,
        showButtonPanel: true,

        onClose: function(dateText, inst) {

          function isDonePressed(){
            return ($('#ui-datepicker-div').html().indexOf('ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all ui-state-hover') > -1);
          }

          if (isDonePressed()){
            let mes = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
            let anio = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
            $(this).datepicker('setDate', new Date(anio, mes, 1)).trigger('change');
            
            $('.periodpicker').focusout()  //Added to remove focus from datepicker input box on selecting date
          }
        },
        beforeShow : function(input, inst) {

            inst.dpDiv.addClass('month_year_datepicker');
            $(input).datepicker("widget").addClass('hide-month hide-current hide-calendar');

            let datestr = $(this).val();
            // console.log('datestr: ', datestr);

            if (datestr.length > 0) {
                let anio = datestr.substring(datestr.length - 4, datestr.length);
                let mes = datestr.substring(0, 2);
                $(this).datepicker('option', 'defaultDate', new Date(anio, mes - 1, 1));
                $(this).datepicker('setDate', new Date(anio, mes - 1, 1));
                $(".ui-datepicker-calendar").hide();
            }
        },
        onClose: function(dateText, inst) {
          let mes = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
          let anio = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
          // $(this).datepicker('setDate', new Date(anio, mes, 1)).trigger('change');
          $(this).datepicker('setDate', new Date(anio, mes, 1));
          $(this).datepicker('widget').removeClass('hide-month hide-current hide-calendar');
        }        
    })
});

// datepicker para fechas (jquery)
$(function() {
  $(".ui-datepicker-calendar").show();
  $(".datepicker").datepicker({
    dateFormat: 'dd/mm/yy'
  });
});

$(function() {
  $("#btnActualizar").click(function() {
    // console.log('hizo click en actualizar!!!');

    const liquidacion = new Liquidacion({
      id: parseInt(document.querySelector("#id").value),
      periodo: document.querySelector("#periodo").value,
      fechaPago: document.querySelector("#fechaPago").value,
      descripcion: document.querySelector("#descripcion").value,
      idTipoLiquidacion: parseInt(document.querySelector("#selTipoLiquidacion").value),
      estado: document.querySelector("#estado").value
    }); 

    // console.log(liquidacion);

    // actualiza liquidación en array y local storage
    const liquidaciones = new LiquidacionController();
    liquidaciones.actualizar(liquidacion);

    // muestra mensaje de exito
    toastr.success('El registro fue actualizado con éxito...','Actualizar liquidación');
  });
});

// carga los datos de la liquidación desde la sessionStorage
window.onload=cargarDatosLiquidacion();
