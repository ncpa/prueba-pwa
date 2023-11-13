const CACHE = 'cache-1';
const CACHE_DINAMICO = 'dinamico-1';
const CACHE_ESTATICO = 'estatico-1';
const CACHE_INMUTABLE = 'inmutable-1';

//Indicamos que durante el proceso de instalación
self.addEventListener('install', evento=>{
    /*Promesa que crea el proceso de creación del espacio
    en cache y agrega los archivos necesarios para cargar nuestra
    aplicación*/
    const promesa =caches.open(CACHE)
        .then(cache=>{
            return cache.addAll([
                '/',
                '/index.html',
                '/css/style.css',
                '/img/main.jpg',
                '/js/app.js',
                '/img/no-img.jpg'
            ]);
        });
        //Separamos los archivo que no se modificarán en un espacio de cache inmutable
        const cacheInmutable = caches.open(CACHE_INMUTABLE)
            .then(cache => {
                cache.add('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css');
            });

        //Indicamos que la instalación espere hasta que la promesa se cumpla
        evento.waitUntil(Promise.all([promesa, cacheInmutable]));
});



self.addEventListener('fetch', evento =>{

    let rechazada = false;

    //si ninguna de las dos puede responder en lugar de retornar
    //el error 404 o el dinosaurio del navegador, retornaremos una imagen
    //o el texto de rechazo
    const falloUnaVez = ()=>{
        if(rechazada){
            if(/\.(png|jpg)$/i.test(evento.request.url)){
                resolve(caches.match('/img/no-img.jpg'))
            } else{
                reject('No se encontró respuesta');
            }
        }else{
            rechazada =  true;
        }
    };
    //respuesta de la web
    fetch(evento.request).then(res =>{
        res.ok ? resolve(res) : falloUnaVez();
    }).cath(falloUnaVez);

    //respuesta de caché
    caches.match(evento.request).then(res =>{
        res ? resolve(res) : falloUnaVez();
    }).catch(falloUnaVez);

    evento.respondWith(respuesta);
    
    // Estrategia 4 CACHE WITH NETWORK UPDATE
    //Abre caché
    /*const respuesta = caches.open(CACHE)
        .then(cache =>{
            // en segundo plano se recupera la versión actual de la web
            fetch(evento.request)
                .then(resp=>{
                    //se actualizan los cambios
                    cache.put(evento.request, resp);
                });
            //retorna la petición con lo encontrado en caché
            return cache.match(evento.request);
        });
    //retornamos la respuesta
    evento.respondWith(respuesta);

    //si lo que se busca es el estilo de bootstrap, como se encuentra
    // en otra sección de caché lo enviamos como respuesta individual
    if(evento.request.url.includes('bootstrap')){
        evento.respondWith(caches.match(evento.request));
    }*/

    // Estrategia 3 NETWORK WITH CACHE FALLNACK
    /*const respuesta = fetch(evento.request)
        .then(resp=>{
            //subimos el archivo recuperado a cache
            caches.open(CACHE_DINAMICO)
                .then(cache =>{
                    cache.put(evento.request, resp);
                    limpiarCache(CACHE_DINAMICO, 20);
                });
            //retornamos la respuesta de la web
            return resp.clone();
        }).catch(() =>{
            //si no se puede recuperar de la web se busca en caché
            return caches.match(evento.request);
        });
        // retornamos la respuesta
        evento.respondWith(respuesta);*/


    //Estrategia 2 CACHE WITH NETWORK FALLBACK
    /*const respuesta = caches.match(evento.request)
        .then(res =>{
            //si el archivo existe en caché retornalo
            if(res) return res;
            //si no existe deberá ir a la web
            //Imprimimos en consola para saber que no se encontró
            //en caché
            console.log('No existe', evento.request.url);
            //Retorna la respuesta a la petición localizada en la web
            return fetch(evento.request)
                .then(resWeb => { //el archivo recuperado se almacena en resWeb
                    //se abre nuestro cache
                    caches.open(CACHE_DINAMICO)
                        .then(cache =>{
                            //se sube el archvo descargado de la web
                            cache.put(evento.request, resWeb);
                            /** 
                             * Mandamos llamar la limpieza al cargar un nuevo archivo
                             * estamos indicando que se limpiará el caché dinámico
                             * y que sólo debe haber 2 archivos
                             */
                            /*limpiarCache(CACHE_DINAMICO, 2);
                        });
                    //se retorna el archivo recuperado para visualizar la página
                    return resWeb.clone();
                })
        });
        evento.respondWith(respuesta);*/

    //Estrategia 1 CACHE ONLY

    /*busca en el dominio del almacenamiento cache el archivo que coincide
    con la petición que hace nuestro sitio, es decir, siempre regresaremos
    como respuesta el archivo de cache */
    // evento.respondWith(caches.match(evento.request));
});

// recibimos el nombre del espacio de cache a limpiar y el número de archivos permitido
function limpiarCache(nombreCache, numeroItems){
    //abrimos caché
    caches.open(nombreCache)
        .then(cache =>{
            // recuperamos el arreglo de archivos existentes en el espacio de caché
            return cache.keys()
                .then(keys =>{
                    //si el número de archivos supera el límite permitido
                    if(keys.length>numeroItems){
                        //eliminamos el más antiguo y repetimos el proceso
                        cache.delete(keys[0])
                            .then(limpiarCache(nombreCache, numeroItems));
                    }
                });
        });
}
