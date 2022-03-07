/* 
    Proyecto Final: Interprete de fórmulas tipo Excel
*/
  
class TipoConcepto {

    constructor(tipoConcepto) {
        this.id = tipoConcepto.id;
        this.descripcion = tipoConcepto.descripcion;
        this.operacion = tipoConcepto.operacion;
        this.estado = tipoConcepto.estado;
    }
    
    mostrar () {
      `{ id: ${this.id}, descripcion: ${this.descripcion}, operacion: ${this.operacion}, estado: ${this.estado} }`
    }
}
  

export { TipoConcepto };
