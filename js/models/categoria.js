/* 
    Proyecto Final: Interprete de fórmulas tipo Excel
*/
  
class Categoria {

  constructor(categoria) {
    this.id = categoria.id;
    this.descripcion = categoria.descripcion;
    this.sueldoBruto = categoria.sueldoBruto;
    this.estado = categoria.estado;
  }

  mostrar() {
      `{ id: ${this.id}, descripcion: ${this.descripcion}, sueldoBruto: ${this.sueldoBruto}, estado: ${this.estado}  }`
  }
}
   
export { Categoria };
