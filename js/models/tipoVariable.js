/* 
    Proyecto Final: Interprete de fórmulas tipo Excel
*/
  
class TipoVariable {

    constructor(tipoVariable) {
        this.id = tipoVariable.id;
        this.descripcion = tipoVariable.descripcion;
        this.estado = tipoVariable.estado;
    }

    mostrar () {
      `{ id: ${this.id}, descripcion: ${this.descripcion}, estado: ${this.estado} }`
    }
}
  

export { TipoVariable };
