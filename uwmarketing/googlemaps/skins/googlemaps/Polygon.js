/**
 * A Marker with the established settings and event bindings.
 *
 * @param {google.maps.Map} map The map on which to attach the distance widget.
 *
 * @constructor
 */
function PloneMap(settings) {
  var options = $.extend({}, $.this.OPTIONS, settings);

  this.set('map', map);
  this.set('position', map.getCenter());

  var marker = new google.maps.Marker();

  // Bind the marker map property to the DistanceWidget map property
  marker.bindTo('map', this);
}

PloneMap.prototype = new google.maps.Map();

PloneMap.SETTINGS = {
    map    : document.getElementById('gmap'),
    center : 
}

PloneMap.prototype.OPTIONS = {
        draggable: true,
        title: 'Move me!'
}
