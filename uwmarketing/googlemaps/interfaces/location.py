from zope.interface import Interface
# -*- Additional Imports Here -*-
from zope import schema

from uwmarketing.googlemaps import googlemapsMessageFactory as _


class ILocation(Interface):
    """A Google Maps Marker"""

    # -*- schema definition goes here -*-
    popup = schema.Text(
        title=_(u"Popup Window"),
        required=False,
        description=_(u"Information that displays in the popup window"),
    )
#
    markerIcon = schema.TextLine(
        title=_(u"Marker icon"),
        required=False,
        description=_(u"Select the marker icon"),
    )
#
    longitude = schema.TextLine(
        title=_(u"Longitude Coordinate"),
        required=True,
        description=_(u"The longitude coordinate of the Google Map marker"),
    )
#
    latitude = schema.TextLine(
        title=_(u"Latitude Coordinate"),
        required=True,
        description=_(u"The latitude coordinate of the Google Maps Marker"),
    )
#
