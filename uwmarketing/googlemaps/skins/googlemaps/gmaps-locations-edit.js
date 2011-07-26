// Javascript for Regions (just the KML file)
// Passes JSLint



jQuery.noConflict()(window).load(function( ) { 
    $ = jQuery.noConflict();

    if($('#archetypes-fieldname-title').length > 0 ) {

    $('<div id="gmap"/>')
        .insertBefore('div#archetypes-fieldname-markerIcon')
        .append('<div id="googleMapPane"/>');

        var map = new PloneMap( document.getElementById('gmap') );
        var marker = map.addMarker( {
            draggable: true    
        });

        map.EditWidget( map );

        var init_color = $('#markerIcon').change(function() {
            var color   = this.value.split(' ').shift();
            marker.setType( color ); 
        }).val();

        marker.setType( init_color.split(' ').shift() );


        

        /*
        if(typeof(UWMapConfig) !== 'undefined') {
            var branded_map = new google.maps.StyledMapType(UWMapConfig, {name: "Branded Map"});
            google_map.mapTypes.set("Branded Map", branded_map);
            google_map.setMapTypeId("Branded Map");
        }

       queryinput.bind('click blur keypress', function(event) {
            if(event.type == 'click') {
                this.cached_value = this.value;
                this.value = '';
            }
            if(event.type == 'blur') {
                this.value = this.cached_value; 
            } 
            if(event.type == 'keypress' && event.keyCode === 13) {
                event.preventDefault();
                searchinput.click();
                this.cached_value = this.value;
            }
        });

        markerSelect.bind('change', function (e) {
            editableMarker.setIcon(iconCache[this.value]);
            //editableMarker.setShadow(iconCache[this.value].shadow);
        });

        google.maps.event.addListener(editableMarker, "dragend", function(e){
            var point = e.latLng;
            editableMarker.setPosition(point);
            locationDiv.html(point.lat() + ', ' + point.lng());
            queryinput[0].value = point.lat() + ', ' + point.lng(); 
            inputs[0].value = point.lat();
            inputs[1].value = point.lng();
        }); 

        google.maps.event.addListener(google_map, "click", function(e){
            var point = e.latLng;
            editableMarker.setPosition(point);
            locationDiv.html(point.lat() + ', ' + point.lng());
            queryinput[0].value = point.lat() + ', ' + point.lng(); 
            inputs[0].value = point.lat();
            inputs[1].value = point.lng();
        }); 
*/

}
});
