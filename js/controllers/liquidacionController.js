/* 
    Proyecto Final: Interprete de fórmulas tipo Excel
*/

import * as formula from '../formula.js';

import { Liquidacion } from '../models/liquidacion.js';
import { Recibo } from '../models/recibo.js';
import { CategoriaController } from './categoriaController.js';
import { ConceptoController } from './conceptoController.js';
import { EmpleadoController } from './empleadoController.js';
import { TipoLiquidacionController } from './tipoLiquidacionController.js';
import { ReciboController } from './reciboController.js';

const urlJson = '../../data/liquidaciones.json';
const lsName = "lsLiquidaciones";


class LiquidacionController {

  constructor () {

    // carga json de liquidaciones
      let jsonData = localStorage.getItem(lsName);
      // console.log(jsonData);
      let liquidaciones = [];

      // verifica si existe el json de liquidaciones en local storage
      if ((jsonData === undefined) || (jsonData == null)) {   // si no existe lo carga del json externo

          console.log('... cargando local storage de .json externo...');

          $.get(urlJson, function(data, estado) {
              if (estado === "success") {
                localStorage.setItem(lsName, JSON.stringify(data));
                // guarda en el array
                liquidaciones = data;
              }
          })
      } else {                                           // si existe lo parsea
          liquidaciones = JSON.parse(jsonData);
      };
      this.liquidaciones = liquidaciones.map(liquidacion => new Liquidacion(liquidacion));
    };

  // obtiene la liquidacion segun id
  get(id) {
    return this.liquidaciones.find(liquidacion => liquidacion.id == id);
  };

  // obtiene la lista de todas las liquidaciones
  getAll() {
    return this.liquidaciones;
  };
  
  getUltId() {
    return Math.max.apply(Math, this.liquidaciones.map(liquidacion => liquidacion.id));
  };

  guardar() {
    // console.log('liquidaciones.guardar', this.liquidaciones);
    localStorage.setItem(lsName, JSON.stringify(this.liquidaciones));
  };

  agregar(liquidacion) {

    // console.log('liquidaciones.agregar (antes)', this.liquidaciones);
    this.liquidaciones.push(liquidacion);
    // console.log('liquidaciones.agregar (despues)', this.liquidaciones);
    this.guardar();

    let ultIdLiquidacion = this.getUltId();

    // obtiene el tipo de liquidacion para generar los conceptos de los recibos
    const tipoLiquidaciones = new TipoLiquidacionController();
    let tipoLiquidacion = tipoLiquidaciones.get(liquidacion.idTipoLiquidacion);
    // console.log('tipoLiquidacion: ', tipoLiquidacion);

    // obtiene todos los empleados para generar los recibos
    const empleados = new EmpleadoController();

    // recorre la lista de empleados para generar un recibo por c/u
    empleados.getAll().forEach(function(empleado) {

        // console.log('empleado: ', empleado);
  
        // obtiene los datos del empleado para calculos como sueldo bruto, antiguedad con la fecha de ingreso, etc
        const categorias = new CategoriaController();
        let categoria = categorias.get(empleado.idCategoria);
        empleados.cargarVariablesEmpleado(empleado.legajo);

        let conceptosRecibo = [];
        let totalRemunerativo = 0;
        let totalDeducciones = 0;
        let totalNoRemunerativo = 0;
        let totalExcepcional = 0;
        let importeConcepto = 0;

        // calcula los conceptos del recibo desde el array de conceptos del tipo de liquidacion utilizando
        // el "simulador" de formulas
        tipoLiquidacion.conceptos.forEach(function(idConcepto) {
            // console.log('idConcepto: ', idConcepto);
            const conceptos = new ConceptoController();
            let concepto = conceptos.get(idConcepto);
            // console.log('concepto: ', concepto);
            let resultado = formula.calculoFormula(concepto.formula);
            importeConcepto = parseFloat(resultado);

            // console.log('importeConcepto: ' , typeof(importeConcepto), importeConcepto);

            switch (concepto.tipoConcepto) {
              case 1: 
                totalRemunerativo += importeConcepto;
                break;
              case 2:
                totalDeducciones += importeConcepto;
                break;
              case 3:
                totalNoRemunerativo += importeConcepto;
                break;
              case 4:
                totalExcepcional += importeConcepto;
                break;
              default:
                totalRemunerativo += importeConcepto;
                break;
              }

            conceptosRecibo.push({ id: concepto.id, 
                                   resultado: importeConcepto
                                 });
        });

        // armar el recibo
        // console.log('conceptosRecibo: ', conceptosRecibo);
        const recibos = new ReciboController();

        const recibo = new Recibo ({
          ID: 0,
          legajo: empleado.legajo,
          idLiquidacion: ultIdLiquidacion,
          estado: "activo",
          totalRemunerativo: totalRemunerativo,
          totalDeducciones: totalDeducciones,
          totalNoRemunerativo: totalNoRemunerativo,
          totalNeto: totalRemunerativo - totalDeducciones + totalNoRemunerativo,
          conceptos: conceptosRecibo
        });

        console.log('va a agregar el recibo: ', recibo);
        recibos.agregar(recibo);
    });
  };

  actualizar(liquidacion) {
    // console.log('liquidacion.actualizar (antes)', this.liquidaciones);
    let obj = this.liquidaciones.find((elemento, index) => {
        if (elemento.id == liquidacion.id) {
          this.liquidaciones[index] = liquidacion;
          // console.log('encontre --> ', liquidacion);
          return true;        // para de buscar
        }
    });
    // console.log('actualizarLiquidacion (despues)', this.liquidaciones);
    this.guardar();
  };

  eliminar(id) {

    // elimina los recibos de la liquidacion
    const recibos = new ReciboController();
    recibos.eliminarRecibosLiquidacion(id);

    // elimina la liquidacion
    console.log('va a eliminar liquidacion con id: ', id);
    this.liquidaciones = this.liquidaciones.filter(liquidacion => liquidacion.id !== id);
    this.guardar();
  };
}  

export { LiquidacionController };
