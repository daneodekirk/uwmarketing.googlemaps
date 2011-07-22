"""Definition of the Location content type
"""

from zope.interface import implements

from Products.Archetypes import atapi
from Products.ATContentTypes.content import base
from Products.ATContentTypes.content import schemata

# -*- Message Factory Imported Here -*-
from uwmarketing.googlemaps import googlemapsMessageFactory as _

from uwmarketing.googlemaps.interfaces import ILocation
from uwmarketing.googlemaps.config import PROJECTNAME

LocationSchema = schemata.ATContentTypeSchema.copy() + atapi.Schema((

    # -*- Your Archetypes field definitions here ... -*-

    atapi.TextField(
        'popup',
        storage=atapi.AnnotationStorage(),
        default_output_type = 'text/x-html-safe',
        widget=atapi.RichWidget(
            label=_(u"Popup Window"),
            description=_(u"Information that displays in the popup window"),
        ),
        validators = ('isTidyHtmlWithCleanup',),
    ),


    atapi.StringField(
        'markerIcon',
        storage=atapi.AnnotationStorage(),
        widget=atapi.SelectionWidget(
            format="select",
            label=_(u"Marker Icon"),
            description=_(u"Select the marker icon"),
        ),
        vocabulary=["Gold Marker", "Purple Marker", "Red Marker", "Blue Marker", "Green Marker"],
        enforceVocabulary=True,
        
    ),


    atapi.StringField(
        'longitude',
        default="0.0",
        storage=atapi.AnnotationStorage(),
        widget=atapi.StringWidget(
            label=_(u"Longitude Coordinate"),
            description=_(u"The longitude coordinate of the Google Map marker"),
        ),
        required=True,
    ),


    atapi.StringField(
        'latitude',
        default="0.0",
        storage=atapi.AnnotationStorage(),
        widget=atapi.StringWidget(
            label=_(u"Latitude Coordinate"),
            description=_(u"The latitude coordinate of the Google Maps Marker"),
        ),
        required=True,
    ),


))

# Set storage on fields copied from ATContentTypeSchema, making sure
# they work well with the python bridge properties.

LocationSchema['title'].storage = atapi.AnnotationStorage()
LocationSchema['description'].storage = atapi.AnnotationStorage()

schemata.finalizeATCTSchema(LocationSchema, moveDiscussion=False)


class Location(base.ATCTContent):
    """A Google Maps Marker"""
    implements(ILocation)

    meta_type = "Location"
    schema = LocationSchema

    title = atapi.ATFieldProperty('title')
    description = atapi.ATFieldProperty('description')

    # -*- Your ATSchema to Python Property Bridges Here ... -*-
    popup = atapi.ATFieldProperty('popup')

    markerIcon = atapi.ATFieldProperty('markerIcon')

    longitude = atapi.ATFieldProperty('longitude')

    latitude = atapi.ATFieldProperty('latitude')



atapi.registerType(Location, PROJECTNAME)
