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

const horasLocales = {};

async function obtenerFechayHora(ciudad) {
  mostrarSkeleton(ciudad);

  const url = `https://timeapi.io/api/TimeZone/zone?timeZone=${ciudad}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    horasLocales[ciudad] = {
      horaBase: new Date(data.currentLocalTime),
      timestampLocal: new Date(),
    };

    const skeleton = document.querySelector(
      `.card-skeleton[data-ciudad="${ciudad}"]`
    );
    if (skeleton) skeleton.remove();

    actualizarHora(ciudad);
  } catch (err) {
    console.error(err);
    if (message) {
      message.innerHTML = "<p>Error al cargar la hora. Intenta de nuevo.</p>";
    }
  }
}

function actualizarHora(ciudad) {
  const base = horasLocales[ciudad];
  if (!base) return;

  const now = new Date();
  const diferencia = now - base.timestampLocal;
  const horaActual = new Date(base.horaBase.getTime() + diferencia);

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

  const horaFormateada = horaActual.toLocaleTimeString("es-Ec", hora);
  const fechaFormateada = horaActual.toLocaleDateString("es-Ec", fecha);

  mostrarResultados(horaFormateada, ciudad, fechaFormateada);
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
    $iconoEliminar = d.createElement("img");

  ($iconoEliminar.src = "/img/borrar.png"), ($iconoEliminar.alt = "Opciones");
  $iconoEliminar.classList.add("icono-opciones");

  if (ciudadExistente) {
    ciudadExistente.querySelector(".hora").textContent = horaFormateada;
    ciudadExistente.querySelector(".fecha").textContent = fechaFormateada;
    return;
  }

  let $clone = d.importNode($template, true);

  $clone.querySelector("[data-ciudad]").setAttribute("data-ciudad", ciudad);
  $clone.querySelector(".hour").textContent = horaFormateada;
  $clone.querySelector(".date").textContent = fechaFormateada;
  $clone.querySelector(".city").textContent = formatearZona(ciudad);

  const $icon = $clone.querySelector(".timezone-icon"),
    hora = obtenerHoraEn24(horaFormateada);

  $icon.textContent = hora >= 6 && hora <= 18 ? "☀️" : "🌕";

  const $contenedorOpciones = $clone.querySelector(".content-opcion");
  $contenedorOpciones.insertAdjacentElement("afterend", $iconoEliminar);

  $fragment.appendChild($clone);
  $listContainer.appendChild($fragment);

  let zonasGuardadas = JSON.parse(localStorage.getItem("zonasGuardadas")) || [];

  const nuevaZona = {
    ciudad,
    horaFormateada,
    fechaFormateada,
  };

  const cardExiste = zonasGuardadas.some((z) => z.ciudad === ciudad);

  if (!cardExiste) {
    zonasGuardadas.push(nuevaZona);
    localStorage.setItem("zonasGuardadas", JSON.stringify(zonasGuardadas));
  }
}

function formatearZona(ciudad) {
  const partes = ciudad.split("/"),
    ciudadLimpia = partes[partes.length - 1].replace(/_/g, " ");
  return ciudadLimpia;
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

export function mostrarCardsGuardadas() {
  const datosGuardados = JSON.parse(
    localStorage.getItem("zonasGuardadas") || []
  );

  datosGuardados.forEach((zona) => {
    mostrarResultados(zona.horaFormateada, zona.ciudad, zona.fechaFormateada);
  });
}

export function eliminarZona(ciudad) {
  let zonasGuardadas = JSON.parse(
    localStorage.getItem("zonasGuardadas") || "[]"
  );
  zonasGuardadas = zonasGuardadas.filter((z) => z.ciudad !== ciudad);
  localStorage.setItem("zonasGuardadas", JSON.stringify(zonasGuardadas));
}

function mostrarSkeleton(ciudad) {
  const $listContainer = document.getElementById("list-container");
  const $skeleton = document.createElement("div");
  $skeleton.classList.add("card-skeleton", "skeleton");
  $skeleton.setAttribute("data-ciudad", ciudad);

 
  $skeleton.innerHTML = `
    <div class="skeleton-header">
      <div class="skeleton skeleton-title"></div>
      <div class="skeleton skeleton-icon"></div>
    </div>
    <div class="skeleton skeleton-description"></div>
    <div class="skeleton-cards">
      <div class="skeleton skeleton-line"></div>
      <div class="skeleton skeleton-line"></div>
      <div class="skeleton skeleton-line"></div>
      <div class="skeleton skeleton-line"></div>
    </div>
  `;

  $listContainer.appendChild($skeleton);
}

setInterval(() => {
  for (const ciudad in horasLocales) {
    const base = horasLocales[ciudad];
    const ahora = new Date();
    const diferencia = ahora - base.timestampLocal;
    const horaActual = new Date(base.horaBase.getTime() + diferencia);

    const $hora = document.querySelector(`[data-ciudad="${ciudad}"] .hour`),
      $fecha = document.querySelector(`[data-ciudad="${ciudad}"] .date`);

    if ($hora) {
      $hora.textContent = horaActual.toLocaleTimeString("es-EC", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    if ($fecha) {
      $fecha.textContent = horaActual.toLocaleDateString("es-EC", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
  }
}, 60_000); 
