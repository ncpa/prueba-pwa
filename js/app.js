if ( navigator.serviceWorker ) {
    navigator.serviceWorker.register('/sw.js');
}
// //validamos que nuestro navegador soporte el manejo de cache
// if (window.caches){
// //     Abre el espacio de cache de nombre espacio-1 si no existe lo crea.
//     caches.open('espacio-1');
    
// //     /*Validando que un espacio de cache exista, el resultado es
// //     una promesa por lo que debemos atrapar el resultado en un .then
// //     que retornará un true o false*/
//     caches.has("espacio-1").then(console.log);

// //       Crearemos un nuevo espacio y lo abriremos
//     caches.open('cache-v1.1')
//     .then(cache=>{
//     /*indicamos que al contenido le agregaremos
//     el archivo index.html, en otras palabras estamos
//     guardando en cache nuestro html.*/
//         cache.add('/index.html');
//         cache.addAll([
//             '/index.html',
//             '/css/style.css',
//         '/img/main.jpg']).then(()=>{
//             /*Borramos el archivo css, como los procesos de cache
//             son promesas, el almacenamiento es mas lento que el borrado,
//             por ello debemos indicar que el borrado se elimine hasta
//             terminar el proceso anterior, es por ello que lo colocamos
//             dentro del then de la función addAll
//             */
//             cache.delete('/css/style.css');
// //             El método pud permite sobreescribir el contenido de un archivo
//             cache.put('index.html', new Response('Index Modificado'));
//         });

// //         Leemos de consola el archivo index si existe
//         cache.match('/index.html')
//         .then(respuesta => {
//             // Si existe se retorna en respuesta y la imprimimos en consola
//             respuesta.text().then(console.log);
//         });

//     });
//     caches.keys().then(console.log);
// }