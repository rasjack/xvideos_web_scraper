# xvideos_web_scraper
Dependencias y funcionamiento:

- request para las peticiones HTTP.
- cheerio para analizar y extraer la información necesaria del HTML obtenido.

Éste script, hace una petición inicial mediante la cual obtiene el número de paginas de los resultados.
Luego hace una petición por cada página, usando un ciclo for, en cada petición se analiza y obtiene la información requerida del html, que es título, imagen y url de cada video.
Se almacena ésta información en un arreglo.
Mediante el uso de un contador, identifica cuando se ha procesado la última petición y entonces crea el archivo HTML recorriendo el arreglo donde se almacenó la información.

Los videos no están ordenados igual que en el sitio de xvideos.com, pues las peticiones al ser asíncronas teminan a velocidades distintas.


Observaciones:

 - El script obtiene la información mediante una petición HTTP, pero el sitio de xvideos.com carga contenido mediante javascript.
   Ésto es un problema por ejemplo para la imagen (vista en miniatura/thumbnail) ya que se carga dinámicamente con javascript.
   Por suerte, xvideos.com tiene un html opcional en caso de que el cliente tenga desactivado javascript en su navegador.
   y ahí aparece un atributo que contiene la url de la imagen, debe de ser algún servidor caché pues algunas imagenes no están disponibles.
   
 - Algunos sitios pueden tener configurado su servidor para bloquear la IP al recibir un número determinado de peticiones en un periodo de tiempo específico.
   De momento al menos, no aplica para xvideos.com, pues hice una prueba con una modelo, donde las páginas de resultados fueron 149, entonces esto equivale
   a 150 peticiones HTTP en menos de un minuto.
   
 - Xvideos.com no tiene restringido el acceso a sus thumbnails desde fuera de sus servidores, de lo contrario, no podría mostrar las imágenes en el HTML que se genera
   con éste script, pero eso puede cambiar con el tiempo, o se puede presentar en otros sitios web.  
