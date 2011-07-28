PloneMap.Geocoder = function( ) {


    this.error = '';

}

PloneMap.Geocoder.prototype = new google.maps.Geocoder();
PloneMap.Geocoder.prototype.supr = PloneMap.prototype;


PloneMap.Geocoder.prototype.addressToLatLng = function() {
    return this.geocode( { 'address' , this.query }, this.queryAddress );
}

PloneMap.Geocoder.prototype.queryAddress    = function( results, status ) {
    
    if (status == google.maps.GeocoderStatus.OK) { 

        var point = results[0].geometry.location;

        for (var region in polygons ) {


        }

    }
}
