PloneMap.Polygon = function( title, options ) {

    this.title_ = title;

    this.infoPane = document.getElementById( 'geolocateInfo' );
    
    this.setOptions( this.DEFAULTS.normal );

    this.setOptions( options );

    this.addToMap();

    this.bindEvents();

};

PloneMap.Polygon.prototype = new google.maps.Polygon();
PloneMap.Polygon.prototype.supr  = PloneMap.prototype;
    
PloneMap.Polygon.prototype.addToMap = function( ) {
    
    var map     = this.supr.get( 'map' );
    var bounds  = this.supr.get( 'bounds' );

    this.setMap( map );

    bounds.union( this.getBounds() );

    map.fitBounds( bounds );

    this.supr.polygons_.push( this );

};

PloneMap.Polygon.prototype.bindEvents = function( ) {

    google.maps.event.addListener( this , 'mouseover' , function( ) {

        this.setOptions( this.DEFAULTS.mouseover );    

        this.showInfoPane();

    });

    google.maps.event.addListener( this , 'mouseout' , function( ) {

        this.setOptions( this.DEFAULTS.normal );    

        this.hideInfoPane();
        this.infoPane.style.display = 'none';

    });

    google.maps.event.addListener( this , 'click' , function( event ) {
        
        var infowindow = this.supr.get( 'infowindow' );

        var div = document.getElementById( this.title_ );

        infowindow.setContent( div );
        
        infowindow.open( event.latLng );

    });
}

PloneMap.Polygon.prototype.getBounds = function(latLng) {
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

PloneMap.Polygon.prototype.showInfoPane = function( ) {

    this.infoPane.innerHTML = this.title_;
    this.infoPane.style.display = 'block';

};

PloneMap.Polygon.prototype.hideInfoPane = function( ) {

    this.infoPane.innerHTML = '';
    this.infoPane.style.display = 'none';
};

PloneMap.Polygon.prototype.contains = function(latLng) { 
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


PloneMap.Polygon.prototype.DEFAULTS = {

    normal   : { 
                    strokeColor: "#333",
                    strokeOpacity: 1,
                    strokeWeight: 2,
                    fillColor: "#d7a900",
                    fillOpacity: 0.4

               },

    mouseover: {
                    strokeColor: "#222",
                    strokeOpacity: 1,
                    strokeWeight: 4,
                    fillColor: "#fff",
                    fillOpacity: 0.6 
               },

    mouseout  : {
                    strokeColor: "#000",
                    strokeOpacity: 0.4,
                    strokeWeight: 2,
                    fillColor: "#e0a300",
                    fillOpacity: 0.4 
                }

}
