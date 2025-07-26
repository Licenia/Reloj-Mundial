import {manejarBusqueda, search} from "./script"

const d = document,
$id = d.getElementById("agregarZonaHoraria")

d.addEventListener("DOMContentLoaded" , () =>{
    if ($id) {
        $id.addEventListener("click", manejarBusqueda)        
    }
    search()
})