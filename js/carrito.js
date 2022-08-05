//CARRITO DE COMPRAS: Donde genero una tabla con todos los datos para genera un ticket

//TRAIGO LA INFORMACION DE LOS PASAJEROS DEL LOCAL STORAGE

let Pasajeros;

if(JSON.parse(localStorage.getItem('Pasajeros')))  {
    Pasajeros = JSON.parse(localStorage.getItem('Pasajeros'))
} else {
    let PASAJEROS = {lista:[]}
    localStorage.setItem('Pasajeros', JSON.stringify(PASAJEROS))
    Pasajeros = JSON.parse(localStorage.getItem('Pasajeros'))
}


//TRAIGO LA INFORMACION DEL LOCAL STORAGE DE LOS DESTINOS SELECCIONADOS

let carrito;
if(JSON.parse(localStorage.getItem('carrito')))  {
    carrito = JSON.parse(localStorage.getItem('carrito'))
} else {
    localStorage.setItem('carrito', JSON.stringify([]))
    carrito = JSON.parse(localStorage.getItem('carrito'))
}

//CALCULO DEL TOTAL
const totalCarrito = () => {
    return carrito.reduce((acc, dest) => acc + dest.precio * dest.cantidad*Pasajeros.lista.length, 0)
}


///GENERO LA FECHA DEL DIA POR LUXON/////

const dateTime = luxon.DateTime
const dt = dateTime.now()
dt.toLocaleString()


//ARMADO DEL CUADRO DEL CARRITO

const body = document.getElementById('carrito');

function MostrarCarro(){
    // CASO SI NO HAY AGREGADOS DESTINOS
    if(carrito.length == 0){
        const texto = `
        <div class='cartContainer'>
            <h3 class='txtCarrito'>No seleccionaste un destino</h3>
            <a class='btnVolver' href='index.html'>
                <button>VOLVER</button>
            </a>
        </div>`;
    body.innerHTML = texto;
    }

    // CASO SI NO HAY AGREGADOS PASAJEROS
    if(Pasajeros.lista.length==0){
        const texto = `
        <div class='cartContainer'>
            <h3 class='txtCarrito'>No hay Pasajeros agregados</h3>
            <a class='btnVolver' href='index.html'>
                <button>VOLVER</button>
            </a>
        </div>`;
    body.innerHTML = texto;
    } 

    //CASO SI NO HAY AGREGADOS NI DESTINOS NI PASAJEROS
    if(carrito.length == 0 && Pasajeros.lista.length==0){
        const texto = `
        <div class='cartContainer'>
            <h3 class='txtCarrito'>No hay destinos, ni pasajeros en el carrito</h3>
            <a class='btnVolver' href='index.html'>
                <button>VOLVER</button>
            </a>
        </div>`;
    body.innerHTML = texto;
    }

    //CASO SI HAY AGREGADOS DESTINOS Y PASAJEROS//

    if(Pasajeros.lista.length!=0 && carrito.length!=0){
        const titulo = `
            <div class='cartContainer'>
                <h1 class='txtCarrito'>Carrito de Viajes</h1>
            </div>`;
        body.innerHTML += titulo;
        const table = `
            <div class='tableContainer'>
                <table>
                    <thead>
                        <tr>
                            <th class='txtTabla'>FECHA</th>
                            <th class='txtTabla'>PASAJEROS</th>
                            <th class='txtTabla'>DESTINO</th>
                            <th class='txtTabla'>CANTIDAD</th>
                            <th class='txtTabla'>PRECIO</th>
                        </tr>
                    </thead>
                    <tbody id='tbody'>
                    </tbody>
                    <tfoot>
                        <tr>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th class='txtTotal'>Total:</th>
                            <th id='total'>$${totalCarrito()}</th>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div class='btn-container'>
                <a id='vaciar' class='btnTerminar'>
                    <button class='btnTerminar'>VACIAR CARRITO</button>
                </a>
            </div>
            <div class='btn-container'>
                <a id='comprar' class='btnTerminar'>
                    <button class='btnTerminar'>TERMINAR COMPRA</button>
                </a>
            </div> 
            <div class='cartContainer'>
                <a class='btnVolver' href='index.html'>
                    <button>VOLVER</button>
                </a>
            </div>`;
                body.innerHTML += table
                const tbody = document.getElementById('tbody')
                for (let i = 0; i < carrito.length; i++) {
                    const element = carrito[i];
                    const { id, destino, imagen, precio, cantidad} = element;
                    const cart = `
                    <tr id=${id}>
                        <th class='fecha'>${dt.toLocaleString()}</th>
                        <th>${Pasajeros.lista.map(p => '<p class= nombres>' + p.nombre + ' '+ '</p>').join('')}</th>
                        <th class='detallesTabla'><span class='nombreProd'>${destino}</span><img class='imgProdCart' src=${imagen} alt='foto del producto'></th>
                        <th class='cantidad'>${(Pasajeros.lista.length)}</th>
                        <th class='precio'>$${(cantidad * precio)}</th>
                    </tr>`
                    tbody.innerHTML += cart
                }
                let VaciarCarrito = document.getElementById('vaciar')
                body.append(VaciarCarrito)
                VaciarCarrito.onclick = () =>{
                    Pasajeros.lista= []
                    carrito= []
                    body.innerHTML=``
                    localStorage.setItem('Pasajeros', JSON.stringify({lista:[]}));
                    localStorage.setItem('carrito', JSON.stringify([]));
                    MostrarCarro();
                }
                let TerminarCompra=document.getElementById('comprar')
                body.append(TerminarCompra)
                TerminarCompra.onclick= ()=>{
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'COMPRA FINALIZADA',
                        text: '"Tus tickets seran enviados"',
                        showConfirmButton: false,
                        imageUrl: 'https://elviajerofeliz.com/wp-content/uploads/2015/03/consejos-para-viajar-en-avion.jpg',
                        imageWidth: 400,
                        imageHeight: 200,
                        imageAlt: 'Custom image',
                        timer: 2000
                      })
                      
                }
    }

}

MostrarCarro();
