//Javascript for Google Markers
//  Passes JSLint

google.maps.Marker.prototype.customInfoWindow = function(info_window, map, content) {
    // 'this' refers to the current marker 
    google.maps.event.addListener(this, "click", function(e) {
        info_window.setContent(content);
        info_window.open(map, this.getPosition());
    }); 
};

//jQuery.noConflict()(function($) { 
//jQuery.noConflict()(document).ready(function() {
//jq(document).ready(function($) {
jq(window).load(function(jq) {
    if($('#gmap').length > 0) {

        if(google_map.mode === 'view') {
            //var info_window = new UWInfoWindow(); 
            $("#gmap")
                .find("div.infoWindow")
                .each(function(index){
                    //var new_marker = null;
                    var latlng = $(this).find('span'), 
                        content = this,
                        coordinates = [latlng[0].innerHTML, latlng[1].innerHTML],
                        color = latlng[2].innerHTML, 
                        gLatlng = new google.maps.LatLng(coordinates[1], coordinates[0]);

                    google_map.bounds.extend(gLatlng); 

                    if(color) {
                        new_marker = new google.maps.Marker({
                            position: gLatlng,
                            icon: google_map.iconCache[color],
                            shadow: google_map.iconCache[color].shadow
                        }); 
                        new_marker.customInfoWindow(google_map.info_window, google_map.map, content);
                    }

                    new_marker.setMap(google_map.map); 
                });

            google.maps.event.addListener(google_map.map, "click", function(e) {
                google_map.info_window.close();
            }); 

        }
    }
});
