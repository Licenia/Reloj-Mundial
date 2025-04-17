const cotenedor = document.getElementById("container");
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const message = document.querySelector(".clock-input");

const url = "https://timeapi.io/api/TimeZone/zone?timeZone=Asia/Tokyo";

function addCountry() {
        if(inputBox.value === '' || !/^[a-zA-Z\s]+$/.test(inputBox.value)){
                let p = document.createElement('p');
                p.textContent = "No disponible, Intente nuevamente"
                message.appendChild(p); 
        }

        console.log(horaFormateada);
        console.log(fechaFormateada);
}



fetch(url)
  .then((res) => res.json())
  .then((data) => {
    const dateObj = new Date(data.currentLocalTime);

    const hora = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    };

    const fecha = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    };
    const horaFormateada = dateObj.toLocaleTimeString("es-Ec", hora);
    const fechaFormateada = dateObj.toLocaleDateString("es-Ec", fecha);

    
  })
  .catch((err) => console.error(err));
