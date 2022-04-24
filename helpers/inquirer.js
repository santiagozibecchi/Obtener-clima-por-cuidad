const inquirer = require('inquirer');
require('colors');

const preguntas = [
      {
            type: 'list',
            name: 'opcion',
            message: '¿Qué desea hacer?',
            choices: [
                  {
                        value: 1,
                        name: `${'1'.cyan}. Buscar cuidad`
                  },
                  {
                        value: 2,
                        name: `${'2'.cyan}. Historial`
                  },
                  {
                        value: 0,
                        name: `${'0'.cyan}. Salir`
                  },
            ]
      }
];

// Para mostrar en el menu principal:
const inquirerMenu = async () => {

      console.clear();
      console.log('======================='.cyan);
      console.log(' Seleccione una opcion'.green);
      console.log('=======================\n'.cyan);

      // El argumento preg. se define anteriormente, son las prompt que vera el usuario. Promesa por eso el await.
      const {opcion} = await inquirer.prompt(preguntas);

      return opcion;
}


// Nos permite pausar el ciclo ya que espera un INPUT (una accion del usuario):
const inquirerPausa = async() => {

      const pausar = [
            {
                  type: 'input',
                  name: 'pausar',
                  // Mensaje que se muestra en consola:
                  message: `Presione ${'ENTER'.cyan} para continuar`
            }
      ]

      console.log('\n');
      const pausa = await inquirer.prompt(pausar);
      return pausa;
}

// Esta accion valida que el usuario escriba al menos una letra para poder ejecutar el codigo siguiente:
const leerInput = async(message) => {

      const question = [
            {
                  type: 'input',
                  name: 'desc',
                  message,
                  validate(value) {
                        if (value.length === 0) {
                              return 'Por favor ingrese un valor';
                        }
                        return true;
                  }

            }
      ]

      const {desc} = await inquirer.prompt(question);
      return desc;
}


// Esto tiene que ser un menu para mostrar las cuidades
const listarLugares = async(lugares=[]) => {

      // Para manipular la informacion y crear el arreglo
      // Muestro en consola las opciones de las cuidades
      // map devuelve arreglo y index como segundo parametro:
      const choices = lugares.map((lugar, i) => {

            const idx = `${i+1}.`.cyan;

            return {
                  value: lugar.id,
                  name: `${idx} ${lugar.nombre}`
            }
      });

      // Agregar una opcion (string) al inicio:
      choices.unshift({
            value: '0',
            name: '0.'.cyan + ' Presione enter para volver al menu principal'
      })

      const preguntas = [
            {
                  type: 'list',
                  name: 'id',
                  message: 'Seleccione lugar:',
                  choices
            }
      ]

      const {id} = await inquirer.prompt(preguntas);
      return id;

}

// Para mostrar una confirmacion al usuario:
const confirmar = async(message) =>{

      const question = [
            {
                  type: 'confirm', // Regresa un valor bool.
                  name: 'ok',
                  message
            }
      ];

      const {ok} = await inquirer.prompt(question);
      return ok;
}

const mostrarListadochecklist = async (tareas = []) => {

      // Para manipular la informacion y crear el arreglo
      // Muestro en consola las opciones para borrar al usuario
      const choices = tareas.map((tarea, i) => {

            const idx = `${i + 1}.`.cyan;

            return {
                  value: tarea.id,
                  name: `${idx} ${tarea.desc}`,
                  checked: (tarea.completodaEn) ? true : false
            }
      });

      const pregunta = [
            {
                  type: 'checkbox',
                  name: 'ids',
                  message: 'Seleccione',
                  choices
            }
      ]

      const { ids } = await inquirer.prompt(pregunta);
      return ids;

}


module.exports = {
      inquirerMenu,
      inquirerPausa,
      leerInput,
      listarLugares,
      confirmar,
      mostrarListadochecklist
}