# Reloj- Mundial
Este proyecto obtiene la hora y fecha de una zona horaria especifica. Cuenta con una interfaz minimalista, inspirada en el anime Soul Eater (version anterior), y ahora con un fondo mas acorde. Funciona   mediante una API que consulta  todas las zonas horarias  disponibles y las muestra en un elemento select. Al elegir una zona, se realiza una segunda petición a la API para obtener la hora y la fecha correspondientes. 


## Objetivo

Comprender el funcionamiento de las APIs y aplicar estos conocimientos en un proyecto practico.



## Tecnologías Utilizadas

- HTML
- CSS
- Java Script
- Git
- GitHub
- TimeAPI (API para obtener información horaria)
- LocalStorage
- VITE

## Componentes y Funcionalidades

- **Selector de Zonas Horarias:** lista desplegable con todas las zonas horarias proporcionadas por **TimeApi.**
- **Boton:**   activa las funciones principales, incluyendo validaciones y peticiones a la API.
- **Cards dinamicas:** muestran: 
-Icono de dia/noche
-Hora 
-Fecha
-Zona horaria 
-Boton para eliminar la card.
- **Actualización automática de hora y fecha**
- **Almacenamiento local:** guarda las consultas realizadas.
- **Diseño responsive:** se adapta a moviles, tabletas y pantallas grandes.
- **Nueva imagen de fondo mas acorde al contenido**
- **Skeleton loader:** al consultar una nueva zona, se muestra un loader mientras se espera la respuesta de la API.

## Enlace en linea
puedes probar el proyecto aqui:
[🌐 Reloj Mundial en Netlify](https://relojs.netlify.app/)

## Gif
![Reloj Mundial en acción](/public/img/demo.gif)



