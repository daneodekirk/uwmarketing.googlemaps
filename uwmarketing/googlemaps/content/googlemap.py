"""Definition of the Google Map content type
"""
from StringIO import StringIO
from xml.dom.minidom import Document, parseString

from zope.interface import implements
from AccessControl import ClassSecurityInfo, Permissions 

from Products.Archetypes import atapi
from Products.ATContentTypes.content import folder
from Products.ATContentTypes.content import schemata

# -*- Message Factory Imported Here -*-
from uwmarketing.googlemaps import googlemapsMessageFactory as _

from uwmarketing.googlemaps.interfaces import IGoogleMap
from uwmarketing.googlemaps.config import PROJECTNAME

GoogleMapSchema = folder.ATFolderSchema.copy() + atapi.Schema((

    # -*- Your Archetypes field definitions here ... -*-

    atapi.StringField(
        name='dropdownMessage',
        default='Select a district',
        widget=atapi.StringWidget(
            label=_(u"Dropdown Message"),
            description=_(u"Custom message for the dropdown navigation in the map's search toolbar."),
            maxlength=30,
            size=30,
        ),
        required=False,
        searchable=False
    ),

    atapi.FileField(
        'kmlFile',
        storage=atapi.AnnotationStorage(),
        widget=atapi.FileWidget(
            label=_(u"KML File"),
            description=_(u"Upload a KML file for Google Maps"),
        ),
        validators=('isNonEmptyFile'),
    ),


))

# Set storage on fields copied from ATFolderSchema, making sure
# they work well with the python bridge properties.

GoogleMapSchema['title'].storage = atapi.AnnotationStorage()
GoogleMapSchema['description'].storage = atapi.AnnotationStorage()

schemata.finalizeATCTSchema(
    GoogleMapSchema,
    folderish=True,
    moveDiscussion=False
)


class GoogleMap(folder.ATFolder):
    """Google Map"""
    implements(IGoogleMap)

    security = ClassSecurityInfo()

    meta_type = "GoogleMap"
    schema = GoogleMapSchema

    title = atapi.ATFieldProperty('title')
    description = atapi.ATFieldProperty('description')

    # -*- Your ATSchema to Python Property Bridges Here ... -*-
    kmlFile = atapi.ATFieldProperty('kmlFile')

    security.declarePrivate("setKmlFile")
    def setKmlFile(self, value): 
        """ Parses KML file and creates Region type for each 'Placemark' node """ 
        #geolocations = []
        try:
            dom = parseString(value.read())
        except AttributeError:
            self.getField('kmlFile').set(self, value)
            return 
        style = dom.getElementsByTagName("Style")[0]
        placemarks = dom.getElementsByTagName("Placemark")
        for placemark in placemarks:
            #coordinates = placemarks.getElementsByTagName("coordinates")
            name = placemark.getElementsByTagName("name")[0].childNodes[0].nodeValue
            id = name.strip().lower().replace('/','').replace(' ', '-')
            if not hasattr(self, id):
                self.invokeFactory(type_name="Region", id=id, title=name)
                obj = self[id]
                #obj.setTitle(name)
                kml = self.renderKmlFile(style, placemark)
                content_type = 'text/plain'
                obj.setRegionKml(StringIO(kml), mimetype=content_type)
        self.getField('kmlFile').set(self, value)

    security.declarePrivate("renderKmlFile") 
    def renderKmlFile(self, style, placemark):
        """ Creates a KML file from input Style and Placemark nodes """ 
        doc = Document()
        kml = doc.createElement('kml')
        kml.setAttribute('xmlns','http://www.opengis.net/kml/2.2')
        kml.appendChild(placemark) 
        kml.appendChild(style)
        doc.appendChild(kml)
        return doc.toxml('utf-8')


atapi.registerType(GoogleMap, PROJECTNAME)
