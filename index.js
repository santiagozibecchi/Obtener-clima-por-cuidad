require('dotenv').config()


const colors = require('colors');
const { leerInput, inquirerMenu, inquirerPausa, listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas')


const main = async () => {

      // Hacer Menu
      // instancia de mi clase fuera del ciclo: para que no se 
      // re-inicialice cada vez que se ejecute el ciclo.
      const busquedas = new Busquedas();

      let opt;

      do {
            // Muestra el menu en consola:
            opt = await inquirerMenu();

            // Espera a que el usuario ingrese un valor que se muestra en consola:
            switch (opt) {
                  case 1:
                        // ---- Mostrar mensaje
                        const termino = await leerInput('Cuidad: ');

                        // ---- Buscar los lugares
                        // lugares: es el arreglo de las 5 cuidades encontradas
                        const lugares = await busquedas.cuidad(termino);

                        // ---- Seleccionar lugar
                        const idSelec = await listarLugares(lugares);
                        if ( idSelec === '0') continue;
                        
                        const lugarSelec = lugares.find( cuidad => cuidad.id === idSelec);
                        // Sino selecciona el cero, en la sig. linea puede guardar en DB:
                        busquedas.agregarHistorial(lugarSelec.nombre);
                        
                        // ---- Clima
                        const clima = await busquedas.climaLugar(lugarSelec.Lat, lugarSelec.Lng);


                        // Mostrar resultados
                        console.clear();
                        console.log('\nInformacion de la cuidad\n'.cyan);
                        console.log('Cuidad: ', lugarSelec.nombre );
                        console.log('Lat: ', lugarSelec.Lat );
                        console.log('Lng: ', lugarSelec.Lng );
                        console.log('Temperatura: ', clima.temp);
                        console.log('Minima: ', clima.min);
                        console.log('Maxima: ', clima.max);
                        console.log('Como esta el clima: ', clima.desc);
                        break;
                  case 2:
                        // busquedas.historial.forEach((lugar, i) =>{
                        busquedas.historialCapitalizado.forEach((lugar, i) =>{
                              const idx = `${i + 1}.`.cyan;
                              console.log(`${idx} ${lugar}`);
                        } );
                        break;
                  case 0:
                        console.log('Presionaste salir');
                        break;
            }


            // Si el usuario presiona un valor distinto de cero (salir), retorna la funcion asincrona
            if (opt !== 0) await inquirerPausa()

      } while (opt !== 0);







}

main();