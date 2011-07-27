PloneMap.Marker = function( type , options ) {

    this.setType( type || this.DEFAULTS.type );
    
    this.setOptions( options );

    this.addToMap();

    this.bindEvents();

};

PloneMap.Marker.prototype = new google.maps.Marker();

PloneMap.Marker.prototype.DEFAULTS = {
        draggable: false,
        type: 'Gold'
};

PloneMap.Marker.prototype.setType = function( color ) {

        var marker = this.TYPES_[ color ];

        this.setOptions({

            icon: this.supr.CURRENT_URL + marker.url,

            shadow: new google.maps.MarkerImage( this.supr.CURRENT_URL + '/uwmarker-shadow.png',
                                   new google.maps.Size( 29 , 13 ),
                                   new google.maps.Point( 0 , 0 ),
                                   new google.maps.Point( 3 , 15 ))
            });
};

PloneMap.Marker.prototype.addToMap = function ( ) {

        this.setMap( this.supr.get('map') );

        //this.supr.extendBounds( this.getBou

};

PloneMap.Marker.prototype.bindEvents = function ( ) {

    google.maps.event.addListener( this,  'click' , function() {
        console.log(this.title);
    });

};

PloneMap.Marker.prototype.supr  = PloneMap.prototype;


PloneMap.Marker.prototype.TYPES_   = {
            'Red Marker': {
                'infoShadowAnchor': [18, 25],
                'name': 'Red Marker',
                'iconSize': [28, 37],
                'iconAnchor': [13, 36],
                'shadowSize': [29, 13],
                'shadow': '/uwmarker-shadow.png',
                'shadowAnchor': [3, 15],
                'infoWindowAnchor': [14, 6],
                'url': '/uwmarker-red.png'
            },
            'Green Marker': {
                'infoShadowAnchor': [18, 25],
                'name': 'Green Marker',
                'iconSize': [28, 37],
                'iconAnchor': [13, 36],
                'shadowSize': [29, 13],
                'shadow': '/uwmarker-shadow.png',
                'shadowAnchor': [3, 15],
                'infoWindowAnchor': [14, 6],
                'url': '/uwmarker-green.png'
            },
            'Blue Marker': {
                'infoShadowAnchor': [18, 25],
                'name': 'Blue Marker',
                'iconSize': [28, 37],
                'iconAnchor': [13, 36],
                'shadowSize': [29, 13],
                'shadow': +'/uwmarker-shadow.png',
                'shadowAnchor': [3, 15],
                'infoWindowAnchor': [14, 6],
                'url': '/uwmarker-blue.png'
            },
            'Gold Marker': {
                'infoShadowAnchor': [18, 25],
                'name': 'Gold Marker',
                'iconSize': [28, 37],
                'iconAnchor': [13, 36],
                'shadowSize': [29, 13],
                'shadow': +'/uwmarker-shadow.png',
                'shadowAnchor': [3, 15],
                'infoWindowAnchor': [14, 6],
                'url': '/uwmarker-gold.png'
            },
            'Purple Marker': {
                'infoShadowAnchor': [18, 25],
                'name': 'Purple Marker',
                'iconSize': [28, 37],
                'iconAnchor': [13, 36],
                'shadowSize': [29, 13],
                'shadow': +'/uwmarker-shadow.png',
                'shadowAnchor': [3, 15],
                'infoWindowAnchor': [14, 6],
                'url': '/uwmarker-purple.png'
            }
}

