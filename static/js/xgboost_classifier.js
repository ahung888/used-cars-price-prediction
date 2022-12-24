let form = {
    horsepower: 'range',
    torque: 'range',
    mileage: 'range',
    year: 'range',
    daysonmarket: 'range',
    maximum_seating: 'range',
    savings_amount: 'range',
    combined_fuel_economy: 'range',
    legroom: 'range',
    major_options_count: 'range',
    seller_rating: 'range',
    length: 'range',
    width: 'range',
    height: 'range',
    wheelbase: 'range',
    fuel_tank_volume: 'range',
    has_incidents: 'radio',
    engine_type: 'radio',
    make_name: 'radio',
    body_type: 'radio',
    wheel_system: 'radio',
    model_name: 'radio',
    fuel_type: 'radio',
    transmission: 'radio',
    exterior_color: 'radio',
    interior_color: 'radio',
}
let label_mapping = {
    engine_type: ['','Gasoline engine','H6','I4','I5','I6','V6','V8','V12','Other'],
    make_name: ['','BMW','Cadillac','Dodge','Ford','GMC','Honda','Hyundai','Kia','Lexus','Mercedes-Benz','Nissan','RAM','Volkswagen','Other'],
    body_type: ['','Hatchback','Pickup Truck','SUV / Crossover','Sedan','Wagon'],
    wheel_system: ['','FWD','AWD','4WD','RWD','4X2'],
    model_name: ['','Altima','Camry','Civic','Corolla','Equinox','Escape','Explorer','F-150','Fusion','Malibu','Rogue','Silverado 1500','Trax'],
    fuel_type: ['','Gasoline','Diesel','Electric','Other'],
    has_incidents: ['NO','YES'],
    transmission: ['','A','CVT','M','Dual Clutch'],
    exterior_color: ['','White','Black','Silver','Blue','Red','Gray','Green','Orange','Brown','Gold','Yellow','Beige','Mixed colors','Others'],
    interior_color: ['','Black','Gray','White','Beige','Brown','Black','Red','Silver','Blue','Green','Gold','Orange','Yellow','Purple','Mixed colors','Others'],
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
        $('#'+key+'_display').text(getInputValue(key))
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

        $.post("/data/xgboost_classifier", data)
        .done(function( res ) {
            let label = 'level_'+res.p
            $('#chart-result-xgboost-classifier .card').removeClass('border-primary')
            $('#chart-result-xgboost-classifier .card.'+label).addClass('border-primary')
            $('#chart-result-xgboost-classifier .card .card-header').removeClass('text-bg-primary border-primary')
            $('#chart-result-xgboost-classifier .card.'+label+' .card-header').addClass('text-bg-primary border-primary')
            $('#result-modal').modal('show')

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

