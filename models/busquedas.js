// Las notaciones de node van arriba de todo:
fs = require('fs');
// Terceros:
const axios = require('axios');

class Busquedas {

      historial = [];
      dbPath = './db/database.json';

      constructor() {
            //TODO: leer DB si existe
            this.leerDB();
      }

      get historialCapitalizado() {

            return this.historial.map(lugar => {

                  let palabras = lugar.split(' ');
                  palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));

                  return palabras.join(' ');
            });
      }

      // Solo va a retorna el objeto . Es un getter que siempre 
      // va a regresar la informacion establecida en el objeto
      // Por lo tanto, si tuviera otro endpoint puedo usar este get 
      // donde lo necesite.
      get paramsMapbox() {
            return {
                  'access_token': process.env.MAPBOX_KEY,
                  'limit': 5,
                  'language': 'es'
            }
      };

      // peticion asincrona
      async cuidad(lugar = '') {

            try {
                  // peticion http

                  const intance = axios.create({
                        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                        params: this.paramsMapbox
                  });

                  const resp = await intance.get();
                  // regreso un objeto de forma implicita ({})
                  // Utilizo un map porque este metodo me permite 
                  // regresar una nueva matriz con los resultados nombrados
                  // a mi manera
                  return resp.data.features.map(lugar => ({
                        id: lugar.id,
                        nombre: lugar.place_name,
                        Lng: lugar.center[0],
                        Lat: lugar.center[1]
                  }))

            } catch (error) {
                  return [];
            }

      }

      get paramsOWM() {
            return {
                  appid: process.env.OPENWEATHER_KEY,
                  units: 'metric',
                  lang: 'es',
            }
      };

      async climaLugar(lat, lon) {

            try {

                  // Crear instancia de axios: (peticion http)
                  const instance = axios.create({
                        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                        // Utilizando desestructuracion de objetos podemos realizar de la siguiente forma:

                        params: {
                              lat,
                              lon,
                              ... this.paramsOWM,
                        }

                        // Tambien se podria realizar de esta forma: Definiendo todos los parametros 
                        // en params:
                        // params: {
                        //       lat,
                        //       lon,
                        //       appid: process.env.OPENWEATHER_KEY,
                        //       units: 'metric',
                        //       lang: 'es'
                        // }
                  });

                  // resp. extraer la informacion que se encuentra en la data
                  const resp = await instance.get();

                  // console.log(resp);
                  // Con el cls veo el objeto, formato y propiedades para
                  // extraer las que me interesan.

                  const { weather, main } = resp.data;

                  return {
                        desc: weather[0].description,
                        min: main.temp_min,
                        max: main.temp_max,
                        temp: main.temp
                  }

            } catch (error) {
                  console.log(error);
            };

      }

      // Historial

      agregarHistorial(lugar = ' ') {

            // Prevenir duplicados:
            if (this.historial.includes(lugar.toLocaleLowerCase())) {
                  return;
            }

            // Limitar la cantidad de cuidades en el historial:
            this.historial = this.historial.slice(0, 5);

            this.historial.unshift(lugar.toLowerCase());

            // Guardar en DB
            this.guardarDB();
      }

      // Metodos para aplicar al historial:
      guardarDB() {

            // Si tuvieramos mas propiedades que grabar:
            const payload = {
                  historial: this.historial
            };

            fs.writeFileSync(this.dbPath, JSON.stringify(payload));

      }

      leerDB() {

            // Debe verificar que exista...

            if (!fs.existsSync(this.dbPath)) {
                  return null;
            }

            // Cargar info

            const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });
            const data = JSON.parse(info);

            this.historial = data.historial;
      }

}

// Solo cuando tiene una sola clase:
module.exports = Busquedas;