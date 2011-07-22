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


//Now that this is done.  What are the options:
//
//The KML data is basically loaded one way or another.  It just depends who parses it.
//
//We can let google do it (like right now), but we lose control over each indivdual polygon
//  ie: we cant change the color of one polygon when its clicked.  in fact. we can only change
//      the color via the kml file.
//
//Or we can do it.  This could get heavy on our server, and our client would be parsing the Kml
//  on their computer, instead of google feeding a js file already parsed.
//  pros: we gain access to control each indivdual polygon
//
//
//For pages, we can create kml files from each location kml. therfore each region page will have its own (small) kml file that google parses.  

//jQuery DOM ready with $ as local namespace for legibility
var global_googlemap;
var global_bounds;
var kmllayer;
var polygon_array = {};

(function ($) {

 
    $.fn.GoogleMapsV3 = function(settings){

            var config = { 
                'mode':'view', 
                'type':'markers', 
                'mapOptions': null, 
                'mapElement' : null, 
                'infoWindow' : new google.maps.InfoWindow(),
                'debug' : false 
            };

            if(settings) { $.extend(config, settings); }

            var _methods = { 

                cacheGMarkerTypes: function(){ 
                    // Cache the types of google marker icons
                    var iconObject = {};
                    $.each(mapsConfig.google.markericons,function(index) {
                            var googleIcon = new google.maps.MarkerImage(
                                    this.icon,
                                    new google.maps.Size(parseFloat(this.iconSize[0]), parseFloat(this.iconSize[1])),
                                    new google.maps.Point(0,0),
                                    new google.maps.Point(parseFloat(this.iconAnchor[0]), parseFloat(this.iconAnchor[1]))
                                    );
                            var googleShadow = new google.maps.MarkerImage(
                                    this.shadow,
                                    new google.maps.Size(parseFloat(this.shadowSize[0]), parseFloat(this.shadowSize[1])),
                                    new google.maps.Point(0,0),                                                                             
                                    new google.maps.Point(2,14)
                            );
                            iconObject[this.name] = googleIcon;
                            iconObject[this.name].shadow = googleShadow; 
                    });
                    this.icons = iconObject;
                    return iconObject; 
                }, 

                generateGMap: function(element){ 
                    var mapElement = $(config.mapElement)[0];
                    $(element).addClass('googleMapActive');
                    $(mapElement).addClass('googleMapPane'); 
                    this.map = new google.maps.Map(mapElement, config.mapOptions);
                    this.mapbounds = new google.maps.LatLngBounds();
                    global_bounds = this.mapbounds;
                    if(config.styledMap) {
                        var UWMap= new google.maps.StyledMapType(config.styledMap.map, {name: config.styledMap.name});
                        this.map.mapTypes.set(config.styledMap.name, UWMap);
                        this.map.setMapTypeId(config.styledMap.name);
                    }
                    google.maps.event.addListener(this.map, 'click', function(e) {
                        config.infoWindow.close();
                        _methods.clearColors();
                    });
                    global_googlemap = this.map;
                    //return this.map;
                }, 

                gatherMapObjects: function(element){
                    var mapObjects = [];
                    if(config.type.markers === 'markers') { 
                        mapObjects.markers = $(element).find('div.infoWindow');
                    }
                    if(config.type.regions === 'regions') {
                        mapObjects.regions = $(element).find('div.regionInfoWindow');
                    }
                    return mapObjects;
                }, 

                addCTALayer: function(regions, mapObjects){
                    var date = new Date().getTime();
                    var ctaLayer;
                    //var keepView = (config.type.markers === 'markers') ? true : false;
                    var kmlUrl = $('span#kmlUrl').html().replace('https://','http://');

                    if(config.debug) {
                        ctaLayer =  new google.maps.KmlLayer('http://depts.washington.edu/uweb/test/LegislativeSimple.kml?'+date, {suppressInfoWindows: true});
                    } else {
                        ctaLayer =  new google.maps.KmlLayer(kmlUrl+'?'+date, {suppressInfoWindows: true});
                    }
                    ctaLayer.setMap(this.map);
                    kmllayer = ctaLayer;

                    if(location.protocol === 'https:'){
                        $('div#gmap').prepend('<dl id="kmlWarning" class="portalMessage error"><dt>Warning</dt><dd>The Google Map below may be showing nothing but water. This is because this content is not published! Please publish this item and the map will render correctly.</dd></dl>');
                    }

                    google.maps.event.addListenerOnce(ctaLayer, 'metadata_changed', function() { 

                            if(ctaLayer.getMetadata() !== undefined) {
                                google.maps.event.addListener(ctaLayer, 'click', function (event) { 
                                    if(regions[event.featureData.name]) {
                                        var content = regions[event.featureData.name].clone()[0];
                                        content.id = null;
                                        config.infoWindow.setContent(content);
                                        config.infoWindow.open(this.map, event.latLng);
                                    }
                                });
                            }
                            $('dl#kmlWarning').hide();

                    }); 
                }, 

                createPolygons: function (mapObjects) {
                    
                    var infoWindowTest = new google.maps.InfoWindow();
                    $.each(polygons, function (index, value) {

                          var theBizzyPolyBitches = new google.maps.Polygon({
                            paths: polygons[index],
                            strokeColor: "#000000",
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            fillColor: "#000000",
                            fillOpacity: 0.35
                          });

                          google.maps.event.addListener(theBizzyPolyBitches, 'mouseover', function(){
                              theBizzyPolyBitches.setOptions({
                                fillColor: "#FFFFFF" 
                              });
                              var title = $('#'+index+' a').html();
                              $('#geolocateInfo').html(title);
                          });

                          google.maps.event.addListener(theBizzyPolyBitches, 'mouseout', function(){
                              theBizzyPolyBitches.setOptions({
                                    fillColor: "#000000" 
                              });
                              $('#geolocateInfo').html('');
                          });

                          _methods.generatePolyInfoWindows(theBizzyPolyBitches, index);
                        
                          global_bounds.extend(polygons[index][0]);
                              
                          theBizzyPolyBitches.setMap(global_googlemap); 

                          polygon_array[index] = (theBizzyPolyBitches);
                    });
                    var center = global_bounds.getCenter();

                    global_googlemap.setCenter(center);
                },

                generatePolyInfoWindows: function (polygon, content) {
                    //infowindow == config.customInfoWindow
                    content = $('#'+content);
                    content = $(content).clone()[0];
                    content.id = null;
                    if(polygon){
                        google.maps.event.addListener(polygon, "click", function(event) {
                                this.setOptions({ 
                                    fillColor: "#990099" 
                                });
                                config.infoWindow.setContent(content);
                                config.infoWindow.open(this.map, event.latLng);
                                google.maps.event.clearListeners(polygon, "mouseout");
                                google.maps.event.clearListeners(polygon, "mouseover");
                                _methods.clearColors(polygon);
                        }); 
                    }
                },

                clearColors: function (polygon) {
                    if(polygon) {
                        $.each(polygon_array, function(index, value) {
                            if(value != polygon) {
                                value.setOptions({
                                    fillColor: "#000000" 
                                });
                              google.maps.event.addListener(value, 'mouseover', function(){
                                  value.setOptions({
                                    fillColor: "#FFFFFF" 
                                  });
                                  var title = $('#'+index+' a').html();
                                  $('#geolocateInfo').html(title);
                              });

                              google.maps.event.addListener(value, 'mouseout', function(){
                                  value.setOptions({
                                        fillColor: "#000000" 
                                  });
                                $('#geolocateInfo').html('');
                              });
                            }
                        });
                    } else {
                        $.each(polygon_array, function(index, value) {
                            value.setOptions({
                                fillColor: "#000000" 
                            });
                              google.maps.event.addListener(value, 'mouseover', function(){
                                  value.setOptions({
                                    fillColor: "#FFFFFF" 
                                  });
                                  var title = $('#'+index+' a').html();
                                  $('#geolocateInfo').html(title);
                              });

                              google.maps.event.addListener(value, 'mouseout', function(){
                                  value.setOptions({
                                        fillColor: "#000000" 
                                  });
                              $('#geolocateInfo').html('');
                              });
                        });
                    }
                },

                decipherGMarkers: function(mapObjects){
                    var cachedIcons = this.icons;
                    var markers = [];
                    //this.bounds = new google.maps.LatLngBounds();
                    mapObjects.each(function(index) {
                        var new_marker = null;
                        var latlng = $(this).find('span');
                        var coordinates = [latlng[0].innerHTML, latlng[1].innerHTML];
                        var color = latlng[2].innerHTML; 
                        var gLatlng = new google.maps.LatLng(coordinates[1], coordinates[0]);
                        global_bounds.extend(gLatlng); 
                        if(color) {
                            new_marker = new google.maps.Marker({
                                position: gLatlng,
                                icon: cachedIcons[color],
                                shadow: cachedIcons[color].shadow
                            });
                        }
                        if(new_marker){
                            markers.push(new_marker); 
                        }
                    });
                    var center = global_bounds.getCenter();
                    this.map.setCenter(center);
                    if(mapObjects.length > 1) {
                        this.map.fitBounds(global_bounds);
                    }
                    return markers; 
                }, 

                decipherGRegions: function(mapObjects){
                    var regions = [];
                    mapObjects.each(function(index) {
                        var divsInfo = $(this);
                        var title = divsInfo.find('a')[0];
                        if (title) {
                            title = title.innerHTML;
                        } 
                        regions[title] = divsInfo;
                    });
                    return regions; 
                }, 

                placeGMarkers: function(markers, mapObjects){ 
                    for (var i = 0; i < markers.length; i++) { 
                        this.generateInfoWindows(markers[i], mapObjects[i]);
                        //add infowindow to marker array
                        //markers[i]['infowindow'] = infowindow; 
                        markers[i].setMap(this.map);
                    }
                }, 

                generateInfoWindows: function(marker, content){
                    //infowindow == config.customInfoWindow
                    content = $(content).clone()[0];
                    content.id = null;
                    google.maps.event.addListener(marker, "click", function(e) {
                            config.infoWindow.setContent(content);
                            config.infoWindow.open(this.map, marker.getPosition());
                    }); 
                },

                distinguishZoomLevel: function(type){
                    if (type==='country') {
                        return 5; 
                    } else if (type==='locality' || type==='postal_code') {
                        return 13; 
                    } else if (type==='street_address' || type==='point_of_interest') {
                        return 16; 
                    } else {
                        return 10; 
                    }
                }, 

                setupMapEditor: function(element){
                    var divMap = $(element);
                    var inputs = $('#latitude, #longitude');

                    if(inputs.length > 2) { 
                        return;
                    }
                    divMap.siblings('input').css('display','none');
                    var locationDiv = 
                        $('<div id="coordinates" class="locationString discreet"/>')
                        .appendTo(divMap)
                        .get(0);
                    var searchbutton = 
                        $('<input type="button" value="search" class="searchButton"/>')
                        .prependTo(divMap)
                        .get(0);
                    var searchinput = $('<input id="query" type="text" size="50" />')
                        .prependTo(divMap)
                        .get(0);

                    locationDiv.innerHTML = inputs[0].value + ', ' + inputs[1].value;
                    searchinput.value = inputs[0].value + ', ' + inputs[1].value; 
                }, 
                
                geocodeMarker: function(element){
                    var cachedIcons = this.icons;
                    var map = this.map;
                    var distinguishZoomLevel = this.distinguishZoomLevel;
                    var geocoder = new google.maps.Geocoder();
                    var divMap = $(element);
                    var inputs = $('#latitude, #longitude');
                    var center = new google.maps.LatLng(inputs[0].value, inputs[1].value);
                    var markerSelect = $('select#markerIcon');
                    var markerColor = markerSelect[0].value;
                    var locationDiv = $('div#coordinates')[0];
                    var searchinput = $('input[value=search]');
                    var queryinput = $('input#query');

                    map.setOptions({center: center, zoom: 5});
                    editableMarker = new google.maps.Marker({
                        draggable: true,
                        map: this.map,
                        position: center,
                        icon: cachedIcons[markerColor],
                        shadow: cachedIcons[markerColor].shadow
                    });

                    geocode = function(){ 
                        geocoder.geocode({'address':queryinput[0].value}, function(results, status) {
                            if (status == google.maps.GeocoderStatus.OK) { 
                                var point = results[0].geometry.location;
                                map.setOptions({
                                    'center':point,
                                    'zoom': distinguishZoomLevel(results[0].types[0])
                                });
                                editableMarker.setPosition(point);

                                inputs[0].value = point.lat();
                                inputs[1].value = point.lng();

                                locationDiv.innerHTML = point.lat() + ', ' + point.lng(); 
                                
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
                    markerSelect.bind('change', function (e) {
                        editableMarker.setIcon(cachedIcons[this.value]);
                        editableMarker.setShadow(cachedIcons[this.value].shadow);
                    });
                    google.maps.event.addListener(editableMarker, "dragend", function(e){
                        var point = e.latLng;
                        editableMarker.setPosition(point);
                        locationDiv.innerHTML = point.lat() + ', ' + point.lng();
                        queryinput[0].value = point.lat() + ', ' + point.lng(); 
                    }); 
                    google.maps.event.addListener(this.map, "click", function(e){
                        var point = e.latLng;
                        editableMarker.setPosition(point);
                        locationDiv.innerHTML = point.lat() + ', ' + point.lng();
                        queryinput[0].value = point.lat() + ', ' + point.lng(); 
                    }); 
                }

            }; 

            return this.each(function(index) { 
                var cachedIcons = _methods.cacheGMarkerTypes();
                var map = _methods.generateGMap(this);

                if(config.mode == 'edit') {
                    _methods.setupMapEditor(this);
                    _methods.geocodeMarker(this);
                    return;
                }
                var mapObjects = _methods.gatherMapObjects(this);
                if (config.type.regions === 'regions') {
                    var regions = _methods.decipherGRegions(mapObjects.regions);

                   if($('#kmlUrl').length > 0) {
                        _methods.addCTALayer(regions, mapObjects.regions);
                   } else {
                        _methods.createPolygons(mapObjects.regions); 
                   }
                }
                if(config.type.markers === 'markers') {
                    var gmarkers = _methods.decipherGMarkers(mapObjects.markers); 
                    _methods.placeGMarkers(gmarkers, mapObjects.markers);
                } 

                return map;
            });

    }; 

})(jq);

// analogous to $(document).ready() with $ as local namespace for legibility
jq(function($){
    
   // var mode = $('#gmap').hasClass('googleMapView') ? 'view' : 'edit';
    var mode = $('#archetypes-fieldname-longitude').length > 0 ? 'edit' : 'view';

    var type = [];
    type.markers = $('#gmap div.infoWindow').length > 0 ? 'markers' : null;
    type.regions = $('#gmap div.regionInfoWindow').length > 0 ? 'regions' : null;
        
    if(mode=='edit' && $('div#archetypes-fieldname-markerIcon').length > 0) {
        $('<div id="gmap"/>')
            .insertBefore('div#archetypes-fieldname-markerIcon')
            .append('<div id="googleMapPane"/>');
        $('#archetypes-fieldname-longitude, #archetypes-fieldname-latitude').hide();
    }

    var googleMapOptions = {
        //required
        mapTypeId: google.maps.MapTypeId.ROADMAP, //mapsConfig.google.defaultmaptype,
        zoom: 7,//mapsConfig.google.initialzoomlevel,
        center: new google.maps.LatLng(0,0), 
        //optional
        backgroundColor:'white',
        scrollwheel:false,
        mapTypeControl:false
    };

    var settings = {
        'mode' : mode,
        'type' : type,
        'mapOptions': googleMapOptions,
        'mapElement': '#googleMapPane',
        'styledMap' : { 'map': UWMapConfig, 'name': 'UW Map' },
        'infoWindow' : new UWInfoWindow(),
        'debug' : false 
    };

    $('#gmap').GoogleMapsV3(settings);
    
    //
    // DropDown Menu
    //

    var sortableArray = [];
    $('#geolocateAddress option').each(function(index, value) {
        sortableArray[index] = this.innerHTML.replace('State Senate','');
    });
        console.log(sortableArray.sort())

    //
    // Geolocate Search Bar and Select Options
    //
    if($('#geolocateAddress').length > 0) {
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

                            $.each(polygon_array, function(index, value){
                                regionHasAddress = value.contains(point);
                                if(regionHasAddress) {

                                    //var successString = 'Success! This location is in the '+$('#'+index+' a').html();
                                    //$('#geolocateInfo').attr('class', 'geocodeSuccess').html(successString).fadeIn();
                                    global_bounds = value.getBounds();
                                    value.setOptions({
                                        fillColor: "#FF00FF" 
                                    });

                                    content = $('#'+index);
                                    content = $(content).clone()[0];
                                    content.id = null;

                                    settings.infoWindow.setContent(content);
                                    google.maps.event.clearListeners(value, "mouseout");
                                    google.maps.event.clearListeners(value, "mouseover");

                                    global_googlemap.setOptions({
                                        center: point
                                    });

                                    global_googlemap.fitBounds(global_bounds);
                                    

                                    settings.infoWindow.open(global_googlemap, point);
                                    return false;
                                } 
                            });

                            if(regionHasAddress === false) {
                                alert('BETA! The location you searched for DOES exist on the map, but is located between regions (since the regions lines at the moment don\'t entirely line up). This issue will be resolved once we finalize the region boundaries. Sorry!');
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
    }
});
