/* 
    Proyecto Final: Interprete de fórmulas tipo Excel
*/

class Variable {

  constructor (variable) {
    this.id = variable.id;
    this.nombre = variable.nombre;
    this.valor  = variable.valor;
    this.idTipoVariable = variable.idTipoVariable;
    this.estado = variable.estado;
  }

  mostrar() {
      return (
      `{ id: ${this.id}, nombre: ${this.nombre}, valor: ${this.valor},` +
      ` idTipoVariable: ${this.idTipoVariable}, estado: ${this.estado} }`
      )
  }

}  

export { Variable };
