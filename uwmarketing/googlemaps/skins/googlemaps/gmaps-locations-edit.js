// Javascript for Regions (just the KML file)
// Passes JSLint

//jq(document).ready(function() { 
jQuery.noConflict()(window).load(function() { 
    $ = jQuery.noConflict();

    if($('#archetypes-fieldname-title').length > 0 ) {

    $('<div id="gmap"/>')
        .insertBefore('div#archetypes-fieldname-markerIcon')
        .append('<div id="googleMapPane"/>');
    $('#archetypes-fieldname-longitude, #archetypes-fieldname-latitude').hide();


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


        var divMap = $("#gmap");
        var inputs = $('#latitude, #longitude');

        if(inputs.length > 2) { 
            return;
        }

        divMap.siblings('input').css('display','none');
        var geolocateWidget = [
                '<div id="geolocateWidget">',
                '<div id="coordinates" class="locationString discreet">',
                inputs[0].value + ', ' + inputs[1].value,
                '</div>',
                '<input id="query" type="text" size="50" value="' + inputs[0].value + ', ' + inputs[1].value + '" />',
                '<input id="#queryinput" type="button" value="search" class="searchButton"/>',
                '</div>'
            ];

        $(geolocateWidget.join('')).insertBefore(divMap);
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
        var searchinput = $('#queryinput');
        var queryinput = $('input#query');
        var iconCache  = mapsConfig.google.markericons;
        var currentMarker = iconCache[markerColor];

        var google_map = new google.maps.Map(divMap.get(0));

        google_map.setOptions({
            center: center,
            zoom: 5,
            mapTypeId: google.maps.MapTypeId.ROADMAP 
        });
       
        var editableMarker = new google.maps.Marker({
            draggable: true,
            map: google_map,
            position: center,
            icon: currentMarker.url,
            shadow: new google.maps.MarkerImage(currentMarker.shadow,
                  new google.maps.Size(currentMarker.shadowSize[0], currentMarker.shadowSize[1]),
                  new google.maps.Point(0,0),
                  new google.maps.Point(currentMarker.shadowAnchor[0], currentMarker.shadowAnchor[1]))

              });


        if(typeof(UWMapConfig) !== 'undefined') {
            var branded_map = new google.maps.StyledMapType(UWMapConfig, {name: "Branded Map"});
            google_map.mapTypes.set("Branded Map", branded_map);
            google_map.setMapTypeId("Branded Map");
        }

        //editableMarker.setMap(google_map);

        geocode = function(){ 
            geocoder.geocode({'address':queryinput[0].value}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) { 
                    var point = results[0].geometry.location;
                    google_map.setOptions({
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
            editableMarker.setIcon(iconCache[this.value]);
            //editableMarker.setShadow(iconCache[this.value].shadow);
        });

        google.maps.event.addListener(editableMarker, "dragend", function(e){
            var point = e.latLng;
            editableMarker.setPosition(point);
            locationDiv.html(point.lat() + ', ' + point.lng());
            queryinput[0].value = point.lat() + ', ' + point.lng(); 
            inputs[0].value = point.lat();
            inputs[1].value = point.lng();
        }); 

        google.maps.event.addListener(google_map, "click", function(e){
            var point = e.latLng;
            editableMarker.setPosition(point);
            locationDiv.html(point.lat() + ', ' + point.lng());
            queryinput[0].value = point.lat() + ', ' + point.lng(); 
            inputs[0].value = point.lat();
            inputs[1].value = point.lng();
        }); 

}
});
