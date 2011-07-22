from zope.interface import Interface
# -*- Additional Imports Here -*-
from zope import schema

from uwmarketing.googlemaps import googlemapsMessageFactory as _


class IRegion(Interface):
    """A Google Maps Polygon"""

    # -*- schema definition goes here -*-
    text = schema.SourceText(
        title=_(u"Body Text"),
        required=False,
        description=_(u"Give a richer, more in-depth description here"),
    )
#
    popup = schema.Text(
        title=_(u"Popup Window"),
        required=False,
        description=_(u"Information in the map popup window"),
    )
#
    regionKml = schema.Bytes(
        title=_(u"KML File"),
        required=False,
        description=_(u"A KML File that describes a Google Map Polygon"),
    )
#
    polygon = schema.Bytes(
        title=_(u"Polygon String"),
        required=False,
        description=_(u"Part of a Javascript object that describes a set of Google Map Polygons"),
    )
#
