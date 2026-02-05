# Sistema de Sueldos

Sistema web para la gestión y cálculo de recibos de sueldo por empleado, desarrollado con HTML, CSS y JavaScript.

## 🌐 Sistema desplegado

👉 https://sistema-de-sueldos.onrender.com/pages/login.html

---

## 🔑 Acceso al sistema

Al ingresar, el sistema redirige a una página de login.

Credenciales de prueba:
- **Usuario:** admin  
- **Contraseña:** admin  

---

## 🧠 Funcionamiento general

Al iniciar por primera vez, el sistema carga automáticamente en el **localStorage** datos iniciales necesarios para su funcionamiento, como:
- Liquidaciones
- Recibos
- Variables
- Conceptos

Para comenzar a probar el sistema, se puede crear una nueva liquidación, por ejemplo **"Febrero 2022"**.

Dependiendo del tipo de liquidación seleccionada, el sistema:
- Calcula automáticamente los recibos
- Aplica los conceptos correspondientes
- Genera los recibos para todos los empleados cargados

Para visualizar los recibos:
1. Ingresar al menú **"Recibos"**
2. Seleccionar la liquidación deseada

---

## ⚠️ Estado del proyecto

El módulo de **empleados** no se encuentra finalizado.  
Los módulos que sí están implementados son:
- Liquidaciones
- Variables
- Recibos
