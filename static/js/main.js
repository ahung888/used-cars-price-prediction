let form = {
    horsepower: 'range',
    torque: 'range',
    mileage: 'range',
    year: 'range',
    engine_type: 'radio',
    make_name: 'radio',
    body_type: 'radio',
    wheel_system: 'radio',
    model_name: 'radio',
    fuel_type: 'radio',
}
let label_mapping = {
    engine_type: ['','Gasoline engine','H6','I4','I5','I6','V6','V8','V12','Other'],
    make_name: ['','BMW','Cadillac','Dodge','Ford','GMC','Honda','Hyundai','Kia','Lexus','Mercedes-Benz','Nissan','RAM','Volkswagen','Other'],
    body_type: ['','Hatchback','Pickup Truck','SUV / Crossover','Sedan','Wagon'],
    wheel_system: ['','FWD','AWD','4WD','RWD','4X2'],
    model_name: ['','Altima','Camry','Civic','Corolla','Equinox','Escape','Explorer','F-150','Fusion','Malibu','Rogue','Silverado 1500','Trax'],
    fuel_type: ['','Gasoline','Diesel','Electric','Other'],
}

window.mycharts = {
    predictResult: null,
}
function getElement(key) {
    if (key in form) {
        let type = form[key]
        if (type == 'radio') {
            return $('input[name="'+key+'"]')
        } else if (type == 'range') {
            return $('#'+key)
        }
    }
    return null
}
function getInputValue(key) {
    if (key in form) {
        let type = form[key]
        if (type == 'radio') {
            return $('input[name="'+key+'"]:checked').val()
        } else if (type == 'range') {
            return getElement(key).val()
        }
    }
    return null
}
function render() {
    Object.keys(form).forEach(function(key) {
        let val = getInputValue(key)
        if (key in label_mapping) {
            val = label_mapping[key][parseInt(val)]
        }
        $('#selected_'+key).text(val)
    })
}

$( document ).ready(function() {
    $('#btn-submit').on('click', function() {
        $('#btn-submit').addClass('btn-lg')
        $('#btn-submit').text('預測中...')
        $('#btn-submit').attr('disabled', true)
        $('#result-display').hide()

        let data = {}
        Object.keys(form).forEach(function(key) {
            data[key] = getInputValue(key)
        })

        $.post("/data", data)
        .done(function( res ) {
            $('#result-modal').modal('show')
            window.mycharts.predictResult.animate(res.p)

            $('#btn-submit').removeClass('btn-lg')
            $('#btn-submit').text('開始預測')
            $('#btn-submit').attr('disabled', false)
        })
    })

    Object.keys(form).forEach(function(key) {
        let type = form[key]
        if (type == 'radio') {
            getElement(key).on('click', function() {
                render()
            })
        } else if (type == 'range') {
            getElement(key).on('input', function() {
                render()
            })
        }
    })

    render()
});

