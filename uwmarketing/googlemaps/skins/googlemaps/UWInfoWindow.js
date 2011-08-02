// Javascript for UW Popup Window and Custom Map Settings

PloneMap.UWInfoWindow = function() {

    this.createDiv();

    this.imageAnchor = {x: -242, y: -333}; 

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
    this.div.id = 'google-info-window';
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

    this.disableEvents();
    
};

PloneMap.UWInfoWindow.prototype.setContent = function( content ) {

    this.content = content.cloneNode( true );

};

PloneMap.UWInfoWindow.prototype.focus = function() {

    var map             = this.supr.get( 'map' );

    var projection      = this.getProjection();

    var conversion      = projection.fromLatLngToDivPixel( this.latlng );

    var point           = new google.maps.Point( conversion.x, conversion.y-190 );  

    var mapCenterLatLng = projection.fromDivPixelToLatLng( point );

    map.setCenter( mapCenterLatLng );

};

PloneMap.UWInfoWindow.prototype.onAdd = function() {

    if ( !this.div ) {

        this.createDiv();

    }

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

    while ( this.div.childNodes[0]  ) {
        this.div.removeChild( this.div.childNodes[0] );
    }

    this.div.parentNode.removeChild( this.div );

    this.div = null;
    

};

PloneMap.UWInfoWindow.prototype.disableEvents = function() {

  // We want to cancel all the events so they do not go to the map
  var events = [ 'mousedown', 'mouseover', 'mouseout', 'mouseup',
                 'mousewheel', 'DOMMouseScroll', 'touchstart', 'touchend', 
                 'touchmove', 'dblclick', 'contextmenu', 'click' ];

  var div = this.div;
  var closediv = this.closediv;
  this.listeners = [ ];
  for ( var i = 0, event; event = events[i]; i++ ) {

    this.listeners.push(

      google.maps.event.addDomListener( div, event, function( e ) {
            if( e.type === 'click' && e.target == closediv ) {
                return true;
            };

            e.cancelBubble = true;

            if ( e.stopPropagation ) {
              e.stopPropagation();
            }
      })

    );
  }

};

PloneMap.UWInfoWindow.prototype.bindWithMap = function() {
    
    this.supr.set( 'infowindow' , this );

}
