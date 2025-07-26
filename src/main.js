import {manejarBusqueda, search} from "./funciones_reloj"

const d = document,
$id = d.getElementById("agregarZonaHoraria")

d.addEventListener("DOMContentLoaded" , () =>{
    if ($id) {
        $id.addEventListener("click", manejarBusqueda)        
    }

    search()
})

d.addEventListener("click", (e) =>{
     if (e.target.matches(".icono-opciones")) {
        const $card = e.target.closest(".container-result");
        $card.remove();
    }
})