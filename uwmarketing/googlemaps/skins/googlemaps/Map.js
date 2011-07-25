/**
 * A Marker with the established settings and event bindings.
 *
 * @param {google.maps.Map} map The map on which to attach the distance widget.
 *
 * @constructor
 */
function PloneMap(settings) {
  //var options = $.extend({}, this.SETTINGS, settings);

  var map = new google.maps.Map(document.getElementById("gmap"), this.SETTINGS);

  this.set('map', map);
  this.set('position', map.getCenter());

}

PloneMap.prototype = new google.maps.MVCObject();

PloneMap.SEATTLE = new google.maps.LatLng(47.595977,-122.33139);

PloneMap.prototype.SETTINGS = {
    center : this.SEATTLE
}

