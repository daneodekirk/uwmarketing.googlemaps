// Javascript for Regions (just the KML file)
//  Passed JSLint

jQuery.noConflict()(document).ready(function($) { 
//jq(window).load(function(jq) { 

    var googleMapOptions = {
        //required
        mapTypeId: google.maps.MapTypeId.ROADMAP, //mapsConfig.google.defaultmaptype,
        zoom: 7,//mapsConfig.google.initialzoomlevel,
        center: new google.maps.LatLng(47.398349,-120.695801), 
        //optional
        backgroundColor:'white',
        scrollwheel:false,
        mapTypeControl:false
    };

    $("#gmap").addClass("googleMapActive");
    
    var map = new google.maps.Map(
        $("#googleMapPane").addClass("googleMapPane").get(0), 
        googleMapOptions
    );

    var bounds = new google.maps.LatLngBounds();

    if(typeof(UWMapConfig) !== 'undefined') {
        var branded_map = new google.maps.StyledMapType(UWMapConfig, {name: "Branded Map"});
        map.mapTypes.set("Branded Map", branded_map);
        map.setMapTypeId("Branded Map");
    }

    //if(google_map.mode === 'view') {
    /*google_map.info_window = new UWInfoWindow();*/
    /*google_map.map.setCenter(google_map.bounds.getCenter());*/
    /*google_map.map.fitBounds(google_map.bounds);*/
    //}


    var kml_url = $("#gmap").find("span#kmlUrl").html();

    if(kml_url) { 
        var date = new Date().getTime();
        var kmlUrl = $('span#kmlUrl').html().replace('https://','http://');
        var ctaLayer =  new google.maps.KmlLayer(kmlUrl+'?'+date, {suppressInfoWindows: true});
        ctaLayer.setMap(map); 
    }

    //dropdown nav
    $('#choose-a-district > select')
        .bind('change', function (event) {
            var selected = $(event.target);
            if(selected.attr('id') != 'select-option') {
                document.location.href = selected.attr('value');
                return false;
        }
    });
});
