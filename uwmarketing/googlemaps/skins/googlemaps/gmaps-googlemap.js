// Javascript for Google Map View
//    This Javascript runs the polygons on the map

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


jq(document).ready(function($) {

    var regions = [];

    $("#gmap")
        .find("div.regionInfoWindow")
        .each(function(index){
            var regions = [],
                divsInfo = $(this),
                title = divsInfo.find('a')[0];
            if (title) {
                title = title.innerHTML;
            } 
            regions[title] = divsInfo;
        });

    if(typeof(polygons) != 'undefined') {

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

                  //_methods.generatePolyInfoWindows(theBizzyPolyBitches, index);

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
                
                  google_map.bounds.extend(polygons[index][0]);
                      
                  theBizzyPolyBitches.setMap(google_map.map);

                  //polygon_array[index] = (theBizzyPolyBitches);
            });
    }
});
