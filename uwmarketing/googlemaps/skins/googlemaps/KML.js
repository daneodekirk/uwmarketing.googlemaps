PloneMap.KML = function( ) {

    this.setOptions( this.DEFAULTS.normal );

    this.setOptions( options );

};

PloneMap.KML.prototype = new google.maps.KmlLayer();
PloneMap.KML.prototype.supr  = PloneMap.prototype;
