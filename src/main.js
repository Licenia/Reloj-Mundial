import {
  manejarBusqueda,
  search,
  mostrarCardsGuardadas,
  eliminarZona,
} from "./funciones_reloj";

const d = document,
  $id = d.getElementById("agregarZonaHoraria");

d.addEventListener("DOMContentLoaded", () => {
  if ($id) {
    $id.addEventListener("click", manejarBusqueda);
  }
  search();
  mostrarCardsGuardadas();
});

d.addEventListener("click", (e) => {
  if (e.target.matches(".icono-opciones")) {
    const $card = e.target.closest(".container-result");
    const ciudad = $card.dataset.ciudad;

    $card.remove();

    eliminarZona(ciudad);
  }
});
