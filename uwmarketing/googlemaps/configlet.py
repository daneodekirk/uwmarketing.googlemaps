from zope.component import adapts, getUtility
from zope.formlib.form import FormFields
from zope.interface import Interface, implements
from zope.i18nmessageid import MessageFactory

from Products.CMFCore.interfaces import IPropertiesTool
from Products.CMFDefault.formlib.schema import ProxyFieldProperty
from Products.CMFDefault.formlib.schema import SchemaAdapterBase
from Products.CMFPlone.interfaces import IPloneSiteRoot
from plone.app.controlpanel.form import ControlPanelForm

#from plone.app.imaging.interfaces import IImagingSchema, _
#from uwmarketing.googlemaps.interfaces import IGoogleMapsSchema, _

_ = MessageFactory('uwmarketing.googlemaps')

class IGoogleMapsSchema(Interface):
    """ schema for configlet form """
    
class GoogleMapsControlPanelAdapter(SchemaAdapterBase):
    adapts(IPloneSiteRoot)
    implements(IGoogleMapsSchema)

    def __init__(self, context):
        super(GoogleMapsControlPanelAdapter, self).__init__(context)
        self.context = getUtility(IPropertiesTool).googlemaps_properties

    #allowed_sizes = ProxyFieldProperty(IImagingSchema['allowed_sizes'])


class GoogleMapsControlPanel(ControlPanelForm):

    form_fields = FormFields(IGoogleMapsSchema)

    label = _('Google Map handling settings')
    description = _('Settings to configure Google Maps in Plone.')
    form_name = _('Google Maps')

