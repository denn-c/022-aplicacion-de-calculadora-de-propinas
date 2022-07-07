const $factura = document.querySelector('.factura__entrada')
const $descuento = document.querySelector('.descuento__entrada')
const $persona = document.querySelector('.persona__entrada')
const $botones = document.querySelectorAll('.descuento__valor')

const $propina = document.querySelector('.propina__monto')
const $total = document.querySelector('.total__monto')
const $reiniciar = document.querySelector('.salida__resetear')

const regEx = {
    moneda: /((^0\.\d*[1-9]+\d*$)|(^0\.[1-9]+$)|(^[1-9]+\d*\.\d+$))|(^[1-9]+\d*$)/,
    porcentaje: /^[1-9]$|(^[1-9]\d$)|^100$/,
    personas: /^[1-9]+\d*$/
}

const campos = {
    factura: false,
    descuento: false,
    persona: false
}

let precio, propina, clientes


let validaciones = (e, patron, clase) => {

    if (patron.test(e.target.value)) {
        e.target.classList.remove(`${clase}__entrada--activo`)
        campos[clase] = true;
    } else {
        e.target.classList.add(`${clase}__entrada--activo`)
        campos[clase] = false;
    }

    ejecutar()

}

const ejecutar = () => {

    if (campos.factura && campos.descuento && campos.persona) {

        let valorBotones

        $botones.forEach(elemento => {
            if (elemento.checked) {
                valorBotones = parseInt(elemento.value)
            }
        })

        precio = parseFloat($factura.value)
        propina = valorBotones | parseInt($descuento.value)
        clientes = parseInt($persona.value)

        let monto__propina = (precio + ((propina * precio) / 100)) / clientes
        let monto__total = ((propina * precio) / 100) / clientes
        monto__propina = Math.round((monto__propina + Number.EPSILON) * 100) / 100;
        monto__total = Math.round((monto__total + Number.EPSILON) * 100) / 100;

        $propina.textContent = `$${monto__total}`
        $total.textContent = `$${monto__propina}`

        $reiniciar.classList.add('salida__resetear--active')
    }
}

const reiniciar = () => {
    $propina.textContent = '$0.00'
    $total.textContent = '$0.00'
    $factura.value = ''
    $descuento.value = ''
    $persona.value = ''
    $botones.forEach(elemento => elemento.checked = false)
    for (const key in campos) campos[key] =false 
    $reiniciar.classList.remove('salida__resetear--active')
}

$factura.addEventListener("input", (e) => validaciones(e, regEx.moneda, 'factura'));
$descuento.addEventListener("input", (e) => validaciones(e, regEx.porcentaje, 'descuento'));
$persona.addEventListener("input", (e) => validaciones(e, regEx.personas, 'persona'));

$descuento.addEventListener('focus', () => {
    $botones.forEach(elemento => elemento.checked = false)
    campos.descuento = false
})

$botones.forEach(elemento => {
    elemento.addEventListener('input', e => {
        campos.descuento = e.target.checked
        $descuento.value = ''
        ejecutar()
    })
})

$reiniciar.addEventListener('click', reiniciar)