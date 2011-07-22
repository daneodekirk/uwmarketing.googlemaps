from zope.interface import Interface
# -*- Additional Imports Here -*-
from zope import schema

from uwmarketing.googlemaps import googlemapsMessageFactory as _


class IGoogleMap(Interface):
    """Google Map"""

    # -*- schema definition goes here -*-
    kmlFile = schema.Bytes(
        title=_(u"KMLFile"),
        required=False,
        description=_(u"A KML File for Google Maps"),
    )

    def setKmlFile():
        """ Parses KML file and creates Region type for each node 'Placemark' """ 

    def renderKmlFile():
        """ Creates a KML file from input Style and Placemark nodes """
#
