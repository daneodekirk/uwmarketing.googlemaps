<tal:block define="_dummy python:request.response.setHeader('content-type','text/javascript;;charset=utf-8')" />
<metal:block i18n:domain="uwmarketing.googlemaps">

/**
 * A Marker with the established settings and event bindings.
 *
 * @param {google.maps.Map} map The map on which to attach the distance widget.
 *
 * @constructor
 */

PloneMap.Marker = function( type ) {
    this.setType( type || this.DEFAULTS.type )
};
PloneMap.Marker.prototype = new google.maps.Marker();


PloneMap.Marker.prototype.DEFAULTS = {
    draggable: false,
    type: 'Gold'
    //icon: 
}

//var editableMarker = new google.maps.Marker({
//            draggable: true,
//            map: google_map,
//            position: center,
//            icon: currentMarker.url,
//            shadow: new google.maps.MarkerImage(currentMarker.shadow,
//                  new google.maps.Size(currentMarker.shadowSize[0], currentMarker.shadowSize[1]),
//                  new google.maps.Point(0,0),
//                  new google.maps.Point(currentMarker.shadowAnchor[0], currentMarker.shadowAnchor[1]))
//
//              });


PloneMap.Marker.prototype.setType = function( color ) {
    var marker = this.TYPES_[ color ];
    this.setOptions({
        icon: this.SITE_URL + marker.url,
        shadow: new google.maps.MarkerImage( 
              this.SITE_URL + marker.shadow,
              new google.maps.Size(marker.shadowSize[0], marker.shadowSize[1]),
              new google.maps.Point(0,0),
              new google.maps.Point(marker.shadowAnchor[0], marker.shadowAnchor[1]))
       });
};

PloneMap.Marker.prototype.SITE_URL = '<tal:block tal:replace="context/absolute_url"/>';
PloneMap.Marker.prototype.TYPES_   = {
            'Red': {
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
            'Green': {
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
            'Blue': {
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
            'Gold': {
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
            'Purple': {
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

</metal:block>