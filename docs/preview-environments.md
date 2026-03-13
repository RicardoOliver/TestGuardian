# Preview Environments

Each pull request can create an ephemeral namespace following the pattern:

- `preview-pr-101`
- `preview-pr-102`

## Flow

1. CI pipeline detects PR event.
2. Namespace is created in Kubernetes.
3. Application services are deployed.
4. Automated tests are executed.
5. Environment is destroyed when PR closes.
