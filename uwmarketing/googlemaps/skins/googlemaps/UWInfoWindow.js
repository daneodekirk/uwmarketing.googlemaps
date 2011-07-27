// Javascript for UW Popup Window and Custom Map Settings

PloneMap.UWInfoWindow = function() {

    this.createDiv();

    this.imageAnchor = {x: -242, y: -333}; 

    if( this.div.id !== undefined ) {

        this.div.id = 'google-info-window';

    }

    this.bindWithMap();

};

PloneMap.UWInfoWindow.prototype      = new google.maps.OverlayView();
PloneMap.UWInfoWindow.prototype.supr = PloneMap.prototype;

PloneMap.UWInfoWindow.prototype.open = function( latlng ) {

    this.latlng = latlng;

    this.setMap( this.supr.get( 'map' ) );

};

PloneMap.UWInfoWindow.prototype.createDiv = function() {

    this.div = document.createElement('DIV');
    this.div.style.border = "none";
    this.div.style.borderWidth = "0px";
    this.div.style.position = "absolute";

    this.closediv = document.createElement('DIV');
    this.closediv.id = 'closeWindow';
    this.closediv.className = 'closeButton';

    //this.closediv.onclick = function() { 
    //    google.maps.event.trigger(this_.map, 'click');
    //};

    this.div.appendChild(this.closediv);
    
};

PloneMap.UWInfoWindow.prototype.close = function() {
    if(this.div.parentNode) {
        this.div.parentNode.removeChild(this.div);
    }
};

PloneMap.UWInfoWindow.prototype.setContent = function(content) {

    if( !this.div ) {

        this.createDiv();

    }

    this.content = content;

};

PloneMap.UWInfoWindow.prototype.focus = function() {

    var map = this.supr.get( 'map' );

    var projection = this.getProjection();

    var point = projection.fromLatLngToDivPixel( this.latlng );

    var gPoint = new google.maps.Point( point.x, point.y-190 );  

    var mapCenterLatLng = projection.fromDivPixelToLatLng( gPoint );

    map.setCenter(mapCenterLatLng);
};

PloneMap.UWInfoWindow.prototype.onAdd = function() {

    this.disableEvents();

    var panes = this.getPanes();

    panes.floatPane.appendChild(this.div); 

    this.focus();

};

PloneMap.UWInfoWindow.prototype.draw = function() {

    var overlayProjection = this.getProjection();

    var infowindowPosition = overlayProjection.fromLatLngToDivPixel(this.latlng);

    var div = this.div;

    div.style.left = infowindowPosition.x + this.imageAnchor.x + 'px';

    div.style.top = infowindowPosition.y + this.imageAnchor.y + 'px';

    this.content.style.display = '';  

    this.div.appendChild( this.content );

};

PloneMap.UWInfoWindow.prototype.onRemove = function() {
    //remove the div/infowindow
    this.div.removeChild(this.content);
};

PloneMap.UWInfoWindow.prototype.disableEvents = function() {
  // We want to cancel all the events so they do not go to the map

  var events = ['mousedown', 'mouseover', 'mouseout', 'mouseup',
                'mousewheel', 'DOMMouseScroll', 'touchstart', 'touchend', 
                'touchmove', 'dblclick', 'contextmenu', 'click'];

  var div = this.div;
  this.listeners = [];
  for (var i = 0, event; event = events[i]; i++) {
    this.listeners.push(
      google.maps.event.addDomListener(div, event, function(e) {
            e.cancelBubble = true;
            if (e.stopPropagation) {
              e.stopPropagation();
            }
      })
    );
  }
}

PloneMap.UWInfoWindow.prototype.bindWithMap = function() {
    
    this.supr.set( 'infowindow' , this );

}
