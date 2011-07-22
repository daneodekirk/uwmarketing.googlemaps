from zope.interface import implements, Interface, Attribute

from Products.Five import BrowserView
from Products.CMFCore.utils import getToolByName

from uwmarketing.googlemaps import googlemapsMessageFactory as _


class IRegionView(Interface):
    """
    Region view interface
    """

    def test():
        """ test method"""

    enabled = Attribute("True if googlemap_view is enabled")

class RegionView(BrowserView):
    """
    Region browser view
    """
    implements(IRegionView)

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
        if self.view == 'region_view':
            return True
        return False

    def test(self):
        """
        test method
        """
        dummy = _(u'a dummy string')

        return {'dummy': dummy}
