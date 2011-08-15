PloneMap.KML = function( url ) {

    var map = this.supr.get( 'map' );

    document.getElementById( 'googleMapPane' ).style.height = 240 + 'px';

    google.maps.event.trigger( map, 'resize' )

    url = this.isLocalHost( url );

    var layer = new google.maps.KmlLayer( url , this.DEFAULTS );

    layer.setMap( map ); 

    
};

PloneMap.KML.prototype.isLocalHost = function( url ) {
    
    return ( url.indexOf( 'localhost:' ) != -1 ) ?
                'http://gmaps-samples.googlecode.com/svn/trunk/ggeoxml/cta.kml' : url.replace('https','http') ;


};

PloneMap.KML.prototype.DEFAULTS = {

        suppressInfoWindows: true

};

PloneMap.KML.prototype.supr  = PloneMap.prototype;
