/* 
    Proyecto Final: Interprete de fórmulas tipo Excel
*/

class Liquidacion {

  constructor (liquidacion) {
    this.id = liquidacion.id;
    this.periodo = liquidacion.periodo;
    this.descripcion = liquidacion.descripcion;
    this.idTipoLiquidacion = liquidacion.idTipoLiquidacion;
    this.estado = liquidacion.estado;
    this.fechaPago  = liquidacion.fechaPago;
  }

  mostrar() {
      return (
        `{ id: ${this.id}, periodo: ${this.periodo},descripcion: ${this.descripcion},` + 
        `  idTipoLiquidacion: ${this.idTipoLiquidacion}, estado: ${this.estado}, fechaPago: ${this.fechaPago} }`
        )
  }

}     

export { Liquidacion };
