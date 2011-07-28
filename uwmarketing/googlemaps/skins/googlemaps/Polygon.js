PloneMap.Polygon = function( title, options ) {

    this.title_ = title;
    
    this.setOptions( this.DEFAULTS.normal );

    this.setOptions( options );

    this.addToMap();

    this.bindEvents();

};

PloneMap.Polygon.prototype = new google.maps.Polygon();
PloneMap.Polygon.prototype.supr  = PloneMap.prototype;


    
PloneMap.Polygon.prototype.addToMap = function( ) {
    
    this.setMap( this.supr.get( 'map' ) );

};

PloneMap.Polygon.prototype.bindEvents = function( ) {

    google.maps.event.addListener( this , 'mouseover' , function( ) {

        this.setOptions( this.DEFAULTS.mouseover );    

        //this.supr.set( 'activePolygon' , this );

    });

    google.maps.event.addListener( this , 'mouseout' , function( ) {

        this.setOptions( this.DEFAULTS.normal );    

        //var cached = this.supr.get( 'activePolygon' );

        //cached.setOptions( this.DEFAULTS.normal );

    });

    google.maps.event.addListener( this , 'click' , function( event ) {
        
        var infowindow = this.supr.get( 'infowindow' );

        var div = document.getElementById( this.title_ );

        infowindow.setContent( div );
        
        infowindow.open( event.latLng );

    });
}

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
