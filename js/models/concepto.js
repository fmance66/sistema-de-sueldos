/* 
    Proyecto Final: Interprete de fórmulas tipo Excel
*/
  
class Concepto {

  constructor(concepto) {
    this.id = concepto.id;
    this.descripcion = concepto.descripcion;
    this.formula = concepto.formula;
    this.mostrado = concepto.mostrado;
    this.tipoConcepto = concepto.tipoConcepto;
    this.estado = concepto.estado;
  }

  mostrar = () => {
      `{ id: ${this.id}, descripcion: ${this.descripcion}, variable: ${this.formula},` +
      ` mostrado: ${this.mostrado}, tipoConcepto: ${this.tipoConcepto}, estado: ${this.estado}  }`
  }
}
   
export { Concepto };
