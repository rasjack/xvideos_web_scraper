// EJERCICIO DE PROGRAMACIÓN: XVIDEOS SCRAPER.
// AUTOR: ABEL PICENO GUTIÉRREZ. 29 de Julio de 2020.
/*
Dependencias:
- request para las peticiones HTTP.
- cheerio para analizar y extraer la información necesaria del HTML obtenido.

El codigo hace una petición inicial mediante la cual obtiene el número de paginas de los resultados.
Luego hace una petición por cada página, usando un ciclo for, en cada petición se analiza y obtiene la información requerida del html, que es título, imagen y url de cada video.
Se almacena ésta información en un arreglo.
Mediante el uso de un contador, identifica cuando se ha procesado la última petición y entonces crea el archivo HTML recorriendo el arreglo donde se almacenó la información.

Los videos no están ordenados igual que en el sitio de xvideos.com, pues las peticiones al ser asíncronas teminan a velocidades distintas.

Hay muchos más aspectos a considerar, por ejemplo, mi codigo obtiene la información mediante una petición HTTP, pero el sitio de xvideos.com carga contenido mediante javascript.
Ésto es un problema por ejemplo para la imagen (vista en miniatura/thumbnail) ya que se carga dinámicamente con javascript.
Por suerte, xvideos.com tiene un html opcional en caso de que el cliente tenga desactivado javascript en su navegador
y ahí aparece un atributo que contiene la url de la imagen, debe de ser algún servidor caché pues algunas imagenes no están disponibles.
*/

var vCheerio = require('cheerio');
var vRequest = require('request');


// probar con los siguientes nombres: Jailyne Ojeda, Maria Ozawa, Beata Undine para analizar el paginado de los resultados en xvideos.
var nombreModelo = 'Jailyne Ojeda';

var nombreModelo2 = nombreModelo.split(' ').join('+');


var numPaginas = 0;
var videos = [];



var vURL = 'https://www.xvideos.com/?k='+nombreModelo2+'&p=';















var pagActualOA = 0;

// INICIA FUNCIÓN QUE EXTRAE EL CONTENIDO ###########################################################################################################
// INICIA FUNCIÓN QUE EXTRAE EL CONTENIDO ###########################################################################################################
// INICIA FUNCIÓN QUE EXTRAE EL CONTENIDO ###########################################################################################################
var fnExtraeContenido = function(parametroUrl){





vRequest(parametroUrl,function(error,respuesta,html){





if(!error && respuesta.statusCode == 200){


var $ = vCheerio.load(html);



$('.thumb-block').each(function(i,elemento){

var vTituloVideo = $(elemento).children('.thumb-under').eq(0).children('.title').children('a').eq(0).text();

if(vTituloVideo.trim() == ''){ return true;}

var vImagenVideo = $(elemento).children('.thumb-inside').eq(0).children('.thumb').children('a').eq(0).children('img').eq(0).attr('data-src');
var vUrlVideo = 'https://www.xvideos.com'+$(elemento).children('.thumb-under').eq(0).children('.title').children('a').eq(0).attr('href');

videos.push({titulo:vTituloVideo,imagen:vImagenVideo,url:vUrlVideo});



});
pagActualOA++;


}



// si la página actual es igual al número de paginas (la última página), entonces creamos el archivo HTML.
if(pagActualOA == numPaginas)
{

var videosTotales = videos.length;
var tituloHTMLres = 'Se encontraron '+videosTotales+' videos en '+numPaginas+' páginas de resultados que conciden con la búsqueda de '+nombreModelo;

var resultadoHTML = '<html>\n<head>\n</head>\n<body style="text-align:center;">\n<h1>Scrapping de xvideos.com - Resultados<br>'+tituloHTMLres+'</h1>\n';

videos.forEach(o => {

resultadoHTML = resultadoHTML+'\n\n<div>\n<span><b>'+o.titulo+'</b></span>\n<br>\n<img src="'+o.imagen+'">\n<br>\n<a href="'+o.url+'">'+o.url+'</a>\n</div>\n<br><br>\n\n';

// console.log(o.titulo);
// console.log(o.imagen);
// console.log(o.url);

});


resultadoHTML = resultadoHTML+'</body>\n</html>';

var videosTotales = videos.length;

var fs = require('fs');

fs.writeFile('resultados_scraping.html', resultadoHTML, function (err) {
if (err) throw err;

console.log(tituloHTMLres);
console.log('Se creo un archivo HTML llamado: resultados_scraping.html, en el se puede ver título, imagen de vista previa  y url de cada video. ');
});


}


});






}
// TERMINA FUNCIÓN QUE EXTRAE EL CONTENIDO ##########################################################################################################
// TERMINA FUNCIÓN QUE EXTRAE EL CONTENIDO ##########################################################################################################
// TERMINA FUNCIÓN QUE EXTRAE EL CONTENIDO ##########################################################################################################






// INICIA FUNCIÓN QUE OBTIENE EL NUMERO DE PAGINAS DEL RESULTADO ####################################################################################
// INICIA FUNCIÓN QUE OBTIENE EL NUMERO DE PAGINAS DEL RESULTADO ####################################################################################
// INICIA FUNCIÓN QUE OBTIENE EL NUMERO DE PAGINAS DEL RESULTADO ####################################################################################
var fnObtienePaginado = function(parametroUrl){





vRequest(parametroUrl,function(error,respuesta,html){





if(!error && respuesta.statusCode == 200){

var $ = vCheerio.load(html);

numPaginas = $('.pagination').eq(0).children('ul').eq(0).children('li').length;

if (numPaginas == 0){ return console.log('No hay resultados para la busqueda de la modelo actual, no hay más que hacer de momento.'); }


else if (numPaginas == 1){
fnExtraeContenido(vURL);
}

else if (numPaginas > 1){



var penultimoLi = numPaginas-2;
// console.log(penultimoLi);

numPaginas = $('.pagination').eq(0).children('ul').eq(0).children('li').eq(penultimoLi).children('a').eq(0).text();

numPaginas = parseInt(numPaginas);

// console.log(numPaginas);



for(var k=1;k<=numPaginas;k++)
{
if(k==1){ fnExtraeContenido(vURL); }
else if(k>1){ fnExtraeContenido(vURL+k); }
}


}


// console.log(numPaginas);




}


});






}
// TERMINA FUNCIÓN QUE OBTIENE EL NUMERO DE PAGINAS DEL RESULTADO ###################################################################################
// TERMINA FUNCIÓN QUE OBTIENE EL NUMERO DE PAGINAS DEL RESULTADO ###################################################################################
// TERMINA FUNCIÓN QUE OBTIENE EL NUMERO DE PAGINAS DEL RESULTADO ###################################################################################

fnObtienePaginado(vURL);