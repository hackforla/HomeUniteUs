# Automated tests: integration

### Registration flows

- **e2e_host_registration.sh** usees cURL to POST a new account (identified by email address), then make PUT requests against all endpoints to complete a registration flow from the HTTP client

1. Run the script:

```bash
# invoke the script from project root, adding a unique email address as an argument
./scripts/tests/e2e_host_registration.sh <EMAIL_ADDRESS>
```
