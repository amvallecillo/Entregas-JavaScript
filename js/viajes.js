//Entrega del Proyecto

//Se ingresan Pasajeros y se seleccionan los destinos


//INGRESO DE PASAJEROS

///Se arma una lista con los nombres ingresados, y se agrega al DOM


class Pasajero {
    constructor(nombre) {
        this.nombre = nombre
    }
}
class Pasajeros {
    constructor() {
        this.lista = []
    }
    agregarPasajero(pasajero) {
        this.lista.push(pasajero)
    }
    removerPasajero(pasajero) {
        this.lista = this.lista.filter((value) => {
            return value.nombre !== pasajero.nombre
        })
        localStorage.setItem('Pasajeros', JSON.stringify(this));
    }
    removerPasajeroHtml() {
        let elemento = document.getElementById("pasajeros")
        elemento.remove()
    }
    renderHtml() {
        let contenedor = document.getElementById('Pasaj')
        for (let index = 0; index < this.lista.length; index++) {
            const pasajero = this.lista[index];
            const elemento = document.createElement('div')
            elemento.id = "pasajeros";
            elemento.className = "MostrarPasajero";
            elemento.innerHTML = `
                <div class="nombre">${pasajero.nombre}</div>
            `
            const button = document.createElement('button')
            button.textContent = "Eliminar"
            button.className="btn btn-danger btn-sm"
            button.onclick = () => {
                this.removerPasajero(pasajero)
                this.removerPasajeroHtml(pasajero)
            }
            elemento.append(button)
            contenedor.append(elemento)
        }
    }
    agregarPasajeroHtml(pasajero) {
        let contenedor = document.getElementById('Pasaj')
        const elemento = document.createElement('div')
        elemento.className = "MostrarPasajero"
        elemento.id = "pasajeros"
        elemento.innerHTML = `
            <div class="pasajero">${pasajero.nombre}</div>
        `
        const button = document.createElement('button')
        button.textContent = "Eliminar"
        button.className="btn btn-danger btn-sm"
        button.onclick = () => {
            this.removerPasajero(pasajero)
            this.removerPasajeroHtml(pasajero)
        }
        elemento.append(button)
        contenedor.append(elemento)
        JSON.parse(localStorage.getItem('Pasajeros'))
    }
}

const PASAJEROS = new Pasajeros()

PASAJEROS.renderHtml()

//FORMULARIO DE INGRESO

const submitForm = (id) => {
    let form = document.getElementById(id);
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        let nombre = form.children[0].value
        let pasajero = new Pasajero(nombre)
        if(pasajero.nombre===""||!isNaN(pasajero.nombre)){
            Swal.fire('Necesitas colocar un nombre valido')
        }else{
            PASAJEROS.agregarPasajero(pasajero)
            PASAJEROS.agregarPasajeroHtml(pasajero)
            localStorage.setItem('Pasajeros', JSON.stringify(PASAJEROS))
        }
    })
    
}
submitForm('formulario')



//SELECCION DE LOS DESTINOS///


///ARMADO DEL CARRO PARA LA SELECCION DEL DESTINO DE VIAJE


///TRAIGO LA INFORMACION DE LOS DESTINOS CON FETCH Y GENERO UN EVENTO DE AGREGAR AL CARRO

fetch('./js/destinos.json')
    .then(response => response.json())
    .then(data => {
        destinos = data;
        desplegarDestinos();
        const btnAgregar = document.getElementsByClassName('btnAgregar')
        for (let i = 0; i < btnAgregar.length; i++) {
            const element = btnAgregar[i];
            element.addEventListener('click', agregarAlCarrito)
        }
    })
    .catch(error => console.error(error))



let carrito;
let destinos;

function desplegarDestinos() {
    for (let i = 0; i < destinos.length; i++) {
        const element = destinos[i];
        const { id, destino, precio, imagen } = element ////EJEMPLO DE DESESTRUCTURACIÓN///////
        const card = `
        <div class='tarjetas'>
            <p>${destino}</p>
            <div>
                <img class='imgDestino' src=${imagen} alt=''/>
            </div>
            <div>
                <p>$${precio}</p>
            </div>
            <div class="btn-container">
                <button id=${id} class='btnAgregar'>AGREGAR DESTINO</button>
            </div>
        </div>
        `
        const container = document.getElementById('contenedor')
        container.innerHTML += card
    }
}

function agregarAlCarrito(e) {
    const btn = e.target;
    const idBoton = btn.getAttribute('id')
    const destEncontrado = destinos.find(dest => dest.id == idBoton)
    const enCarrito = carrito.find(dest => dest.id == destEncontrado.id)
    if(!enCarrito) {
        carrito.push({...destEncontrado, cantidad: 1}) /////EJEMPLO DE SPREAD/////
    } 
    else {
        let carritoFiltrado = carrito.filter(dest => dest.id != enCarrito.id)
        carrito = [...carritoFiltrado, {...enCarrito, cantidad: enCarrito.cantidad}] /////EJEMPLO DE SPREAD/////
    }
    localStorage.setItem('carrito', JSON.stringify(carrito))

    //USO DE LIBRERIA 
    
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Destino Seleccionado',
        text: '"Tu vuelo ha sido reservado"',
        showConfirmButton: false,
        imageUrl: 'https://cdn.computerhoy.com/sites/navi.axelspringer.es/public/styles/480/public/media/image/2020/02/web-buscar-vuelos-1866677.jpg?itok=_ni5Njvr',
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: 'Custom image',
        timer: 1500
      })
}

//SE GUARDAN LOS PASAJEROS EN EL LOCAL STORAGE

if(JSON.parse(localStorage.getItem('Pasajeros')))  {
    PASAJEROS.lista = JSON.parse(localStorage.getItem('Pasajeros')).lista;
} else {
    localStorage.setItem('Pasajeros', JSON.stringify(PASAJEROS))
}

//SE GUARDAN LOS DESTINOS EN EL LOCAL STORAGE

if(JSON.parse(localStorage.getItem('carrito')))  {
    carrito = JSON.parse(localStorage.getItem('carrito'))
} else {
    localStorage.setItem('carrito', JSON.stringify([]))
    carrito = JSON.parse(localStorage.getItem('carrito'))
}

//GENERO UN CONTADOR

const contador = document.getElementById('cartCounter')
contador.innerHTML = carrito.length


