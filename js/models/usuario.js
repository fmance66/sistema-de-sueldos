/* 
    Proyecto Final: Interprete de fórmulas tipo Excel
*/
  
class Usuario {

  constructor (usuario) {
    this.id = usuario.id;
    this.nombre = usuario.nombre;
    this.cuil = usuario.cuil;
    this.estado = usuario.estado;
    this.password = usuario.password;
    this.fechaUltLogon = usuario.fechaUltLogon;
    this.idPerfil = usuario.idPerfil;
    this.telefono = usuario.telefono;
    this.eMail = usuario.eMail;
  }

  mostrar() {
      `{ id: ${this.id}, nombre: ${this.nombre}, cuil: ${this.cuil}, estado: ${this.estado}` +
       ` password: ${this.password}, fechaUltLogon: ${this.fechaUltLogon}, idPerfil: ${this.idPerfil}` +
       ` telefono: ${this.telefono}, eMail: ${this.eMail}`
  }

}   

export { Usuario };
