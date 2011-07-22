//jQuery for the Search and Dropdown Navigation
//  Passes JSLint

jq(window).load(function(jq) {
//jq(document).ready(function($) {
//    if($('#geolocateAddress').length > 0) {

        //Drop Down Menu
        $('#choose-a-district > select')
            .bind('change', function (event) {
                var selected = $(event.target);
                if(selected.attr('id') != 'select-option') {
                    document.location.href = selected.attr('value');
                    return false;
                }
            });

        //Geolocate
        $('#searchsubmit').bind('click', function () {

                var errorString = '';
                var geocoder = new google.maps.Geocoder();
                var query = $('#geolocateSearch')[0].value;

                geocoder.geocode({'address':query}, function(results, status) {

                    if (status == google.maps.GeocoderStatus.OK) { 
                    var regex =/\bWA\b/;

                    if(regex.test(results[0].formatted_address)) {

                            var regionHasAddress;
                            var content;
                            var point = results[0].geometry.location;

                            $.each(polygons, function(index, value){
                                value = google_map.polygon_array[index];
                                regionHasAddress = value.contains(point);

                                if(regionHasAddress) {
                                    google_map.cached_poly = index;

                                    //var successString = 'Success! This location is in the '+$('#'+index+' a').html();
                                    //$('#geolocateInfo').attr('class', 'geocodeSuccess').html(successString).fadeIn();
                                    google_map.bounds = value.getBounds();
                                    value.setOptions({
                                        fillColor: "#990099" 
                                    });

                                    content = $('#'+index);
                                    content = $(content).clone().css('display','block').removeAttr('id').get(0);
                                    //content = $(content).clone().addClass('TestClass').get(0);
                                    //content.id = null;
                                    //$(content).removeAttr('id');

                                    google_map.info_window.setContent(content);
                                    google.maps.event.clearListeners(value, "mouseout");
                                    google.maps.event.clearListeners(value, "mouseover");

                                    google_map.map.setOptions({
                                        center: point
                                    });

                                    google_map.map.fitBounds(google_map.bounds); 

                                    google_map.info_window.open(google_map.map, point);
                                    return false;
                                } 
                            });

                            if(regionHasAddress === false) { 
                                //hopefully this never happens, although its a graceful fail
                                google_map.map.setOptions({
                                    center: results[0].geometry.location
                                }); 
                                google_map.map.fitBounds(results[0].geometry.bounds); 
                                return false;
                            }

                        } else {
                            errorString = 'This address is outside the state of Washington. Try entering a zip code as well.';
                            $('#geolocateInfo').attr('class', 'geocodeError').html(errorString).fadeIn();
                        }
                        
                    } else {
                        errorString = 'The address submitted could not be found.';
                        $('#geolocateInfo').attr('class', 'geocodeError').html(errorString).fadeIn();
                    }
                });
            return false;
        });
        $('#geolocateSearch').bind('click keypress', function(event) {
                if(event.type === 'keypress' && event.keyCode === 13) {
                    $('#searchsubmit').click();
                }
                var event_target = event.target; 
                if(event_target.id === 'geolocateSearch' && event_target.value.toLowerCase() == 'type an address') {
                    event_target.value = '';
                }
        })
        .bind('focusout', function(event) {
                var value = $('#geolocateSearch')[0].value;
                if(value === '') {
                    $('#geolocateInfo').removeClass().html('');
                    $('#geolocateSearch').attr('value', 'type an address');
                    //$('#error').fadeOut();
                }
                        
        });
    //}

});
