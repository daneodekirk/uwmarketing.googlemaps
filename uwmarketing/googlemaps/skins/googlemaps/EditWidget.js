PloneMap.EditWidget = function () {

    var index = document.getElementById( 'markerIcon' ).selectedIndex;

    this.lat  = document.getElementById( 'latitude' ).value;
    this.lng  = document.getElementById( 'longitude' ).value;
    this.type = document.getElementById( 'markerIcon' ).options[ index ].text; 

    this.createMap();

    this.insertMap();

    this.placeMarker();

    this.supr.edit_mode = { 

        'enabled' : true,

        'marker'  : this.gmarker

    }

};


PloneMap.EditWidget.prototype = {

    createMap : function() {

        this.mapdiv = document.createElement( 'DIV' );

        this.mapdiv.id = 'googleMapPane';

        this.mapdiv.style.height    = '500px';

        this.mapdiv.style.marginTop = '15px';
        
    },

    insertMap : function() {

        document.getElementById( 'archetypes-fieldname-latitude' ).style.display = 'none';

        document.getElementById( 'archetypes-fieldname-longitude' ).style.display = 'none';

        var field = document.getElementById( 'archetypes-fieldname-markerIcon' );

        var parent_node = field.parentNode;

        parent_node.insertBefore( this.mapdiv , field );

    },

    placeMarker : function() {

        if ( this.lat == 0  || this.lng == 0 ) {

            this.createMarkerForMap();

        }  else {

            this.createExistingMarker();
        }

        this.placeMarkerOnMap();

        this.bindEvents();

    },

    createMarkerForMap : function() {

        this.marker = {

            type    : "Gold Marker",

            options : {

                'position' : new google.maps.LatLng( this.lat, this.lng ),
                'title'    : 'Draggable',
                'draggable': true

            }

        }

    },

    createExistingMarker : function() {
        
        this.marker = {

            type    : this.type,

            options : {

                'position' : new google.maps.LatLng( this.lat, this.lng ),
                'title'    : 'Draggable',
                'draggable': true

            }
        }


    },

    placeMarkerOnMap : function() {
        
        this.gmarker = new PloneMap.Marker( this.marker.type , this.marker.options );


        
    },

    bindEvents: function() {

        var this_ = this;
        
        google.maps.event.addListener( this.gmarker , 'drag' , function( event ) {

            this_.setLat( event.latLng.lat() );
            this_.setLng( event.latLng.lng() );

        });

        google.maps.event.addDomListener( document.getElementById( 'markerIcon') , 'change' , function( event ) {


            this_.gmarker.setType( this.value );

        });
        
    },

    setLat : function ( lat ) {

        this.lat = lat;

        document.getElementById( 'latitude' ).value = lat;

    },

    setLng : function ( lng ) {

        this.lng = lng;

        document.getElementById( 'longitude' ).value = lng;

    }
};

PloneMap.EditWidget.prototype.supr = PloneMap;
