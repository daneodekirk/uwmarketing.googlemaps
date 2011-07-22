
// start namespace
var mapsGoogleMaps = function() {
    // local shadows for improved packing

    var _mapsConfig = mapsConfig;
    var _mapsConfig_google = _mapsConfig.google;
    //var _locations = _mapsConfig.locationData;
    var _locations = null;
    var _cssQuery = cssQuery;
    //var _parseInt = parseInt;
    var _parseFloat = parseFloat;

    // privates

    var _markericons = null;
    var _defaultmaptype = null;

    var _localSearch = null;
    var _LayerControl = null;

    function _initDefaults($$defaults) {
        var locationData = {};
        jq('.infoWindow', '#gmap').each(function(index) {
            var latlng = jq(this).find('span');
            locationData[this.id] = { 
                'coordinates': [latlng[0].innerHTML, latlng[1].innerHTML],
                'markerColor': latlng[2].innerHTML
            };
        }); 
        _locations = locationData;
        if (_markericons == null) {
            _markericons = {};
            for (var j=0; j < $$defaults.markericons.length; j++) {
                var $definition = $$defaults.markericons[j];
                //create the default icons, put marker shadow and other attributes here if necessary
                var $icon = new google.maps.MarkerImage(
                        $definition['icon'],                                                                                    //url
                        new google.maps.Size(_parseFloat($definition['iconSize'][0]), _parseFloat($definition['iconSize'][1])),     //Size
                        new google.maps.Point(0,0),                                                                             //Origin
                        new google.maps.Point(_parseFloat($definition['iconAnchor'][0]), _parseFloat($definition['iconAnchor'][1])) //Anchor
                );
                var $shadow = new google.maps.MarkerImage(
                        $definition['shadow'],
                        new google.maps.Size(_parseFloat($definition['shadowSize'][0]), _parseFloat($definition['shadowSize'][1])),
                        new google.maps.Point(0,0),                                                                             
                        new google.maps.Point(2,14)
                );
                _markericons[$definition['name']] = $icon; 
                _markericons[$definition['name']]['shadow'] = $shadow; 
            }
        }
        if (_defaultmaptype == null) {
            if ($$defaults.defaultmaptype == 'satellite') {
                _defaultmaptype = google.maps.MapTypeId.SATELLITE;
            } else if ($$defaults.defaultmaptype == 'hybrid') {
                _defaultmaptype = google.maps.MapTypeId.HYBRID;
            } else if ($$defaults.defaultmaptype == 'physical') {
                _defaultmaptype = google.maps.MapTypeId.TERRAIN;
            } else {
                _defaultmaptype = google.maps.MapTypeId.ROADMAP;
            }
        }
    };

    function _addInfoWindow(map, marker, infowindow, content) {
        // this needs to be done in a seperate function to keep the correct
        // references to node and marker 
        content = jq(content).clone()[0];
        content.id = null;
        google.maps.event.addListener(marker, "click", function(e) {
                infowindow.setContent(content);
                infowindow.open(map, marker);
        }); 
    };

    function _createMarker($data) {
        $data['marker'] = new google.maps.Marker({
                'position': $data['point'], 
                'icon': $data['icon']
        }); 
    };

    function _getBounds($locations) {
        var $bounds = new google.maps.LatLngBounds();

        for (var i=0; i < $locations.length; i++) {
            $bounds.extend($locations[i]['point']);
        }
        return $bounds;
    };

    //not used anymore
    function _getLayers($$locations) {
        var $data = {names: [],
                     counts: {},
                     enabled_names: [],
                     enabled: {}
        };

        for (var i=0; i < $$locations.length; i++) {
            var $location = $$locations[i];

            if ($location['layers']) {
                for (var $name in $location['layers']) {
                    if ($data['counts'][$name] == null) {
                        $data['counts'][$name] = 1;
                        $data['names'].push($name);
                    } else {
                        $data['counts'][$name] = $data['counts'][$name] + 1;
                    }
                }
            }
        }

        for (var i=0; i < $data['names'].length; i++) {
            var $name = $data['names'][i];

            if ($data['counts'][$name] > 0) {
                $data['enabled'][$name] = true;
                $data['enabled_names'].push($name);
            } else {
                $data['enabled'][$name] = false;
            }
        }

        return $data;
    };


    function _initMap($node) {
        //jquery select map div
        var map_node = jq('#googleMapPane')[0]; 
        var markers = [];
        var bounds = new google.maps.LatLngBounds(); 
        //var infowindow = new google.maps.InfoWindow(); 
        var infowindow = new UWInfoWindow();
        //jquery select infowindow content 
        //speed enhancements for IE (using ID's not classes)
        var infoWindowContent = jq('#gmap > div:not(#googleMapPane)'); 

        for (var i = 0; i < infoWindowContent.length; i++) {
            var locationIndex = infoWindowContent[i].id;
            var current = _locations[locationIndex]; 
            //create latlngs in array and extend map boundaries
            var latlng = new google.maps.LatLng(current.coordinates[0], current.coordinates[1]);
            bounds.extend(latlng); 
            //find marker image url for this specific marker's color
            var color = _locations[locationIndex].markerColor;
            //make gmarkers and then store gmarkers in an array
            if(_markericons[color])
            {
            var new_marker = new google.maps.Marker({
                position: latlng,
                icon: _markericons[color],
                shadow: _markericons[color]['shadow']
            }); 
            markers.push(new_marker); 
            }
        }

        var center = bounds.getCenter();
        addClassName($node, 'googleMapActive');
        addClassName(map_node, 'googleMapPane');
        //why appendChild?
        //$node.appendChild(map_node);

        var _googleMapOptions = {
            backgroundColor:'white',
            zoom: 10,
            scrollwheel:false,
            mapTypeId: _defaultmaptype,
            mapTypeControl:false,
            center: center
        };

        //from map-config.js file
        if (_mapsConfig_google.selectablemaptypes) {
            _googleMapOptions.mapTypeControl = true;    
        }

        //create the map
        var map = new google.maps.Map(map_node, _googleMapOptions); 

        var uwmap = new google.maps.StyledMapType(UWMapConfig, {name: 'UW Map'});
        map.mapTypes.set('UW Map', uwmap);
        map.setMapTypeId('UW Map');

        
        //fit map boundaries only if more than one marker
        if(infoWindowContent.length > 1)
        {
            map.fitBounds(bounds); 
        }

        //place markers and add their click eventlistener
        for (var i = 0; i < markers.length; i++) { 
            _addInfoWindow(map, markers[i], infowindow, infoWindowContent[i]); 
            //add infowindow to marker array
            markers[i]['infowindow'] = infowindow; 
            markers[i].setMap(map);
        }

        //close all info windows when clicked off
        google.maps.event.addListener(map, 'click', function(e) {
            //for (var i=0; i < markers.length; i++) {
             //   var infowindow = markers[i]['infowindow'];
                infowindow.close();
            //}
        });
    };

    function _setupGeocoding($input, $map, $$marker, $location) {
        var $geocoder = new google.maps.Geocoder();
        var $query = document.createElement('input'); 
        var $search = document.createElement('input');
        var $form = null;
        var $old_submit = null;

        // search for the form
        $form = $input[0];
        do {
            if ($form.tagName) {
                if ($form.tagName.toLowerCase() == 'form') {
                    break;
                }
                if ($form.tagName.toLowerCase() == 'body') {
                    $form = null;
                    break;
                }
                $form = $form.parentNode;
            }
        } while ($form);

        $input[0].style.display = "none";
        $input[1].style.display = "none";
        $query.setAttribute("type", "text");
        $query.setAttribute("size", 50);
        //$query.id = "geolocationSearch";
        $query.value = $input[0].value + ', ' + $input[1].value;
        $search.setAttribute("type", "button");
        $search.value = "Search";
        $search.className = "searchButton";

        /*
         * 
         *  GLOBAL search
         *
         *  This is activated by default
         *
         */ 

        $$geocode = function () {
            $geocoder.geocode({'address':$query.value}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) { 
                    var $point = results[0].geometry.location;
                    $map.setOptions({
                        'center':$point,
                        'zoom': 14
                    });
                    $$marker.setPosition($point);

                    $input[0].value = $point.lat();
                    $input[1].value = $point.lng();

                    $location.innerHTML = $point.lat() + ", " + $point.lng();
                } else {
                    alert("Geocoding failed due to the following reasons: " + status); 
                }; 
            });
            // Prevent "You already submitted this form" message
            var $nodes = _cssQuery("input[type=submit]", $form);
            for (var j=0; j<$nodes.length; j++) {
               removeClassName($nodes[j], 'submitting');
            }
            return false;
        };

        /*
         *
         *  LOCAL search
         *
         *  This is turned off by default for the reasons listed below
         *  To see how this works, uncomment ajaxsearchkey in maps-config.js.pt and search for "Pizza" 
         *     in the Location search box.
         *
         */

        $$localquery = function(){
            var query = $query.value;
            _localSearch.setCenterPoint($map.getCenter());
            _localSearch.execute(query);
        };

        $$localsearch = function() { 
            // [TODO] Local search still needs a few features
            //  1. Clear markers on map with every search
            //  2. Add infowindow to markers and fill content with _localSearch.results[i].html
            //  3. Click on a marker and choose it as the location.
            //  4. Save all markers to database if needed.
            if (!_localSearch.results) return; 
            for (var i = 0; i < _localSearch.results.length; i++) {
                var lat =_parseFloat(_localSearch.results[i].lat);
                var lng =_parseFloat(_localSearch.results[i].lng);
                var latlng = new google.maps.LatLng(lat, lng);
                var local_marker = new google.maps.Marker({
                    position: latlng
                }); 
                local_marker.setMap($map);
                google.maps.event.addListener(local_marker, "click", function(e) {
                        var $point = e.latLng;
                        $input[0].value = $point.lat();
                        $input[1].value = $point.lng();
                        $location.innerHTML = $point.lat() + ", " + $point.lng();
                }); 
            }
            var $nodes = _cssQuery("input[type=submit]", $form);
            for (var j=0; j<$nodes.length; j++) {
               removeClassName($nodes[j], 'submitting');
            }
        };

        // If you supply an ajaxsearchkey you will get a local search instead of global search.  
        // As noted above: this needs more work to be meaningful
        if(_localSearch)
        { 
            _localSearch = new GlocalSearch(); 
            _localSearch.setSearchCompleteCallback(null, $$localsearch);
        };

        // When a user clicks the search button, they either execute a Local search or a global geocode
        $search.onclick = (_localSearch) ? $$localquery : $$geocode;

        $input[0].parentNode.insertBefore($query, $input[0]);
        $input[0].parentNode.insertBefore($search, $input[0]);
    };

    function _initLocationEditMap($node) {
        var $input = _cssQuery("input", $node);
        if ($input.length != 2)
        {
            return;
        }

        var $location = document.createElement('div');
        addClassName($location, "locationString discreet");

        var markerSelect = jq('select#markerIcon');
        var markerColor = markerSelect[0].value;

        var $$map_node = document.createElement('div');
        addClassName($node, 'googleMapActive');
        addClassName($$map_node, 'googleMapPane');
        $node.appendChild($$map_node);
        $node.appendChild($location);

        // This replaces _mapsConfig, and can probably be placed into the maps.js.pt file
        var _googleMapOptions = {
            backgroundColor:'white',
            zoom: 2, // World view
            scrollwheel:false,
            mapTypeControl: false,
            center: new google.maps.LatLng(0,0),
            mapTypeId: _defaultmaptype
        };


        // Focus the map on the marker if the marker isn't at Geolocation 0.0, 0.0
        // [TODO] if someone changes the default marker location, this will fail.
        if (_parseFloat($input[0].value) != 0.0) {
            _googleMapOptions.center = new google.maps.LatLng( _parseFloat($input[0].value) , _parseFloat($input[1].value ));
        }

        // This is overriding the above _googleMapOptions based on the the config in maps.js.pt
        if (_mapsConfig_google.selectablemaptypes) {
            _googleMapOptions.mapTypeControl = true;    
        }

        $map = new google.maps.Map($$map_node, _googleMapOptions);

        $location.innerHTML = $input[0].value + "," + $input[1].value;

        // This creates a new marker with given attributes and correct color
        var $$marker = new google.maps.Marker({
            draggable: true,
            map: $map,
            position: _googleMapOptions.center,
            icon: _markericons[markerColor],
            shadow: _markericons[markerColor]['shadow']
        });

        // This changes the marker color on the map when a user selects a different color
        // instead of staying Red the whole time.
        jq('select#markerIcon').bind('change', function (e) {
            $$marker.setIcon(_markericons[this.value]);
            $$marker.setShadow(_markericons[this.value]['shadow']);
        });

        // The drag event: on 'drag end' rewrite the new latitude and longitude
        google.maps.event.addListener($$marker, "dragend", function(e){
            var $point = e.latLng;
            $input[0].value = $point.lat();
            $input[1].value = $point.lng();
            $location.innerHTML = $point.lat() + ", " + $point.lng(); 
        });

        // The click event: on 'click' move marker to the clicked location and update latitude and longitude
        google.maps.event.addListener($map, "click", function(e) {
                var $point = e.latLng;
                $$marker.setPosition($point);
                $input[0].value = $point.lat();
                $input[1].value = $point.lng();
                $location.innerHTML = $point.lat() + ", " + $point.lng();
        });

        _setupGeocoding($input, $map, $$marker, $location);
    };

    // namespace dictionary
    return {
        init: function() {
            // Both items below deprecated in v3 (GUnload and GBrowserIsCompatible)
            // Kept here in case Google decides to reinstate them, there is a known bug in v3 regarding the lack of GUnload
            //registerEventListener(window, 'unload', GUnload); 
            //if (GBrowserIsCompatible()) {
                _initDefaults(_mapsConfig_google);
                
                var UWInfoWindow = InitUWInfoWindow();

                if (mapsConfig.google.ajaxsearchkey) {
                    _localSearch = true;
                }

                var $maps = _cssQuery("div.googleMapView");
                for (var i=0; i < $maps.length; i++) {
                    _initMap($maps[i]);
                }
                $maps = _cssQuery("div.googleMapEdit");
                for (var i=0; i < $maps.length; i++) {
                    _initLocationEditMap($maps[i]);
                }
          //  }
        },

        loadJS: function(url) {
            document.write('<'+'script type="text/javascript" src="'+url+'"><'+'/script>');
        }

    };
// end namespace
}();

//mapsGoogleMaps.loadJS("http://maps.google.com/maps/api/js?sensor=false");
if (mapsConfig.google.ajaxsearchkey) {
    mapsGoogleMaps.loadJS("http://www.google.com/uds/api?file=uds.js&amp;v=1.0&key="+mapsConfig.google.ajaxsearchkey);
}
//registerEventListener(window, 'load', mapsGoogleMaps.init);
