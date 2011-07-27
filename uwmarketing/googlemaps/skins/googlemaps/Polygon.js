PloneMap.Polygon = function( options ) {

    this.setOptions( this.DEFAULTS.normal );

    this.setOptions( options );

    this.addToMap();

    this.bindEvents();

};

PloneMap.Polygon.prototype.DEFAULTS = {

    normal   : { 
                    strokeColor: "#333",
                    strokeOpacity: 1,
                    strokeWeight: 2,
                    fillColor: "#d7a900",
                    fillOpacity: 0.4

               },

    mousein  : {
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
    
PloneMap.Polygon.prototype.addToMap = function( ) {
    
    this.setMap( this.supr.get( 'map' ) );

};

PloneMap.Polygon.prototype = new google.maps.Polygon();

PloneMap.Polygon.prototype.supr  = PloneMap.prototype;

