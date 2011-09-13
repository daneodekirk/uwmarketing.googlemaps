.. -*-doctest-*-

=====
GoogleMaps v0.5
=====

GoogleMaps is a Plone product that defines a Maps view and a GeoLocation content-type.
There are static JavaScript and CSS files that handle the actual Google map itself.  
This will only test the content-type and views that come with this product.

Open a browser and log in as an editor.

    >>> from Products.Five.testbrowser import Browser
    >>> from Products.PloneTestCase import ptc
    >>> from Products.PloneTestCase.setup import portal_owner, default_password
    >>> editor_browser = Browser()
    >>> editor_browser.handleErrors = False
    >>> editor_browser.open(self.portal.absolute_url() + "/login_form")
    >>> editor_browser.getControl(name='__ac_name').value = portal_owner
    >>> editor_browser.getControl(name='__ac_password').value = default_password
    >>> editor_browser.getControl(name='submit').click()

Add a Google Map to contain Location and Region types 

    >>> editor_browser.open(self.portal.absolute_url())
    >>> editor_browser.getLink(
    ...     url='createObject?type_name=Google+Map').click()
    >>> print editor_browser.contents
    <...
    ...Google Map...

Throw in some basic information 

    >>> editor_browser.getControl(
    ...     name='title').value = 'Google Folder'
    >>> editor_browser.getControl(
    ...     'Description').value = 'Google Folder Description'

Save and click the new folder link

    >>> editor_browser.getControl('Save').click()
    >>> print editor_browser.contents
    <...
                <dd>Changes saved.</dd>...
                ...Google Folder...

The description has been added back into the main google map view

    >>> 'id="parent-fieldname-description"' in editor_browser.contents
    True

Change the view for this folder to the Maps view supplied by this product

    >>> editor_browser.getLink(
    ...     url='selectViewTemplate?templateId=googlemap_view').click()

Add a location.

    >>> editor_browser.getLink(
    ...     url='createObject?type_name=Location').click()
    >>> print editor_browser.contents
    <...
    ...Location...

The page schema includes the basic Plone metadata.

    >>> editor_browser.getControl(
    ...     name='title').value = 'Baz Location Title'
    >>> editor_browser.getControl(
    ...     'Description').value = 'Baz Location Description'

The GeoLocation content-type has a REQUIRED Location field.  For a user, 
the input can be either a latitude, longitude pair or the name of a location.  
The return value will always be a latitude, longitude pair supplied by 
Google's magic. 

Unfortuately, this is all done with JavaScript and requires internet access.  
Therefore, this unittest will do what the JavaScript does after Google returns 
the geolocated coordinates - adjust the two hidden input fields, one for latitude 
and the other for longitude.  
[NOTE] This part doesn't technically mimic what a user does, but what the JavaScript does.

    >>> editor_browser.getControl(
    ...     name='longitude').value = '47.6062095'
    >>> editor_browser.getControl(
    ...     name='latitude').value = '-122.3320708' 

The test below adds an image to the rich text.  This FUBARs the google map view.
[TODO] Edit google map view to make sure we can add an image

Save the page.  The title, description, lead image and are
rendered on the page.

    >>> editor_browser.getControl('Save').click()
    >>> print editor_browser.contents
    <...
                <dd>Changes saved.</dd>...
                ...Baz Location Title...
                ...id="gmap"...
                ...id="baz-location-title"...
                ...id="googleMapPane"...

The title is used in the left nav, with the proper location_icon.gif and alt tag.

    >>> print editor_browser.contents
    <...
            <a href="http://nohost/plone/google-folder/baz-location-title" class="state-private navTreeCurrentItem navTreeCurrentNode contenttype-location" title="Baz Location Description">
                <img width="16" height="16" src="http://nohost/plone/location_icon.gif" alt="Location" />
                <span>Baz Location Title</span>
            </a>
    ...

The subtitle is not rendered on the view, since we didn't supply one.

    >>> 'Baz Location Subtitle' in editor_browser.contents
    False

Go back to the Google Map folder contents page 

    >>> editor_browser.getLink(
    ...     'Google Folder').click()

Add another location. The following steps are the same as adding the 
first location above.  This is just condensed and has different values
for the input fields.

    >>> editor_browser.getLink(
    ...     url='createObject?type_name=Location').click()
    >>> print editor_browser.contents
    <...
    ...Location...

Fill in the fields (different name/location this time)

    >>> editor_browser.getControl(
    ...     name='title').value = 'Raz Location Title'
    >>> editor_browser.getControl(
    ...     'Description').value = 'Raz Location Description'

    >>> editor_browser.getControl(
    ...     name='latitude').value = '30.064742'
    >>> editor_browser.getControl(
    ...     name='longitude').value = '31.249509'

    >>> editor_browser.getControl('Save').click()
    >>> print editor_browser.contents
    <...
                <dd>Changes saved.</dd>...
                ...Raz Location Title...
                ...id="gmap"...
                ...id="raz-location-title"...
                ...id="googleMapPane"...

Go back to the main Map view again and see if both locations appear as they should

    >>> editor_browser.getLink(
    ...     'Google Folder').click()
    >>> print editor_browser.contents
    <...
    ...Google Map...
    ...id="gmap"...

    ...class="infoWindow" style="display:none" id="baz-location-title"...
    ...<a href="http://localhost:8080/uwmarketing/maps/baz-location-title">Baz Location Title</a>...

    ...class="infoWindow" style="display:none" id="raz-location-title"...
    ...<a href="http://localhost:8080/uwmarketing/maps/raz-location-title">Raz Location Title</a>...

    ...id="googleMapPane"...

Both items are still used in the left nav and both have the proper location_icon.gif and alt tag.

    >>> print editor_browser.contents
    <...
            <a href="http://nohost/plone/google-folder/baz-location-title" class="state-private contenttype-location" title="Baz Location Description">
                <img width="16" height="16" src="http://nohost/plone/location_icon.gif" alt="Location" />
                <span>Baz Location Title</span>
            </a>
    ...

    ...<li class="navTreeItem visualNoMarker">...
            ...<a href="http://nohost/plone/google-folder/raz-location-title" class="state-private contenttype-location" title="Raz Location Description">
                <img width="16" height="16" src="http://nohost/plone/location_icon.gif" alt="Location" />
                <span>Raz Location Title</span>
            </a>...
    </li>...


Now go back to the homepage and edit the Google Map

    >>> editor_browser.open('http://nohost/plone/google-folder/edit')
    >>> print editor_browser.contents
    <...
    ...Google Map...


Now we give the Google Map a KML file that will create regions

    >>> import os
    >>> import uwmarketing.googlemaps
    >>> kml = open(os.path.join(
    ...     os.path.dirname(uwmarketing.googlemaps.__file__),
    ...     'tests', 'sample.kml'))
    >>> editor_browser.getControl(name='kmlFile_file').add_file(
    ...     kml, 'application/vnd.google-earth.kml+xml', 'sample.kml')

Click save and see if the changes were saved

    >>> editor_browser.getControl('Save').click()
    >>> print editor_browser.contents
    <...
        ...<dd>Changes saved.</dd>...

There is an algorithm that will take all the Coordinate tags in the kml file and 
create a Region content type from it.  So we change the view to map view and check to see if the 10
Districts were created. 


    >>> print editor_browser.contents
    <...
                ...Baz Location Title...
                ...State Senate District 1...
                ...State Senate District 2...
                ...State Senate District 3...
                ...State Senate District 4...
                ...State Senate District 5...
                ...State Senate District 6...
                ...State Senate District 7...
                ...State Senate District 8...
                ...State Senate District 9...
                ...State Senate District 10...


And we're done...or are we? Dum dum dum...
