# Third Party
import pytest
from unittest.mock import MagicMock

# Local
from openapi_server.models.service_provider import ServiceProvider
from openapi_server.models.service_provider_with_id import ServiceProviderWithId
from openapi_server.models import database as db
from openapi_server.repositories.service_provider_repository import HousingProviderRepository


class TestHousingProviderRepository:

    def test_create_provider(self):
        expected_provider = ServiceProvider("test_name")
        expected_row = db.HousingProgramServiceProvider(
            provider_name=expected_provider.to_dict()["provider_name"]
        )
        expected_row.id = 1
        mock_session = MagicMock()
        repo = HousingProviderRepository(None)

        repo._get_session = lambda: mock_session
        repo._generate_row = lambda _ : expected_row

        actual = repo.create_service_provider(expected_provider.to_dict())

        assert expected_provider.provider_name == actual.provider_name
        assert expected_row.id == actual.id
        mock_session.add.assert_called_with(expected_row)
        mock_session.commit.assert_called_once()
        mock_session.close.assert_called_once()

    def test_delete_service_provider_no_result(self):
        expected_id = 1
        repo = HousingProviderRepository(None)

        mock_session = MagicMock()
        mock_query = MagicMock()

        mock_query.first.return_value = None
        repo._get_session = lambda: mock_session
        repo._get_query_by_id = lambda x, y: mock_query

        repo.delete_service_provider(expected_id)

        mock_query.first.assert_called_once()
        mock_query.delete.assert_not_called()
        mock_session.commit.assert_not_called()
        mock_session.close.assert_called_once()

    def test_delete_service_provider_some_result(self):
        expected_id = 1
        repo = HousingProviderRepository(None)
        mock_session = MagicMock()
        mock_query = MagicMock()

        mock_query.first.return_value = True
        repo._get_session = lambda: mock_session
        repo._get_query_by_id = lambda x, y: mock_query

        repo.delete_service_provider(expected_id)

        mock_query.first.assert_called_once()
        mock_query.delete.assert_called_once()
        mock_session.commit.assert_called_once()
        mock_session.close.assert_called_once()
        
    def test_get_service_provider_by_id_some_result(self):
        expected_provider = ServiceProvider("test_name")
        expected_id = 1
        repo = HousingProviderRepository(None)
        expected_row = db.HousingProgramServiceProvider(
            provider_name=expected_provider.to_dict()["provider_name"]
        )
        expected_row.id = expected_id
        mock_session = MagicMock()

        mock_session.get.return_value = expected_row
        repo._get_session = lambda: mock_session

        actual = repo.get_service_provider_by_id(expected_id)

        assert expected_id == actual.id
        assert expected_provider.provider_name == actual.provider_name
        mock_session.close.assert_called_once()


    def test_get_service_provider_by_id_no_result(self):
        repo = HousingProviderRepository(None)
        expected_row = None
        mock_session = MagicMock()

        mock_session.get.return_value = expected_row
        repo._get_session = lambda: mock_session

        actual = repo.get_service_provider_by_id(1)

        assert None == actual
        mock_session.close.assert_called_once()

    def test_get_service_providers_some_result(self):
        repo = HousingProviderRepository(None)
        mock_session = MagicMock()
        mock_query = MagicMock()
        provider1 = ServiceProviderWithId(1, "taylor")
        provider2 = ServiceProviderWithId(2, "swift")
        expected_providers = [provider1, provider2]

        mock_session.query.return_value = mock_query
        mock_query.all.return_value = expected_providers
        repo._get_session = lambda: mock_session

        actual = repo.get_service_providers()

        assert expected_providers == actual
        mock_session.close.assert_called_once()

    def test_get_service_providers_no_result(self):
        repo = HousingProviderRepository(None)
        mock_session = MagicMock()

        repo._get_session = lambda: mock_session
        mock_session.query.all.return_value = None

        actual = repo.get_service_providers()

        assert [] == actual 
        mock_session.close.assert_called_once()

    def test_update_service_provider_some_result(self):
        repo = HousingProviderRepository(None)
        expected_provider = ServiceProviderWithId(1, "drake")
        mock_session = MagicMock()
        mock_result = MagicMock()
        mock_query = MagicMock()

        repo._get_session = lambda: mock_session
        mock_session.query.return_value = mock_result
        mock_result.filter.return_value = mock_query
        mock_query.first.return_value = True

        actual = repo.update_service_provider(expected_provider.to_dict(), expected_provider.id)

        assert expected_provider == actual
        mock_query.first.assert_called_once()
        mock_query.update.assert_called_once_with(expected_provider.to_dict())
        mock_session.commit.assert_called_once()
        mock_session.close.assert_called_once()

    def test_update_service_provider_no_result(self):
        repo = HousingProviderRepository(None)
        mock_session = MagicMock()
        mock_result = MagicMock()
        mock_query = MagicMock()

        repo._get_session = lambda: mock_session
        mock_session.query.return_value = mock_result
        mock_result.filter.return_value = mock_query
        mock_query.first.return_value = None

        actual = repo.update_service_provider({}, 0)

        assert None == actual
        mock_query.first.assert_called_once()
        mock_query.update.assert_not_called()
        mock_session.commit.assert_not_called()
        mock_session.close.assert_called_once()
