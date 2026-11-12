# 10-Day Production Kubernetes Mastery Plan
## Project: House Rental Application (MERN Stack)

This guide takes the **House Rental Application** from local Node.js development to a production-grade Kubernetes deployment.

---

## 🐳 Registry: Docker Hub

| Setting | Value |
|---------|-------|
| **Registry** | Docker Hub (`docker.io`) |
| **Docker Hub Username** | `gerawerk` ✅ |
| **Backend image** | `gerawerk/house-backend:<tag>` ✅ (repo exists, public) |
| **Frontend image** | `gerawerk/house-frontend:<tag>` ✅ (repo exists, public) |
| **imagePullPolicy** | `Always` (dev) → `IfNotPresent` (prod) |

> Public repos = Kubernetes nodes pull images with **no credentials needed**.
> Login command (only needed to push): `docker login`

---

## Progress Tracker

- [x] **Day 1: Containerization & Cloud-Native Adaptation**
  - [x] Liveness Probe (`GET /healthz`) in `backend/index.js`
  - [x] Readiness Probe (`GET /readyz`) in `backend/index.js` (MongoDB status)
  - [x] Graceful Shutdown (`SIGTERM` & `SIGINT`) in `backend/index.js`
  - [x] Production `backend/.dockerignore` and `backend/Dockerfile` (non-root `USER node`, layer caching)
  - [x] Production `frontend/nginx.conf` (SPA routing with `try_files`, Gzip compression)
  - [x] Production `frontend/.dockerignore` and `frontend/Dockerfile` (Node builder -> Nginx runner)
  - [x] Root `docker-compose.yaml` (services, volumes, health checks, networks)
- [ ] **Day 2: Tooling & Multi-Node Cluster Provisioning (Linux Native)**
- [ ] **Day 3: Core Workloads & 12-Factor Configuration (Deployments, ConfigMaps, Secrets)**
- [ ] **Day 4: Cluster Networking, Services & Ingress (Nginx Ingress Controller)**
- [ ] **Day 5: Stateful Storage & The Media Uploads Problem (ReadWriteMany PVC / MinIO)**
- [ ] **Day 6: Zero-Trust Security & RBAC (NetworkPolicies, Pod Security Standards)**
- [ ] **Day 7: Packaging & Templating with Helm (charts/house-rental)**
- [ ] **Day 8: GitOps Continuous Delivery with ArgoCD**
- [ ] **Day 9: Full-Stack Observability (Prometheus, Grafana, prom-client)**
- [ ] **Day 10: Horizontal Autoscaling (HPA) & Day-2 Incident Chaos Drills**

---

## How to Set Up Your Linux Environment for Day 2

When you boot into your Linux partition (e.g., Ubuntu/Debian), run these commands to install the exact tools:

### 1. Install Native Docker Engine (No Docker Desktop needed!)
```bash
sudo apt update
sudo apt install -y docker.io docker-compose
# Add your user to the docker group so you don't need 'sudo' for docker commands:
sudo usermod -aG docker $USER
newgrp docker
# Verify:
docker run hello-world
```

### 2. Install `kubectl` (Kubernetes Command-Line Interface)
```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
kubectl version --client
```

### 3. Install `kind` (Kubernetes IN Docker - to create multi-node clusters)
```bash
[ $(uname -m) = x86_64 ] && curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.22.0/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind
kind version
```

### 4. Install `helm` (Kubernetes Package Manager)
```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
helm version
```

### 5. Install `k9s` (Terminal GUI to monitor clusters in real-time)
```bash
curl -sS https://webi.sh/k9s | sh
```

---

## Detailed Curriculum from Day 2 to Day 10

### Day 2: Tooling & Multi-Node Cluster Provisioning
* Define a 3-node cluster configuration (`k8s/kind-cluster.yaml`): 1 Control Plane + 2 Worker Nodes (`worker-1`, `worker-2`).
* Map host ports 80 and 443 for the Ingress Controller.
* Create the cluster: `kind create cluster --config k8s/kind-cluster.yaml --name house-rental`.
* Explore cluster components: API Server, etcd, Scheduler, Kubelet, CoreDNS.

### Day 3: Workloads, Lifecycle & Configuration
* Create dedicated namespace: `k8s/namespace.yaml` (`house-rental`).
* Author `backend-deployment.yaml`: 2 replicas, rolling updates (`maxSurge: 1`, `maxUnavailable: 0`), resource requests & limits.
* Connect Liveness and Readiness probes to `/healthz` and `/readyz`.
* Externalize configuration: `ConfigMap` for non-sensitive values, `Secret` for `MONGO_URI`, `JWT_KEY`, `CHAPA_SECRET_KEY`.

### Day 4: Networking, Services & Ingress
* Create internal `ClusterIP` services: `backend-service` (5001) and `frontend-service` (80).
* Install Nginx Ingress Controller into the cluster.
* Author `ingress.yaml`:
  * Route `/` -> `frontend-service`
  * Route `/api/*` -> `backend-service`
  * Route `/uploads/*` -> `backend-service`
* Configure `/etc/hosts` for local domain: `127.0.0.1 houserental.local`.

### Day 5: Storage & Media Uploads (The Multi-Replica Problem)
* Learn `StorageClass`, `PersistentVolume` (PV), and `PersistentVolumeClaim` (PVC).
* Solve the shared `/uploads` challenge across multiple backend pods using `ReadWriteMany` (RWX).
* Optional: In-cluster **MinIO** (S3-compatible object storage) implementation.

### Day 6: Zero-Trust Security & RBAC
* Enforce Pod Security Standards: `runAsNonRoot: true`, `readOnlyRootFilesystem: true`, drop Linux capabilities.
* Dedicated `ServiceAccount` with least privilege.
* Deploy `NetworkPolicy`: Deny all incoming traffic by default; whitelist only Ingress -> App and App -> MongoDB Atlas (port 27017).

### Day 7: Helm Chart Packaging
* Scaffold `charts/house-rental`.
* Create `values-dev.yaml` and `values-prod.yaml`.
* Test full installs, upgrades, and rollbacks (`helm rollback`).

### Day 8: GitOps with ArgoCD
* Install ArgoCD inside the cluster.
* Define `argocd-application.yaml` pointing to your GitHub repo.
* Test automatic drift detection and self-healing.

### Day 9: Production Observability (Prometheus & Grafana)
* Deploy `kube-prometheus-stack` via Helm.
* Instrument Express with `prom-client` exposing `GET /metrics`.
* Create custom Grafana dashboard for API response time, request rates, and error codes.

### Day 10: Horizontal Pod Autoscaler (HPA) & Chaos Drills
* Configure HPA for backend pods (CPU threshold: 60%, Min: 2, Max: 8).
* Run load tests with `k6` to watch Kubernetes automatically spin up new pods.
* Chaos engineering: Simulate worker node failure (`kubectl drain`) and verify zero user downtime.
