var vCheerio = require('cheerio');
var vRequest = require('request');

// probar con los siguientes nombres: Jailyne Ojeda, Maria Ozawa, Beata Undine para analizar el paginado de los resultados en xvideos.
var nombreModelo = 'Jailyne Ojeda';
var nombreModelo2 = nombreModelo.split(' ').join('+');
var numPaginas = 0;
var videos = [];
var vURL = 'https://www.xvideos.com/?k='+nombreModelo2+'&p=';
var pagActualOA = 0;

// INICIA FUNCIÓN QUE EXTRAE EL CONTENIDO
var fnExtraeContenido = function(parametroUrl){

    vRequest(parametroUrl,function(error,respuesta,html){

        if(!error && respuesta.statusCode == 200){

            var $ = vCheerio.load(html);
            $('.thumb-block').each(function(i,elemento){
                var vTituloVideo = $(elemento).children('.thumb-under').eq(0).children('.title').children('a').eq(0).text();
                if(vTituloVideo.trim() == ''){ return true; }
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

            fs.writeFile('resultados_scraping.html', resultadoHTML, function (err){
                if (err) throw err;
                console.log(tituloHTMLres);
                console.log('Se creo un archivo HTML llamado: resultados_scraping.html, en el se puede ver título, imagen de vista previa  y url de cada video. ');
            });
        }
    });
}
// TERMINA FUNCIÓN QUE EXTRAE EL CONTENIDO



// INICIA FUNCIÓN QUE OBTIENE EL NUMERO DE PAGINAS DEL RESULTADO
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

                for(var k=1;k<=numPaginas;k++){
                    if(k==1){ fnExtraeContenido(vURL); }
                    else if(k>1){ fnExtraeContenido(vURL+k); }
                }
            }
            // console.log(numPaginas);
        }
    });
}
// TERMINA FUNCIÓN QUE OBTIENE EL NUMERO DE PAGINAS DEL RESULTADO
fnObtienePaginado(vURL);