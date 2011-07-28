PloneMap.KML = function( url ) {

    url = this.isLocalHost( url );

    var layer = new google.maps.KmlLayer( url , this.DEFAULTS );

    layer.setMap( this.supr.get( 'map' ) ); 

    
};

PloneMap.KML.prototype.isLocalHost = function( url ) {
    
    return ( url.indexOf( 'localhost:' ) != -1 ) ?
                'http://gmaps-samples.googlecode.com/svn/trunk/ggeoxml/cta.kml' : url;


};

PloneMap.KML.prototype.DEFAULTS = {

        suppressInfoWindows: true

};

PloneMap.KML.prototype.supr  = PloneMap.prototype;
