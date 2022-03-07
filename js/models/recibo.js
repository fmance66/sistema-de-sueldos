/* 
    Proyecto Final: Interprete de fórmulas tipo Excel
*/
  
class Recibo {

  constructor (recibo) {
    this.id = recibo.id;
    this.legajo = recibo.legajo;
    this.idLiquidacion = recibo.idLiquidacion;
    this.estado = recibo.estado;
    this.totalRemunerativo = recibo.totalRemunerativo;
    this.totalDeducciones = recibo.totalDeducciones;
    this.totalNoRemunerativo = recibo.totalNoRemunerativo;
    this.totalNeto = recibo.totalNeto;
    this.conceptos = recibo.conceptos;
  }
  
  mostrar() {
      return (
      `{ id: ${this.id}, legajo: ${this.legajo}, idLiquidacion: ${this.idLiquidacion},` + 
      ` estado: ${this.estado}, bruto: ${this.bruto}, descuento: ${this.descuento}, neto: ${this.neto} }`
      )
  }
}     // fin de class Recibo


export { Recibo };
