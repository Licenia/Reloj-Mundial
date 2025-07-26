const d = document,
  cotenedor = d.getElementById("container"),
  $zonaSelect = d.getElementById("zona-select"),
  message = d.querySelector(".clock-input");

let horaFormateada,
  fechaFormateada,
  ciudad,
  ciudadesAgregadas = [];

export function manejarBusqueda() {
  const nuevaCiudad = addCountry();
  if (nuevaCiudad && !ciudadesAgregadas.includes(nuevaCiudad)) {
    ciudadesAgregadas.push(nuevaCiudad);
    obtenerFechayHora(nuevaCiudad);
  }
}

function addCountry() {
  const valorSelect = $zonaSelect.value;

  if (valorSelect === "") {
    message.innerHTML = "<p>Por favor seleccione una zona horaria</p>";
    return null;
  }
  ciudad = valorSelect;
  return ciudad;
}

setInterval(() => {
  ciudadesAgregadas.forEach((ciudad) => {
    obtenerFechayHora(ciudad);
  });
}, 60000);

async function obtenerFechayHora(ciudad) {
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

export function search() {
  const url = "https://timeapi.io/api/timezone/availabletimezones",
    zonasGuardadas = JSON.parse(localStorage.getItem("datos")),
    zonasHorarias = (zonas) => {
      zonas.forEach((zone) => {
        const option = document.createElement("option");
        option.value = zone;
        option.textContent = zone;
        $zonaSelect.appendChild(option);
      });
    };

  if (zonasGuardadas) {
    zonasHorarias(zonasGuardadas);
  }

  fetch(url)
    .then((res) => res.json())
    .then((timezones) => {
      localStorage.setItem("datos", JSON.stringify(timezones));

      if (!zonasGuardadas) {
        zonasHorarias(timezones);
      }
    })
    .catch((err) => console.error("Error al obtnener zonas horarias", err));
}

function mostrarResultados(horaFormateada, ciudad, fechaFormateada) {
  const ciudadExistente = document.querySelector(`[data-ciudad="${ciudad}"]`),
  $listContainer = d.querySelector("#list-container"),  
  $template = d.getElementById("template-card").content,
  $fragment = d.createDocumentFragment(),
  $imgOpcion = d.createElement("img");

  ($imgOpcion.src = "/img/tres-puntos.png"), ($imgOpcion.alt = "Opciones");
  $imgOpcion.classList.add("icono-opciones");

  if (ciudadExistente) {
    ciudadExistente.querySelector(".hora").textContent = horaFormateada;
    ciudadExistente.querySelector(".fecha").textContent = fechaFormateada;
    return;
  }

  let $clone = d.importNode($template, true);

  $clone.querySelector("[data-ciudad]").setAttribute("data-ciudad", ciudad);
  $clone.querySelector(".hour").textContent = horaFormateada;
  $clone.querySelector(".date").textContent = fechaFormateada;
  $clone.querySelector(".city").textContent = ciudad;

  const $icon = $clone.querySelector(".timezone-icon"),
  hora = obtenerHoraEn24(horaFormateada);

  $icon.textContent = hora >= 6 && hora <= 18 ? "☀️" : "🌕";

  const $contenedorOpciones = $clone.querySelector(".content-opcion");
  $contenedorOpciones.insertAdjacentElement("afterend", $imgOpcion);

  $fragment.appendChild($clone);
  $listContainer.appendChild($fragment);
}

function obtenerHoraEn24(horaFormateada) {
  const [hora, periodoRaw] = horaFormateada.split(" ");
  const periodo = periodoRaw.replace(/[^a-zA-Z]/g, "").toLowerCase();
  let [horas, minutos] = hora.split(":").map(Number); // convierte de string a numero y elimina ":"

  if (periodo === "pm" && horas !== 12) {
    horas += 12;
  }
  if (periodo === "am" && horas === 12) {
    horas = 0;
  }

  return horas;
}

