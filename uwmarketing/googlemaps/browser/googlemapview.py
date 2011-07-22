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
        return 'var polygons = {' + \
                    ''.join(["'%s':%s," % (object.id, object.polygon) for object in self.context.objectValues() if hasattr(object, 'polygon') and len(object.polygon) > 0 ])[:-1] \
                + '};'
         
#    def longToLat(self, value):
#        #import pdb; pdb.set_trace()
#        neworder = [1,0]
#        value = value.split(',')
#        value = [value[i] for i in neworder]
#        return value[0]+','+value[1]
#
#    def renderJavascriptObject(self, kmlfile):
#        geostring = 'var polygons = {'
#        kml_io = StringIO(kmlfile)
#        try:
#            dom = parse(kml_io)
#        except AttributeError:
#            return 
#        placemarks = dom.getElementsByTagName("Placemark") 
#        for index, placemark in enumerate(placemarks): 
#            #if(index < 3):
#            name = placemark.getElementsByTagName("name")[0].childNodes[0].nodeValue.encode()
#            name = name.strip().lower().replace(' ','-')
#            coordinate = placemark.getElementsByTagName("coordinates")
#            #coordinates = dom.getElementsByTagName("coordinates")                        
#        #for coordinate in coordinates:
#            latlnglist = coordinate[0].childNodes[0].nodeValue.encode()
#            latlngs = latlnglist.split()
#            latlngs = map(lambda x: self.longToLat(x), latlngs)
#            latlngs = map(lambda x: 'new google.maps.LatLng(%s),' % x, latlngs) 
#            latlngs = ''.join(latlngs)
#            latlngs = latlngs[:-1] #removes final comma
#            #import pdb; pdb.set_trace()
#            #latlngs = map(lambda value: value.encode(), latlngs) 
#            #for latlng in latlngs:
#            #import pdb; pdb.set_trace()
#            #return '[%s],' % latlngs
#            geostring += '\'' + name + '\'' + ': [%s],' % latlngs
#        return geostring[:-1] + '};'
#    
#    def getPolygons(self):
#        """ returns a list of polygons ready for javascript file """
#        if(hasattr(self.context, 'getKmlFile')):
#            kmlfile = self.context.getKmlFile();
#            geostring = self.renderJavascriptObject(kmlfile)
#            return geostring

