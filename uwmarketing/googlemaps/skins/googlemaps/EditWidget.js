PloneMap.EditWidget = function () {

    this.createMap();

    this.insertMap();


};

PloneMap.EditWidget.supr = PloneMap.prototype;

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


    }

};
