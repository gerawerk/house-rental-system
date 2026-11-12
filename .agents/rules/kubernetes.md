# Kubernetes Scheduling & Infrastructure Rules

- **No Hardcoded Hostnames**: Never use hardcoded `nodeSelector` hostnames (e.g., `kubernetes.io/hostname: kind-worker-1`).
- **Resilient Pod Anti-Affinity**: Always use `podAntiAffinity` configured with `topologyKey: kubernetes.io/hostname` to distribute replicas across available nodes and maintain high availability.

