from openapi_server import util
from openapi_server.models.base_model_ import Model


class Host(Model):
  def __init__(self, id=None, name=None):
    self.openapi_types = {
      'id': int,
      'name': str
    }

    self.attribute_map = {
      'id': 'id',
      'name': 'name'
    }

    self._id = id
    self._name = name

  @classmethod
  def from_dict(cls, dikt) -> 'Host':
    return util.deserialize_model(dikt, cls)

  @property
  def id(self):
    return self._id
  
  @id.setter
  def id(self, id):
    if id is None:
      raise ValueError("Invalid value for `id`, must not be `None`")
    self._id = id

  @property
  def name(self):
    return self._name
  
  @name.setter
  def name(self, name):
    if name is None:
      raise ValueError("Invalid value for `name`, must not be `None`")

    self._name = name