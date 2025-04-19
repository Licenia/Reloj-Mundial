

const cotenedor = document.getElementById("container");
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const message = document.querySelector(".clock-input");

let horaFormateada;
let fechaFormateada;
let ciudad;

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
