/* 
    Proyecto Final: Interprete de fórmulas tipo Excel
*/
  
class Empleado {

  constructor (empleado) {
    this.legajo = empleado.legajo;
    this.nombre = empleado.nombre;
    this.cuil = empleado.cuil;
    this.estado = empleado.estado;
    this.fechaIngreso = empleado.fechaIngreso;
    this.idCategoria = empleado.idCategoria;
    this.obraSocial = empleado.obraSocial;
    this.telefono = empleado.telefono;
    this.eMail = empleado.eMail;
    this.domicilio = empleado.domicilio;
  }

  mostrar() {
      `{ legajo: ${this.legajo}, nombre: ${this.nombre}, cuil: ${this.cuil}, estado: ${this.estado}` +
       ` fechaIngreso: ${this.fechaIngreso}, idCategoria: ${this.idCategoria}, obraSocial: ${this.obraSocial}` +
       ` telefono: ${this.telefono}, eMail: ${this.eMail}, domicilio: ${this.domicilio}`
  }

}       // fin class Empleado

export { Empleado };
