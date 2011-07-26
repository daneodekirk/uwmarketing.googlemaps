PloneMap.Map = function( element, options ) {

    this.map = new google.maps.Map( element , this.DEFAULTS);

    map.setOptions( options );

    this.supr.set('map', map);

    map.set('center', this.SEATTLE);

};

PloneMap.Map.prototype = {

    SEATTLE     : new google.maps.LatLng(47.595977,-122.33139),

    DEFAULTS    : {
                        zoom: 12,
                        mapTypeId: google.maps.MapTypeId.ROADMAP 
    }
    
};


PloneMap.Map.prototype.Helper = { 

    normZoom_ : function ( type ) {

        return type === 'country' ? 5  :
               type === 'administrative_area_level_1' || type === 'administrative_area_level_2' || type === 'administrative_area_level_3' ? 6 :
               type === 'locality' || type === 'postal_code' ? 13 : 
               type === 'street_address' || type === 'point_of_interest' ? 16 : 
               10; //default

    }
};

PloneMap.Map.prototype.supr = PloneMap.prototype;