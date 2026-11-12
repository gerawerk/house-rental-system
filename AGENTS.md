# Project Rules & Architectural Guidelines

## Kubernetes & Infrastructure Standards
- **Pod Scheduling**: Never use hardcoded `nodeSelector` hostnames (such as `kind-worker-1` or `kind-worker-2`) in Kubernetes manifests.
- **High Availability**: Always use `podAntiAffinity` with `topologyKey: kubernetes.io/hostname` (preferred or required) to distribute pod replicas evenly across worker nodes.

## Git & Repository Operations
- **Remote Push Permission**: The agent is authorized to stage, commit, and push changes to the remote repository when requested by the user.
- **Secret Protection**: Never stage or commit `.env` files, credentials, or private API keys to any git branch.


