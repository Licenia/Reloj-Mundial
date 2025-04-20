

const cotenedor = document.getElementById("container");
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const message = document.querySelector(".clock-input");

let horaFormateada;
let fechaFormateada;
let ciudad;

function manejarBusqueda() {
  addCountry();
  obtenerFechayHora();
}


function addCountry() {
  const valorInput = inputBox.value.trim();

  if (valorInput === "" || !/^[a-zA-Z\s\/]+$/.test(valorInput)) {
    let p = document.createElement("p");
    p.textContent = "No disponible, Intente nuevamente";
    message.innerHTML = ""; //para limpiar mensajes anteriores
    message.appendChild(p);
  }
  ciudad = valorInput;
  return ciudad;
}

async function obtenerFechayHora() {
  const url = `https://timeapi.io/api/TimeZone/zone?timeZone=${ciudad}`;

  await fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const dateObj = new Date(data.currentLocalTime);

      const hora = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };

      const fecha = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      };

      horaFormateada = dateObj.toLocaleTimeString("es-Ec", hora);
      fechaFormateada = dateObj.toLocaleDateString("es-Ec", fecha);

      mostrarResultados(horaFormateada, ciudad, fechaFormateada);

    })
    .catch((err) => console.error(err));
  }

//  despues de 400 ms se ejecutara la funcion de busqueda, esto para evitar hacer muchas peticiones mientras escriba  
let timeout;
inputBox.addEventListener("input", () => {
  clearTimeout(timeout); // sirve cuando el usuario aun no ha terminado de escribir  entonces , se cancela con el setTimeout anterior con clearTimeout(timeout) y creamos uno nuevo
  timeout = setTimeout(() => {
    shearch();
  }, 400)
});

function shearch() {
  const url = "https://timeapi.io/api/timezone/availabletimezones";
  const valorInput = inputBox.value.trim().toLowerCase();

  fetch(url)
    .then((res) => res.json())
    .then((timezones) => {
      const datalist = document.getElementById("buscador");
      datalist.innerHTML = "";

      // filtrar por coincidencias
      const zonasFiltradas = timezones.filter((zone) =>
        zone.toLowerCase().includes(valorInput)
      );


      // Mostrar solo las zonas que coincidan
      zonasFiltradas.forEach((zone) => {
        const option = document.createElement("option");
        option.value = zone;
        datalist.appendChild(option);
      });
    })
    .catch((err) => console.error("Error al obtnener zonas horarias", err));
}


function mostrarResultados(horaFormateada,  ciudad, fechaFormateada){
  const li = document.createElement('li');

  const hijo1= document.createElement('div');
  hijo1.setAttribute('class', 'container-img');

  const hijo2 = document.createElement('div');
  hijo2.setAttribute('class', 'container-hour');

  const hijo3 = document.createElement('div');
  hijo3.setAttribute('class', 'container-date');

  let icono = document.createElement('img');

  diaNoche(horaFormateada, icono);

  let nieto1 = document.createElement('h2');
  nieto1.setAttribute('class', 'hora');

  let nieto2 = document .createElement('h2');
  nieto2.setAttribute('class', 'nombreCiudad')

  let nieto3 = document.createElement('h2');
  nieto3.setAttribute('class', 'fecha')
  
  // Asignar contenido
  nieto1.textContent = horaFormateada;
  nieto2.textContent = ciudad;
  nieto3.textContent = fechaFormateada;

  // Armar la estructura
  hijo1.appendChild(icono);
  hijo2.appendChild(nieto1);
  hijo3.appendChild(nieto2);
  hijo3.appendChild(nieto3);

  li.appendChild(hijo1);
  li.appendChild(hijo2);
  li.appendChild(hijo3);

  listContainer.appendChild(li);

 
}

function diaNoche (horaFormateada, icono){
  const hora = obtenerHoraEn24(horaFormateada);

  if (hora >= 6 && hora < 18 ) {
    icono.setAttribute('src', '/img/sol.jpg');
  }else{
    icono.setAttribute('src', '/img/luna.jpg');
  }
}

function obtenerHoraEn24(horaFormateada) {
  const [hora, periodo] = horaFormateada.split(" ");
  let [horas, minutos] = hora.split(":").map(Number); // convierte de string a numero y elimina ":"

  if (periodo.toLowerCase() === "pm" && horas !== 12) {
    horas += 12;
  }
  if (periodo.toLowerCase() === "am" && horas === 12) {
    horas = 0;
  }

  return horas; 
}
