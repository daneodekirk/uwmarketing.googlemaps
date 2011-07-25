/**
 * A Marker with the established settings and event bindings.
 *
 * @param {google.maps.Map} map The map on which to attach the distance widget.
 *
 * @constructor
 */
function PloneMarker(settings) {
    
  var options = jq.extend({}, this.OPTIONS, settings);

  this.set('map', map);
  this.set('position', map.getCenter());
  this.

  // Bind the marker map property to the DistanceWidget map property
  marker.bindTo('map', this);
}

PloneMarker.prototype = new google.maps.Marker();

PloneMarker.prototype.OPTIONS = {
        draggable: true,
        title: 'Move me!'
}
