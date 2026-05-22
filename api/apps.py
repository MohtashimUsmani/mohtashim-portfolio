from django.apps import AppConfig
from django.template import context as template_context


def _safe_context_copy(self):
    duplicate = self.__class__.__new__(self.__class__)
    duplicate.__dict__ = self.__dict__.copy()
    duplicate.dicts = self.dicts[:]
    return duplicate


def _safe_request_context_new(self, values=None):
    return template_context.Context(
        values,
        autoescape=self.autoescape,
        use_l10n=self.use_l10n,
        use_tz=self.use_tz,
    )


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'
    verbose_name = 'Portfolio API'

    def ready(self):
        template_context.BaseContext.__copy__ = _safe_context_copy
        template_context.RequestContext.new = _safe_request_context_new
