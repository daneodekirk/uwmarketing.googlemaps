from xml.dom.minidom import Document, parse 
from StringIO import StringIO

from zope.interface import implements, Interface, Attribute

from Products.Five import BrowserView
from Products.CMFCore.utils import getToolByName
from Products.CMFDefault.browser.utils import memoize


from uwmarketing.googlemaps import googlemapsMessageFactory as _


class IGoogleMapView(Interface):
    """
    Google Map view interface
    """

    def test():
        """ test method"""

    def generatePolygons(): 
        """ generate the polygons global javascript variable """ 

    def generateInlineCSS(): 
        """ generate the CSS that are dependent on the URL """ 

    enabled = Attribute("True if googlemap_view is enabled")


class GoogleMapView(BrowserView):
    """
    Google Map browser view
    """
    implements(IGoogleMapView)

    def __init__(self, context, request):
        self.context = context
        self.request = request
        self.view = context.unrestrictedTraverse('@@plone_context_state').view_template_id()

    @property
    def portal_catalog(self):
        return getToolByName(self.context, 'portal_catalog')

    @property
    def portal(self):
        return getToolByName(self.context, 'portal_url').getPortalObject()
    
    @property
    def enabled(self):
        if self.view == 'googlemap_view':
            return True
        return False

    def test(self):
        """
        test method
        """
        dummy = _(u'a dummy string')

        return {'dummy': dummy}


    def generatePolygons(self, *args, **kwargs):
        """ generate the polygons global javascript variable """ 
        return 'var PloneMapPolygons = {' + \
                    ''.join(["'%s':%s," % (object.Title(), object.polygon) 
                                for object in self.context.objectValues() 
                                    if hasattr(object, 'polygon') and len(object.polygon) > 0 ])[:-1] \
                + '};'

    def generateMarkers(self, *args, **kwargs):
        """ generate the markers global javascript variable """ 
        return 'var PloneMapMarkers = [{' + \
                ''.join(["'type': '%s','options': { 'position': new google.maps.LatLng( %s, %s ), 'title' : '%s', 'title_' : '%s' }," 
                                % (object.markerIcon, object.latitude, object.longitude, object.Title(), object.getId()) 
                                for object in self.context.objectValues() 
                                    if hasattr(object, 'latitude') and len(object.latitude) > 0 ])[:-1] \
                + '}];'

    def generateInlineCSS(self, *args, **kwargs):
        """ generate the inline CSS for a googlemap view """ 
        return """
         .googleLoading.googleMapView #CustomGoogleMap { 
            height:520px;
            background: url("../image/map/stripeHorz.gif") repeat-x scroll 0 0 transparent;
            padding: 20px;
            position: relative;
         } 
         .googleLoading.googleMapView {
              background: url("/edit/maploader.gif") no-repeat scroll 215px 115px transparent;
         }
        """.replace('\n', '').replace('  ','')
