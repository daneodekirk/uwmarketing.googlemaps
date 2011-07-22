//
//      Passes JSLint


//This is the global variable
//   used so we don't pollute the global namespace
var google_map = {};

//jq(document).ready(function($) {
jq(window).load(function(jq) {
    // Stuff to do as soon as the DOM is ready;
    //



//try this
// if this works ill shoot my foot off...not
//jQuery(function($) { 


//then try this (should work)
//$(window).load(function(jq) {


//then try this
// var element = $.browser.msie ? document : window;
// var events = $.browser.msie ? 'ready' : 'load';
//
// $(element).bind(events, function(jq) {

    google_map.mode = $('#archetypes-fieldname-title').length > 0 ? 'edit' : 'view';

    if(google_map.mode === 'edit') {
        $('<div id="gmap"/>')
            .insertBefore('div#archetypes-fieldname-markerIcon')
            .append('<div id="googleMapPane"/>');
        $('#archetypes-fieldname-longitude, #archetypes-fieldname-latitude').hide();
    }

    if($('#gmap').length > 0) {
    
        google_map.iconCache = {};
        /*$.each(mapsConfig.google.markericons, function(index) {
                var googleIcon = new google.maps.MarkerImage(
                        this.icon,
                        new google.maps.Size(parseFloat(this.iconSize[0]), parseFloat(this.iconSize[1])),
                        new google.maps.Point(0,0),
                        new google.maps.Point(parseFloat(this.iconAnchor[0]), parseFloat(this.iconAnchor[1]))
                        );
                var googleShadow = new google.maps.MarkerImage(
                        this.shadow,
                        new google.maps.Size(parseFloat(this.shadowSize[0]), parseFloat(this.shadowSize[1])),
                        new google.maps.Point(0,0),                                                                             
                        new google.maps.Point(2,14)
                );
                google_map.iconCache[this.name] = googleIcon;
                google_map.iconCache[this.name].shadow = googleShadow; 
        });
        */

        var googleMapOptions = {
            //required
            mapTypeId: google.maps.MapTypeId.ROADMAP, //mapsConfig.google.defaultmaptype,
            zoom: 7,//mapsConfig.google.initialzoomlevel,
            center: new google.maps.LatLng(100,100), 
            //optional
            backgroundColor:'white',
            scrollwheel:false,
            mapTypeControl:false
        };

        $("#gmap").addClass("googleMapActive");
        
        google_map.map = new google.maps.Map(
            $("#googleMapPane").addClass("googleMapPane").get(0), 
            googleMapOptions
        );

        google_map.bounds = new google.maps.LatLngBounds();

        if(UWMapConfig) {
            var branded_map = new google.maps.StyledMapType(UWMapConfig, {name: "Branded Map"});
            google_map.map.mapTypes.set("Branded Map", branded_map);
            google_map.map.setMapTypeId("Branded Map");
        }

        if(google_map.mode === 'view') {
            google_map.info_window = new UWInfoWindow();
            google_map.map.setCenter(google_map.bounds.getCenter());
            //[TODO] only fit bounds if more than one marker
            google_map.map.fitBounds(google_map.bounds);
        }

    } 
});
