<tal:block define="_dummy python:request.response.setHeader('content-type','text/javascript;;charset=utf-8')" />
<metal:block i18n:domain="uwmarketing.googlemaps">
/**
 * A Marker with the established settings and event bindings.
 *
 * @param {google.maps.Map} map The map on which to attach the distance widget.
 *
 * @constructor
 */

var PloneMap = PloneMap || {} ;

PloneMap.prototype = new google.maps.MVCObject();

PloneMap.prototype.CURRENT_URL = '<tal:block tal:replace="context/absolute_url"/>';

/* MARKER HELPERS

PloneMap.prototype.markers_      = [];
PloneMap.prototype.addMarker = function( settings ) {
    var map    = this.get( 'map' );
    var center = map.get( 'center' );

    var marker = new PloneMap.Marker();

    marker.set( 'title', 'untitled' );
    marker.set( 'map', map );
    marker.set( 'position', center );

    marker.setOptions( settings );

    this.markers_.push( marker );
    return marker;
}

PloneMap.prototype.getMarkers = function( index ) {
    return this.markers_[ index ] || this.markers_;
}


/* Edit Widget
PloneMap.prototype.EditWidget = function () {

    var this_   = this;
    var div     = this.map.getDiv();
    //var inputs  = this.inputs;

    var inputs = jQuery('#latitude, #longitude');

    var geolocateWidgetHTML = [
            '<div id="geolocateWidget">',
            '<div id="coordinates" class="locationString discreet">',
            inputs.get(0).value + ', ' + inputs.get(0).value,
            '</div>',
            '<input id="query" type="text" size="50" value="' + inputs[0].value + ', ' + inputs[1].value + '" />',
            '<input id="queryinput" type="button" value="search" class="searchButton"/>',
            '</div>'
    ].join('');

    jQuery( geolocateWidgetHTML )
        .insertAfter( div )
        .find( '#queryinput' )
        .click( function() {
            this_.GeoLocate( document.getElementById('query').value ); 
        });

}

/* GeoLocate 

PloneMap.prototype.GeoLocate = function( value ) {

        var this_      = this;
        var geocoder   = new google.maps.Geocoder();

        geocoder.geocode( {
                'address': value 
            },
            function(results, status) {

                if (status == google.maps.GeocoderStatus.OK) { 

                    var point = results[0].geometry.location;

                    this_.get('map').setOptions({
                        'center': point,
                        'zoom': this_.distinguishZoomLevel(results[0].types[0])
                    });

                    this_.getMarkers( 0 ).setPosition( point );

                    document.getElementById('latitude').value  = point.lat();
                    document.getElementById('longitude').value = point.lng();

                    //locationDiv.html(point.lat() + ', ' + point.lng());
                    
                } else {
                    alert("Geocoding failed due to the following reasons: " + status); 
                }
            });
            // Prevent "You already submitted this form" message
            $("input[type=submit]").each(function(index) {
                    $(this).removeClass('submitting');
            });
            return false;

}


*/


</metal:block>
