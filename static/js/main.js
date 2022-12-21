let form = {
    horsepower: $('#horsepower'),
    torque: $('#torque'),
    mileage: $('#mileage'),
    year: $('#year'),
    engine_type: $('#engine_type'),
    make_name: $('#make_name'),
    body_type: $('#body_type'),
    wheel_system: $('#wheel_system'),
    model_name: $('#model_name'),
    fuel_type: $('#fuel_type'),
}
let label_mapping = {
    engine_type: ['','I4','H6','I6','Other'],
    make_name: ['','Ford','Lexus','Mercedes-Benz','Dodge','BMW','Cadillac','Kia','Nissan','Honda','Other'],
    body_type: ['','Pickup Truck','Sedan','SUV / Crossover','Hatchback','Other'],
    wheel_system: ['','FWD','AWD','4X2','Other'],
    model_name: ['','Fusion','Other'],
    fuel_type: ['','Diesel','Other'],
}

function render() {
    Object.keys(form).forEach(function(key) {
        let val = form[key].val()
        if (key in label_mapping) {
            val = label_mapping[key][parseInt(val)]
        }
        $('#selected_'+key).text(val)
    })
}

$( document ).ready(function() {
    $('#btn-submit').on('click', function() {
        $('#result-display').hide()

        let data = {}
        Object.keys(form).forEach(function(key) {
            data[key] = form[key].val()
        })

        $.get("/data", data)
        .done(function( res ) {
            $('#result-display').show()
            $('#result-display .card-body').text(res.p)
        })
    })

    Object.keys(form).forEach(function(key) {
        form[key].on('change', function() {
            render()
        })
    })

    render()
});

