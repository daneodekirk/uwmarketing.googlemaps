// Javascript for UW Popup Window and Custom Map Settings
//      passes JSLint

function UWInfoWindow () {
    //instantiate vars
    //for now we are using css to target the div id below 
    //leaving javascript css commented for now
    this.createDiv();
    //this.image = "url(<tal:block tal:replace="context/absolute_url"/>/infoWindow.png)";
    //this.height = "313px";
    //this.width = "475px";
    this.imageAnchor = {x: -242, y: -333}; 
    if(this.div.id !== undefined) {
        this.div.id='google-info-window';
    }
}


    UWInfoWindow.prototype = new google.maps.OverlayView();

    UWInfoWindow.prototype.open = function(map, latlng) {
        this.map = map;
        this.latlng = latlng;
        this.setMap(map);
    };

    UWInfoWindow.prototype.createDiv = function() {
        this.div = document.createElement('DIV');
        this.div.style.border = "none";
        this.div.style.borderWidth = "0px";
        this.div.style.position = "absolute";
    };

    UWInfoWindow.prototype.close = function() {
        if(this.div.parentNode) {
            this.div.parentNode.removeChild(this.div);
        }
    };


    UWInfoWindow.prototype.setContent = function(content) {
        if(!this.div) {
            this.createDiv();
        }
        this.newContent = content;
        //this.div.style.height = this.height;
        //this.div.style.width = this.width;
        //this.div.style.backgroundImage = this.image;
        //this.newContent.style.display = "";
        
        //[TODO] find out if this is really unneccsary
        //this.div.appendChild(this.newContent);
    };

    UWInfoWindow.prototype.focus = function() {
        var projection = this.getProjection();
        var point = projection.fromLatLngToDivPixel(this.latlng);
        var gPoint = new google.maps.Point(point.x, point.y-190);  
        var mapCenterLatLng = projection.fromDivPixelToLatLng(gPoint);
        this.map.setCenter(mapCenterLatLng);
    };

    UWInfoWindow.prototype.onAdd = function() {
        this.content = this.newContent;
        var panes = this.getPanes();
        panes.floatPane.appendChild(this.div); 
        this.focus();
    };

    UWInfoWindow.prototype.draw = function() {
        //draw the infowindow based on pixeltolatlng    
        //pretty sure this gets called onzoom and map change (not drag)
        var overlayProjection = this.getProjection();
        var infowindowPosition = overlayProjection.fromLatLngToDivPixel(this.latlng);

        var div = this.div;
        div.style.left = infowindowPosition.x + this.imageAnchor.x + 'px';
        div.style.top = infowindowPosition.y + this.imageAnchor.y + 'px';
        //[TODO]figure out why this wont be appended multiple times?
        this.div.appendChild(this.newContent);
    };

    UWInfoWindow.prototype.onRemove = function() {
        //remove the div/infowindow
        this.div.removeChild(this.content);
    };

//UW Map Colors
var UWMapConfig = [
 {
   featureType: "water",
   elementType: "all",
   stylers: [
     { hue: "#0099ff" },
     { saturation: -9 },
     { lightness: 33 }
   ]
 },{
   featureType: "transit",
   elementType: "all",
   stylers: [
     { visibility: "off" }
   ]
 },{
   featureType: "landscape",
   elementType: "all",
   stylers: [
     { visibility: "off" }
   ]
 },{
   featureType: "poi",
   elementType: "all",
   stylers: [
     { visibility: "off" }
   ]
 },{
   featureType: "transit.station.airport",
   elementType: "all",
   stylers: [
     { visibility: "off" }
   ]
 },{
   featureType: "road.arterial",
   elementType: "geometry",
   stylers: [
     { hue: "#ffcc00" },
     { saturation: -57 },
     { lightness: 41 },
     { visibility: "on" }
   ]
 },{
   featureType: "all",
   elementType: "all",
   stylers: [

   ]
 },{
   featureType: "all",
   elementType: "all",
   stylers: [

   ]
 },{
   featureType: "road.highway",
   elementType: "labels",
   stylers: [
     { gamma: 9.75 },
     { hue: "#ffb300" },
     { saturation: -100 },
     { lightness: 39 }
   ]
 },{
   featureType: "road.highway",
   elementType: "geometry",
   stylers: [
     { hue: "#ffb300" },
     { lightness: 42 },
     { saturation: -62 },
     { gamma: 0.66 }
   ]
 },{
   featureType: "road.arterial",
   elementType: "labels",
   stylers: [
     { visibility: "on" },
     { hue: "#ff0000" },
     { gamma: 1.8 },
     { saturation: -99 },
     { lightness: 44 }
   ]
 },{
   featureType: "poi.park",
   elementType: "all",
   stylers: [
     { visibility: "on" },
     { lightness: 33 },
     { hue: "#22ff00" },
     { saturation: -49 }
   ]
 },{
   featureType: "poi.park",
   elementType: "labels",
   stylers: [
     { saturation: -60 }
   ]
 },{
   featureType: "all",
   elementType: "all",
   stylers: [

   ]
 }
];
