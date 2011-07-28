PloneMap.Geocoder = function() {

    this.input = document.getElementById( 'geolocateSearch' );

    this.search = document.getElementById( 'searchsubmit' );

    this.bindEvents();

};

PloneMap.Geocoder.prototype = new google.maps.Geocoder();
PloneMap.Geocoder.prototype.supr = PloneMap.prototype;

PloneMap.Geocoder.prototype.clearInput = function( ) {
    
    this.value = ( this.value == this.title ) ? '' : this.value;

};

PloneMap.Geocoder.prototype.geocodeAddressToLatLng = function() {

    var this_ = this;

    this.geocode( { 'address' : this.input.value }, function( results , status ) {

        var polygons = this_.supr.polygons_;
        var length   = polygons.length;

        if (status == google.maps.GeocoderStatus.OK) { 

            var point = results[0].geometry.location;
            var map   = this_.supr.get( 'map' );
            var infow = this_.supr.get( 'infowindow' );

            while( length-- ) {

                var polygon = polygons[ length ];

                if( polygon.contains( point ) ) {

                    var bounds = polygon.getBounds();
                    var div = document.getElementById( polygon.title_ );

                    map.fitBounds( bounds );

                    infow.setContent( div );

                    infow.open( point );

                    break;
                }

            }
        }
    });
}

PloneMap.Geocoder.prototype.bindEvents = function() {

    var this_ = this;

    google.maps.event.addDomListener( this.search , 'click' , function() { 

        this_.geocodeAddressToLatLng();

    });
    
    google.maps.event.addDomListener( this.input , 'click' , this.clearInput );
}
