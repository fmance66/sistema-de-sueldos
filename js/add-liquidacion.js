/* 
    Proyecto Final: Interprete de fórmulas tipo Excel
*/

import { Liquidacion } from './models/liquidacion.js';
import { LiquidacionController } from './controllers/liquidacionController.js';
import { TipoLiquidacionController } from './controllers/tipoLiquidacionController.js';


// carga los datos de la liquidacion desde sessionStorage
const cargarDatosLiquidacion = () => {

  // carga el select de tipo de liquidaciones desde el json
  let tipoLiquidacionSelect = document.querySelector('#selTipoLiquidacion');
  const tipoLiquidaciones = new TipoLiquidacionController();
  tipoLiquidaciones.getAll().forEach(function(tipoLiquidacion) {
    let opcion = document.createElement('option');
    opcion.value = tipoLiquidacion.id;
    opcion.text = tipoLiquidacion.descripcion;
    tipoLiquidacionSelect.add(opcion);
  });

  // propone el primer tipo de liquidacion como default
  tipoLiquidacionSelect.value = tipoLiquidaciones.tipoLiquidaciones[0].id;
  
  // busca el tipo de liquidacion segun el idTipoLiquidacion
  tipoLiquidacionSelect = document.querySelector('#selTipoLiquidacion');
  // console.log(tipoLiquidacionSelect.value);
  let tipoLiquidacion = tipoLiquidaciones.get(tipoLiquidacionSelect.value);
  
  // console.log(tipoLiquidacion);

  // asigna valores por defecto
  document.querySelector("#id").value = 0;
  document.querySelector("#selTipoLiquidacion").value = tipoLiquidacion.id;
  document.querySelector("#periodo").value = "";
  document.querySelector("#descripcion").value = "";
  document.querySelector("#fechaPago").value = "";
  document.querySelector("#estado").value = "abierta";
};

window.onload=cargarDatosLiquidacion();

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
        $(this).datepicker('setDate', new Date(anio, mes, 1)).trigger('change');
        // $(this).datepicker('setDate', new Date(anio, mes, 1));
        $(this).datepicker('widget').removeClass('hide-month hide-current hide-calendar');
      }        
  })
});

// datepicker para fechas (jquery)
$(function() {
  $(".ui-datepicker-calendar").show();
  $(".datepicker").datepicker({
    dateFormat: 'dd/mm/yy',
    gotoCurrent: true
  });
});

$(function() {
  $("#btnAgregar").click(function() {
    // console.log('hizo click en agregar!!!');
    const liquidaciones = new LiquidacionController();
    const liquidacion = new Liquidacion({
      id: liquidaciones.getUltId() + 1,
      periodo: document.querySelector("#periodo").value,
      fechaPago: document.querySelector("#fechaPago").value,
      descripcion: document.querySelector("#descripcion").value,
      idTipoLiquidacion: parseInt(document.querySelector("#selTipoLiquidacion").value),
      estado: "abierta"
    }); 
    // console.log(liquidacion);

    // agrega la liquidacion en el array global y el localStorage
    liquidaciones.agregar(liquidacion);

    // mensaje de exito
    toastr.success('El registro fue agregado con éxito...','Alta liquidación');

    // limpia el formulario
    cargarDatosLiquidacion();
  });
});

