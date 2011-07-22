"""Definition of the Region content type
"""
from StringIO import StringIO
from xml.dom.minidom import Document, parseString

from zope.interface import implements
from AccessControl.SecurityInfo import ClassSecurityInfo

from Products.Archetypes import atapi
from Products.ATContentTypes.content import base
from Products.ATContentTypes.content import schemata

# -*- Message Factory Imported Here -*-
from uwmarketing.googlemaps import googlemapsMessageFactory as _

from uwmarketing.googlemaps.interfaces import IRegion
from uwmarketing.googlemaps.config import PROJECTNAME

RegionSchema = schemata.ATContentTypeSchema.copy() + atapi.Schema((

    # -*- Your Archetypes field definitions here ... -*-

    atapi.TextField(
        'popup',
        searchable=True,
        storage=atapi.AnnotationStorage(),
        default_output_type = 'text/x-html-safe',
        widget=atapi.RichWidget(
            label=_(u"Popup Window"),
            description=_(u"Information in the map popup window"),
        ),
        validators = ('isTidyHtmlWithCleanup',),
    ),


    atapi.TextField(
        'text',
        searchable=True,
        storage=atapi.AnnotationStorage(),
        default_output_type = 'text/x-html-safe',
        widget=atapi.RichWidget(
            label=_(u"Body Text"),
            description=_(u"Give a richer, more in-depth description here"),
        ),
        validators = ('isTidyHtmlWithCleanup',),
    ),


    atapi.FileField(
        'regionKml',
        storage=atapi.AnnotationStorage(),
        widget=atapi.FileWidget(
            label=_(u"KML File"),
            description=_(u"A KML File that describes a Google Map Polygon"),
        ),
        validators=('isNonEmptyFile'),
    ),

    atapi.StringField(
        'polygon',
        storage=atapi.AnnotationStorage(),
        #default_method = '
        widget=atapi.StringWidget(
            label=_(u"Polygon String"),
            description=_(u"Part of a Javascript object that describes a set of Google Map Polygons"),
            visible={'view':'hidden', 'edit':'hidden'}
        ),
    ),


))

# Set storage on fields copied from ATContentTypeSchema, making sure
# they work well with the python bridge properties.

RegionSchema['title'].storage = atapi.AnnotationStorage()
RegionSchema['description'].storage = atapi.AnnotationStorage()

schemata.finalizeATCTSchema(RegionSchema, moveDiscussion=False)


class Region(base.ATCTContent):
    """A Google Maps Polygon"""
    implements(IRegion)

    security = ClassSecurityInfo()

    meta_type = "Region"
#    sort_on = "id"
    schema = RegionSchema

    title = atapi.ATFieldProperty('title')
    description = atapi.ATFieldProperty('description')

    # -*- Your ATSchema to Python Property Bridges Here ... -*-
    popup = atapi.ATFieldProperty('popup')

    text = atapi.ATFieldProperty('text')

    regionKml = atapi.ATFieldProperty('regionKml')

    polygon = atapi.ATFieldProperty('polygon' )

    def longToLat(self, value):
        """ Switches a kml's (lng,lat) to the typical (lat,lng) """ 
        neworder = [1,0]
        value = value.split(',')
        value = [value[i] for i in neworder]
        return value[0]+','+value[1]

    security.declarePrivate("setRegionKml")
    def setRegionKml(self, *args, **kwargs):
        """ Creates a Javascript object from the region KML file before saving the region KML file """
        try:
            dom = parseString(args[0].read())
        except AttributeError:
            self.getField('regionKml').set(self, *args, **kwargs)
            return 
        placemark = dom.getElementsByTagName("Placemark")[0]
        name = placemark.getElementsByTagName("name")[0].childNodes[0].nodeValue.encode() \
                .strip().lower().replace(' ','-')
        latlnglist = placemark.getElementsByTagName("coordinates")[0].childNodes[0].nodeValue.encode()
        #for each set of lat,lng in latlnglist, preform a longToLat conversion and put it into a new google.maps.LatLng string
        #then join all these together into a final string and remove the last character (which is a comma) for IE
        #and wrap the whole thing in brackets because its an array 
        latlngs = '[' + ''.join(['new google.maps.LatLng(%s),' % self.longToLat(latlng) for latlng in latlnglist.split()])[:-1] + ']'
        #best way to set this field?
        self.getField('polygon').set(self, latlngs)
        self.getField('regionKml').set(self, *args, **kwargs)
    
    security.declarePrivate("setPolygon")
    def setPolygon(self, *args, **kwargs):
        """ Don't do anything since this is handled by setRegionKml """ 
        #[TODO] could make this a default_method except it would have to 'getRegionKml' each time?
        pass
    

atapi.registerType(Region, PROJECTNAME)
