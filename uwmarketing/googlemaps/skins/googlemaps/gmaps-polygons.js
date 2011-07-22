var map;
// Javascript for Google Map View
//    This Javascript runs the polygons on the map
//    Passes JSLint
if (!google.maps.Polygon.prototype.getBounds) {
    google.maps.Polygon.prototype.getBounds = function(latLng) {
        var bounds = new google.maps.LatLngBounds();
        var paths = this.getPaths();
        var path;
        for (var p = 0; p < paths.getLength(); p++) {
            path = paths.getAt(p);
            for (var i = 0; i < path.getLength(); i++) {
                bounds.extend(path.getAt(i));
            }
        }
        return bounds;
    };
}

if (!google.maps.Polygon.prototype.contains) {
    google.maps.Polygon.prototype.contains = function(latLng) { 
        // Outside the bounds means outside the polygon
        if (!this.getBounds().contains(latLng)) {
            return false;
        } 
        var lat = latLng.lat();
        var lng = latLng.lng();
        var paths = this.getPaths();
        var path, pathLength, inPath, i, j, vertex1, vertex2; 
        // Walk all the paths
        for (var p = 0; p < paths.getLength(); p++) { 
            path = paths.getAt(p);
            pathLength = path.getLength();
            j = pathLength - 1;
            inPath = false; 
            for (i = 0; i < pathLength; i++) { 
                vertex1 = path.getAt(i);
                vertex2 = path.getAt(j); 
                if (vertex1.lng() < lng && vertex2.lng() >= lng || vertex2.lng() < lng && vertex1.lng() >= lng) {
                    if (vertex1.lat() + (lng - vertex1.lng()) / (vertex2.lng() - vertex1.lng()) * (vertex2.lat() - vertex1.lat()) < lat) {
                        inPath = !inPath;
                    }
                } 
                j = i; 
            } 
            if (inPath) {
                return true;
            } 
        } 
        return false;
    };
}

google.maps.Marker.prototype.customInfoWindow = function(info_window, map, content) {
    // 'this' refers to the current marker 
    google.maps.event.addListener(this, "click", function(e) {
        info_window.setContent(content);
        info_window.open(map, this.getPosition());
    }); 
};

// Javascript for Regions (just the KML file)
//  Passed JSLint

jQuery.noConflict()(document).ready(function($) { 

    // HACK for IE the world's premier browser
    setTimeout(function() { 

    /********* Map Options ********/

    var googleMapOptions = {
        //required
        mapTypeId: google.maps.MapTypeId.ROADMAP, //mapsConfig.google.defaultmaptype,
        zoom: 7,//mapsConfig.google.initialzoomlevel,
        center: new google.maps.LatLng(47.398349,-120.695801), 
        //optional
        backgroundColor:'white',
        scrollwheel:false,
        mapTypeControl:false
    };

    $("#gmap").removeClass('googleLoading').addClass("googleMapActive");
    
    map = new google.maps.Map(
        $("#googleMapPane").addClass("googleMapPane").get(0), 
        googleMapOptions
    );

    var bounds = new google.maps.LatLngBounds();

    if(typeof(UWMapConfig) !== 'undefined') {
        var branded_map = new google.maps.StyledMapType(UWMapConfig, {name: "Branded Map"});
        map.mapTypes.set("Branded Map", branded_map);
        map.setMapTypeId("Branded Map");
    }

    var info_window = new UWInfoWindow();
    map.setCenter(bounds.getCenter());
    map.fitBounds(bounds);

    google.maps.event.addListener(map, "click", function(e) {
        info_window.close();
    }); 


    /********** Polygons *******/

    if($('#gmap').length > 0) {

        if(typeof(polygons) != 'undefined') {

            var cached_poly = null;
            var polygon_array = []; 

            var customMouseOver = function (polygon, index) {
                polygon.setOptions({
                    strokeColor: "#222",
                    strokeOpacity: 1,
                    strokeWeight: 4,
                    fillColor: "#fff",
                    fillOpacity: 0.6 
                });
                var title = $('#'+index+' a').html();
                $('#geolocateInfo').html(title); 
            };

            var customMouseOut = function (polygon, index) {
              polygon.setOptions({
                strokeColor: "#000",
            	strokeOpacity: 0.4,
            	strokeWeight: 2,
            	fillColor: "#e0a300",
            	fillOpacity: 0.4 
              });
              $('#geolocateInfo').html(''); 
            };

            var reinstateLastPolyEvents = function (last_poly, cached_poly) {
                last_poly.setOptions({
                    strokeColor: "#000",
                    strokeOpacity: 0.4,
                    strokeWeight: 2,
                    fillColor: "#e0a300",
                    fillOpacity: 0.4 
                }); 
                google.maps.event.addListener(last_poly, 'mouseover', function(){
                   customMouseOver(last_poly, cached_poly);
                });
                google.maps.event.addListener(last_poly, 'mouseout', function(){
                    customMouseOut(last_poly);
                });
            };

            $.each(polygons, function (index, value) {

                  var current_polygon = new google.maps.Polygon({
                    paths: polygons[index],
                    strokeColor: "#333",
                    strokeOpacity: 1,
                    strokeWeight: 2,
                    fillColor: "#d7a900",
                    fillOpacity: 0.4
                  });

                  google.maps.event.addListener(current_polygon, 'mouseover', function(){
                      customMouseOver(current_polygon, index);
                  });

                  google.maps.event.addListener(current_polygon, 'mouseout', function(){
                      customMouseOut(current_polygon);
                  });

                  google.maps.event.addListener(current_polygon, 'click', function(event){ 
                    if(polygon_array[cached_poly]) {
                        reinstateLastPolyEvents(polygon_array[cached_poly], cached_poly);
                    }
                    cached_poly = index;

                    current_polygon.setOptions({ 
                        strokeColor: "#333",
                        strokeOpacity: 1,
                        strokeWeight: 3,
                        fillColor: "#fff",
                        fillOpacity: 0.2

                    });
                    var content = $('#'+index);
                    content = $(content).clone().css('display','block').removeAttr('id').get(0);
                    info_window.setContent(content);
                    google.maps.event.clearListeners(current_polygon, "mouseout");
                    google.maps.event.clearListeners(current_polygon, "mouseover");
                    info_window.open(map, event.latLng); 
                  });

                  polygon_array[index] = current_polygon;

                  bounds.extend(polygons[index][0]); 
                  current_polygon.setMap(map); 

            });

            google.maps.event.addListener(map, 'click', function(e) {
                reinstateLastPolyEvents(polygon_array[cached_poly], cached_poly); 
            });
        }
    }

    /******* Markers *******

    $("#gmap")
        .find("div.infoWindow")
        .each(function(index){
            //var new_marker = null;
            var latlng = $(this).find('span'), 
                content = this,
                coordinates = [latlng[0].innerHTML, latlng[1].innerHTML],
                color = latlng[2].innerHTML, 
                gLatlng = new google.maps.LatLng(coordinates[1], coordinates[0]);

            bounds.extend(gLatlng); 
            if(color) {
                new_marker = new google.maps.Marker({
                    position: gLatlng,
                    icon: iconCache[color],
                    shadow: iconCache[color].shadow
                }); 
                new_marker.customInfoWindow(info_window, map, content);
            }
            new_marker.setMap(map); 
        });

    */

    /*********** Navigation ***********/

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
                                value = polygon_array[index];
                                regionHasAddress = value.contains(point);

                                if(regionHasAddress) {
                                    cached_poly = index;

                                    //var successString = 'Success! This location is in the '+$('#'+index+' a').html();
                                    //$('#geolocateInfo').attr('class', 'geocodeSuccess').html(successString).fadeIn();
                                    bounds = value.getBounds();
                                    value.setOptions({
                                        strokeColor: "#333",
                                        strokeOpacity: 1,
                                        strokeWeight: 3,
                                        fillColor: "#fff",
                                        fillOpacity: 0.2
                                    });

                                    content = $('#'+index);
                                    content = $(content).clone().css('display','block').removeAttr('id').get(0);
                                    //content = $(content).clone().addClass('TestClass').get(0);
                                    //content.id = null;
                                    //$(content).removeAttr('id');

                                    info_window.setContent(content);
                                    google.maps.event.clearListeners(value, "mouseout");
                                    google.maps.event.clearListeners(value, "mouseover");

                                    map.setOptions({
                                        center: point
                                    });

                                    map.fitBounds(bounds); 

                                    info_window.open(map, point);
                                    return false;
                                } 
                            });

                            if(regionHasAddress === false) { 
                                //hopefully this never happens, although its a graceful fail
                                map.setOptions({
                                    center: results[0].geometry.location
                                }); 
                                map.fitBounds(results[0].geometry.bounds); 
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

    }, 1000);
});
