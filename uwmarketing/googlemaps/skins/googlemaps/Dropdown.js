PloneMap.DropDown = function() {

    this.dropdown = document.getElementById('region-options');

    this.bindEvents();

};



PloneMap.DropDown.prototype.bindEvents = function() {

    var this_ = this;

    google.maps.event.addDomListener( this.dropdown, 'change' , function() { 

        var selected = this.options[this.selectedIndex];
        if( !selected.id ) {

            document.location.href = selected.value;
            return false;

        }

    });
        
}
