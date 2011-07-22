// Javascript for Regions (just the KML file)
// Passes JSLint

//jq(document).ready(function() { 
jQuery.noConflict()(window).load(function($) { 

if($('#gmap').length > 0) {

    function distinguishZoomLevel (type) {
        if (type==='country') {
            return 5; 
        } else if (type==='locality' || type==='postal_code') {
            return 13; 
        } else if (type==='street_address' || type==='point_of_interest') {
            return 16; 
        } else {
            return 10; 
        }
    }

    if(google_map.mode === 'edit') {

        var divMap = $("#gmap");
        var inputs = $('#latitude, #longitude');

        if(inputs.length > 2) { 
            return;
        }

        divMap.siblings('input').css('display','none');
        var locationDiv = 
            $('<div id="coordinates" class="locationString discreet"/>')
            .appendTo(divMap);
        var searchbutton = 
            $('<input type="button" value="search" class="searchButton"/>')
            .prependTo(divMap);
        var searchinput = $('<input id="query" type="text" size="50" />')
            .prependTo(divMap);

        locationDiv.html(inputs[0].value + ', ' + inputs[1].value);
        searchinput.attr('value', inputs[0].value + ', ' + inputs[1].value);




        //var cachedIcons = this.icons;
        //var map = this.map;
        //var distinguishZoomLevel = this.distinguishZoomLevel;
        var geocoder = new google.maps.Geocoder();
        //var divMap = $(element);
        //var inputs = $('#latitude, #longitude');
        var center = new google.maps.LatLng(inputs[0].value, inputs[1].value);
        var markerSelect = $('select#markerIcon');
        var markerColor = markerSelect[0].value;
        //var locationDiv = $('div#coordinates')[0];
        //var searchinput = $('input[value=search]');
        var queryinput = $('input#query');

        google_map.map.setOptions({center: center, zoom: 5});
        var editableMarker = new google.maps.Marker({
            draggable: true,
            map: google_map.map,
            position: center,
            icon: google_map.iconCache[markerColor],
            shadow: google_map.iconCache[markerColor].shadow
        });

        //editableMarker.setMap(google_map.map);

        geocode = function(){ 
            geocoder.geocode({'address':queryinput[0].value}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) { 
                    var point = results[0].geometry.location;
                    google_map.map.setOptions({
                        'center':point,
                        'zoom': distinguishZoomLevel(results[0].types[0])
                    });
                    editableMarker.setPosition(point);

                    inputs[0].value = point.lat();
                    inputs[1].value = point.lng();

                    locationDiv.html(point.lat() + ', ' + point.lng());
                    
                } else {
                    alert("Geocoding failed due to the following reasons: " + status); 
                }
            });
            // Prevent "You already submitted this form" message
            $("input[type=submit]").each(function(index) {
                    $(this).removeClass('submitting');
            });
            return false;
        }; 

        searchinput.bind('click', function (event) {
            geocode();
        });

        queryinput.bind('click blur keypress', function(event) {
            if(event.type == 'click') {
                this.cached_value = this.value;
                this.value = '';
            }
            if(event.type == 'blur') {
                this.value = this.cached_value; 
            } 
            if(event.type == 'keypress' && event.keyCode === 13) {
                event.preventDefault();
                searchinput.click();
                this.cached_value = this.value;
            }
        });

        markerSelect.bind('change', function (e) {
            editableMarker.setIcon(google_map.iconCache[this.value]);
            editableMarker.setShadow(google_map.iconCache[this.value].shadow);
        });

        google.maps.event.addListener(editableMarker, "dragend", function(e){
            var point = e.latLng;
            editableMarker.setPosition(point);
            locationDiv.html(point.lat() + ', ' + point.lng());
            queryinput[0].value = point.lat() + ', ' + point.lng(); 
            inputs[0].value = point.lat();
            inputs[1].value = point.lng();
        }); 

        google.maps.event.addListener(google_map.map, "click", function(e){
            var point = e.latLng;
            editableMarker.setPosition(point);
            locationDiv.html(point.lat() + ', ' + point.lng());
            queryinput[0].value = point.lat() + ', ' + point.lng(); 
            inputs[0].value = point.lat();
            inputs[1].value = point.lng();
        }); 
    }

}

});
