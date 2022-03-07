/* 
    Proyecto Final: Interprete de fórmulas tipo Excel
*/

class TipoLiquidacion {

  constructor (tipoLiquidacion) {
    this.id = tipoLiquidacion.id;
    this.descripcion = tipoLiquidacion.descripcion;
    this.conceptos = tipoLiquidacion.conceptos;
    this.estado = tipoLiquidacion.estado;
  }

  mostrar() {
      return (
        `{ id: ${this.id}, descripcion: ${this.descripcion}, conceptos: ${this.conceptos.join(', 3000')},` + 
        ` estado: ${this.estado} }`
      )
  }

}     


export { TipoLiquidacion };
