#!/usr/bin/env bash
# ============================================================================
# Axiom Framework - Automated Deployment Script
# Usage: ./setup.sh --tier {small|medium|large} [--domain DOMAIN] [--yes]
# ============================================================================

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
TIER="small"
DOMAIN=""
AUTO_YES=false
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Logging functions
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[OK]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Print banner
print_banner() {
    cat << 'EOF'
    ___    __                        __
   /   |  / /___  ________  ______  / /____  _____
  / /| | / / __ \/ ___/ _ \/ ___/ / __/ _ \/ ___/
 / ___ |/ / /_/ / /  /  __(__  ) / /_/  __/ /
/_/  |_/_/\____/_/   \___/____/  \__/\___/_/

   Open-Source City Dashboard Builder
EOF
    echo ""
}

# Show usage
usage() {
    cat << EOF
Usage: $(basename "$0") [OPTIONS]

Options:
    -t, --tier {small|medium|large}   Deployment tier (default: small)
    -d, --domain DOMAIN               Domain name for SSL (e.g., dashboard.yourcity.go.th)
    -y, --yes                         Skip confirmation prompts
    -h, --help                        Show this help message

Examples:
    $(basename "$0") --tier small --domain dashboard.sikhio.go.th
    $(basename "$0") -t medium -d ops.yourcity.go.th --yes
    $(basename "$0") --tier large --domain axiom.bangkok.go.th

Tiers:
    small   - 1 server, 4 vCPU, 8 GB RAM (municipalities < 50,000)
    medium  - 2 servers, app + db split (municipalities 50,000-500,000)
    large   - Kubernetes cluster (municipalities > 500,000)
EOF
}

# Parse arguments
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -t|--tier)
                TIER="$2"
                shift 2
                ;;
            -d|--domain)
                DOMAIN="$2"
                shift 2
                ;;
            -y|--yes)
                AUTO_YES=true
                shift
                ;;
            -h|--help)
                usage
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                usage
                exit 1
                ;;
        esac
    done

    # Validate tier
    if [[ ! "$TIER" =~ ^(small|medium|large)$ ]]; then
        log_error "Invalid tier: $TIER. Must be small, medium, or large."
        exit 1
    fi
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."

    # Check OS
    if [[ -f /etc/os-release ]]; then
        source /etc/os-release
        if [[ "$ID" != "ubuntu" && "$ID" != "debian" ]]; then
            log_warn "This script is tested on Ubuntu/Debian. Your OS: $ID"
            if ! confirm "Continue anyway?"; then
                exit 1
            fi
        fi
        log_info "OS: $PRETTY_NAME"
    fi

    # Check Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Install it first:"
        echo "  curl -fsSL https://get.docker.com | sh"
        exit 1
    fi

    DOCKER_VERSION=$(docker --version | awk '{print $3}' | tr -d ',')
    log_success "Docker: $DOCKER_VERSION"

    # Check Docker Compose
    if ! docker compose version &> /dev/null; then
        log_error "Docker Compose plugin is not installed."
        echo "  sudo apt install docker-compose-plugin"
        exit 1
    fi

    COMPOSE_VERSION=$(docker compose version --short)
    log_success "Docker Compose: $COMPOSE_VERSION"

    # Check available resources
    TOTAL_RAM=$(free -g | awk '/^Mem:/{print $2}')
    TOTAL_CPU=$(nproc)
    log_info "System resources: ${TOTAL_CPU} CPU, ${TOTAL_RAM} GB RAM"

    # Validate resources against tier
    case $TIER in
        small)
            if [[ $TOTAL_RAM -lt 6 ]]; then
                log_warn "Small tier recommends 8 GB RAM. Found: ${TOTAL_RAM} GB"
            fi
            ;;
        medium)
            if [[ $TOTAL_RAM -lt 14 ]]; then
                log_warn "Medium tier recommends 16+ GB RAM. Found: ${TOTAL_RAM} GB"
            fi
            ;;
        large)
            if [[ $TOTAL_RAM -lt 30 ]]; then
                log_warn "Large tier recommends 32+ GB RAM. Found: ${TOTAL_RAM} GB"
            fi
            ;;
    esac

    # Check ports
    check_port() {
        local port=$1
        if ss -tuln | grep -q ":$port "; then
            log_warn "Port $port is already in use"
            return 1
        fi
        return 0
    }

    local ports=(5432 3000 3002 8080 8000 8001 1883)
    local port_available=true
    for port in "${ports[@]}"; do
        if ! check_port "$port"; then
            port_available=false
        fi
    done

    if [[ "$port_available" == false ]]; then
        if ! confirm "Some ports are in use. Continue anyway?"; then
            exit 1
        fi
    fi

    log_success "Prerequisites check complete"
}

# Generate secure passwords
generate_passwords() {
    log_info "Generating secure passwords..."

    POSTGRES_PASSWORD=$(openssl rand -base64 32)
    THINGSBOARD_PASSWORD=$(openssl rand -base64 24)
    GRAFANA_ADMIN_PASSWORD=$(openssl rand -base64 16)
    GRAFANA_DB_PASSWORD=$(openssl rand -base64 24)
    METABASE_PASSWORD=$(openssl rand -base64 24)
    KONG_PASSWORD=$(openssl rand -base64 24)
    POLLER_PASSWORD=$(openssl rand -base64 24)
    GRAFANA_SECRET=$(openssl rand -base64 32)

    log_success "Passwords generated"
}

# Create .env file
create_env_file() {
    log_info "Creating environment configuration..."

    local env_file="$PROJECT_DIR/.env"

    cat > "$env_file" << EOF
# Axiom Framework - Environment Configuration
# Generated on $(date -Iseconds)
# Tier: $TIER

# =============================================================================
# CORE SETTINGS
# =============================================================================

COMPOSE_PROJECT_NAME=axiom
TIER=$TIER
DOMAIN=${DOMAIN:-localhost}
TZ=Asia/Bangkok

# =============================================================================
# POSTGRESQL / TIMESCALEDB
# =============================================================================

POSTGRES_USER=axiom
POSTGRES_PASSWORD=$POSTGRES_PASSWORD
POSTGRES_DB=municipal
POSTGRES_PORT=5432

# Performance tuning (auto-configured for $TIER tier)
PG_SHARED_BUFFERS=$(case $TIER in small) echo "2GB";; medium) echo "4GB";; large) echo "16GB";; esac)
PG_EFFECTIVE_CACHE_SIZE=$(case $TIER in small) echo "6GB";; medium) echo "12GB";; large) echo "48GB";; esac)
PG_WORK_MEM=$(case $TIER in small) echo "32MB";; medium) echo "64MB";; large) echo "256MB";; esac)
PG_MAINTENANCE_WORK_MEM=$(case $TIER in small) echo "512MB";; medium) echo "1GB";; large) echo "4GB";; esac)
PG_MAX_CONNECTIONS=$(case $TIER in small) echo "100";; medium) echo "200";; large) echo "500";; esac)
PG_MAX_PARALLEL_WORKERS=$(case $TIER in small) echo "4";; medium) echo "8";; large) echo "16";; esac)
TSDB_MAX_BG_WORKERS=$(case $TIER in small) echo "4";; medium) echo "8";; large) echo "16";; esac)

# =============================================================================
# IOT / MQTT
# =============================================================================

MQTT_PORT=1883
MQTT_WS_PORT=9001
THINGSBOARD_HTTP_PORT=8080
THINGSBOARD_MQTT_PORT=1884
THINGSBOARD_DB_PASSWORD=$THINGSBOARD_PASSWORD

# =============================================================================
# VISUALIZATION
# =============================================================================

GRAFANA_PORT=3000
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=$GRAFANA_ADMIN_PASSWORD
GRAFANA_DB_PASSWORD=$GRAFANA_DB_PASSWORD
GRAFANA_SECRET_KEY=$GRAFANA_SECRET
GRAFANA_ROOT_URL=http://${DOMAIN:-localhost}:3000

METABASE_PORT=3002
METABASE_DB_PASSWORD=$METABASE_PASSWORD

# =============================================================================
# API GATEWAY
# =============================================================================

KONG_PROXY_HTTP=8000
KONG_PROXY_HTTPS=8443
KONG_ADMIN_HTTP=8001
KONG_ADMIN_HTTPS=8444
KONG_DB_PASSWORD=$KONG_PASSWORD

# =============================================================================
# SSL / DOMAIN
# =============================================================================

ACME_EMAIL=admin@${DOMAIN:-localhost}

# =============================================================================
# DATA SOURCE API KEYS (fill these in after registration)
# =============================================================================

DATA_GO_TH_API_KEY=
BMA_API_KEY=
TRAFFY_API_KEY=
WAQI_TOKEN=
GISTDA_TOKEN=
TPMAP_KEY=

# =============================================================================
# SECURITY WARNING: Keep this file secure!
# Run: chmod 600 .env
# =============================================================================
EOF

    chmod 600 "$env_file"
    log_success "Environment file created: $env_file"
}

# Create necessary directories
create_directories() {
    log_info "Creating directory structure..."

    local dirs=(
        "$PROJECT_DIR/config/grafana/provisioning/dashboards"
        "$PROJECT_DIR/config/grafana/provisioning/datasources"
        "$PROJECT_DIR/config/grafana/dashboards"
        "$PROJECT_DIR/config/mosquitto"
        "$PROJECT_DIR/poller/scripts"
        "$PROJECT_DIR/poller/state"
        "$PROJECT_DIR/backups"
    )

    for dir in "${dirs[@]}"; do
        mkdir -p "$dir"
    done

    log_success "Directories created"
}

# Configure Mosquitto MQTT broker
configure_mosquitto() {
    log_info "Configuring MQTT broker..."

    cat > "$PROJECT_DIR/config/mosquitto.conf" << 'EOF'
# Axiom Framework - Mosquitto MQTT Configuration
listener 1883
protocol mqtt

listener 9001
protocol websockets

# Persistence
persistence true
persistence_location /mosquitto/data/

# Logging
log_dest stdout
log_type error
log_type warning
log_type information
connection_messages true

# Security
allow_anonymous false
password_file /mosquitto/config/passwd
acl_file /mosquitto/config/acl

# Performance
max_connections 1000
max_inflight_messages 40
max_queued_messages 1000

# Message expiry
message_expiry_interval 3600
EOF

    # Create password file
    touch "$PROJECT_DIR/config/mosquitto.passwd"
    chmod 600 "$PROJECT_DIR/config/mosquitto.passwd"

    # Create ACL file
    cat > "$PROJECT_DIR/config/mosquitto.acl" << 'EOF'
# ACL for Axiom Framework
# Format: user <username>
#         [topic [read|write|readwrite] <topic>]

# Admin user - full access
user axiom_admin
topic readwrite #

# Poller service - write telemetry, read config
user axiom_poller
topic write municipal/+/telemetry/+ 
topic write municipal/+/incidents/+
topic read municipal/+/config/+

# Grafana - read only
user axiom_grafana
topic read municipal/+/telemetry/+
topic read municipal/+/alerts/+

# Devices - write their own topics only
topic write v1/devices/me/telemetry
topic write v1/devices/me/attributes
topic read v1/devices/me/rpc/request/+
EOF

    log_success "MQTT broker configured"
}

# Configure Grafana provisioning
configure_grafana() {
    log_info "Configuring Grafana provisioning..."

    # Data source provisioning
    cat > "$PROJECT_DIR/config/grafana/provisioning/datasources/postgres.yml" << EOF
apiVersion: 1
datasources:
  - name: MunicipalDB
    type: postgres
    url: postgres:5432
    database: municipal
    user: grafana
    secureJsonData:
      password: \${GRAFANA_DB_PASSWORD}
    jsonData:
      sslmode: disable
      maxOpenConns: 100
      maxIdleConns: 100
      maxIdleConnsAuto: true
      connMaxLifetime: 14400
      timescaledb: true
    isDefault: true
    editable: false

  - name: MunicipalDB-Analytics
    type: postgres
    url: postgres:5432
    database: municipal
    user: grafana
    secureJsonData:
      password: \${GRAFANA_DB_PASSWORD}
    jsonData:
      sslmode: disable
      maxOpenConns: 50
      timescaledb: true
    isDefault: false
    editable: false
EOF

    # Dashboard provisioning
    cat > "$PROJECT_DIR/config/grafana/provisioning/dashboards/dashboards.yml" << 'EOF'
apiVersion: 1
providers:
  - name: 'Axiom Dashboards'
    orgId: 1
    folder: 'Axiom'
    folderUid: ''
    type: file
    disableDeletion: false
    editable: true
    updateIntervalSeconds: 30
    allowUiUpdates: true
    options:
      path: /var/lib/grafana/dashboards
      foldersFromFilesStructure: true
EOF

    # Copy sample dashboard if it exists
    if [[ -f "$PROJECT_DIR/examples/thailand-dashboard/grafana/dashboard.json" ]]; then
        cp "$PROJECT_DIR/examples/thailand-dashboard/grafana/dashboard.json" \
           "$PROJECT_DIR/config/grafana/dashboards/thailand-overview.json"
        log_success "Sample dashboard copied"
    fi

    log_success "Grafana provisioning configured"
}

# Confirm helper
confirm() {
    if [[ "$AUTO_YES" == true ]]; then
        return 0
    fi
    read -r -p "$1 [y/N] " response
    [[ "$response" =~ ^[Yy]$ ]]
}

# Pull Docker images
pull_images() {
    log_info "Pulling Docker images..."
    cd "$PROJECT_DIR"
    docker compose pull
    log_success "Images pulled"
}

# Start services
start_services() {
    log_info "Starting Axiom Framework services..."
    cd "$PROJECT_DIR"
    docker compose up -d postgres

    # Wait for PostgreSQL to be ready
    log_info "Waiting for PostgreSQL to initialize..."
    local retries=30
    while [[ $retries -gt 0 ]]; do
        if docker compose exec -T postgres pg_isready -U axiom -d municipal &> /dev/null; then
            log_success "PostgreSQL is ready"
            break
        fi
        sleep 2
        ((retries--))
    done

    if [[ $retries -eq 0 ]]; then
        log_error "PostgreSQL failed to start. Check logs: docker compose logs postgres"
        exit 1
    fi

    # Start remaining services
    docker compose up -d
    log_success "All services started"
}

# Display post-install info
show_summary() {
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  Axiom Framework Deployment Complete!  ${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "Tier: ${YELLOW}$TIER${NC}"
    echo -e "Domain: ${YELLOW}${DOMAIN:-localhost}${NC}"
    echo ""
    echo "Services:"
    echo "  Grafana (Operations):     http://${DOMAIN:-localhost}:3000"
    echo "    User: admin"
    echo "    Password: (see .env file)"
    echo ""
    echo "  Metabase (Analytics):     http://${DOMAIN:-localhost}:3002"
    echo "  ThingsBoard (IoT):        http://${DOMAIN:-localhost}:8080"
    echo "  Kong Admin:               http://${DOMAIN:-localhost}:8001"
    echo "  PostgreSQL:               localhost:5432"
    echo "  MQTT Broker:              localhost:1883"
    echo ""
    echo "Next steps:"
    echo "  1. Review and edit the .env file with your API keys"
    echo "  2. Log in to Grafana and verify data sources"
    echo "  3. Configure your municipality in the database"
    echo "  4. Start adding sensors and data sources"
    echo ""
    echo "Useful commands:"
    echo "  docker compose logs -f          # View all logs"
    echo "  docker compose ps               # Check service status"
    echo "  docker compose exec postgres psql -U axiom -d municipal  # Database CLI"
    echo ""
    echo -e "${GREEN}Your dashboard will be ready before any presentation.${NC}"
    echo ""
}

# Main execution
main() {
    print_banner
    parse_args "$@"

    log_info "Starting Axiom Framework deployment"
    log_info "Tier: $TIER"
    log_info "Project directory: $PROJECT_DIR"

    if ! confirm "Proceed with deployment?"; then
        log_info "Deployment cancelled"
        exit 0
    fi

    check_prerequisites
    generate_passwords
    create_env_file
    create_directories
    configure_mosquitto
    configure_grafana

    if confirm "Pull and start Docker containers now?"; then
        pull_images
        start_services
        show_summary
    else
        log_info "Configuration complete. Start manually with:"
        echo "  cd $PROJECT_DIR && docker compose up -d"
    fi
}

# Run main
main "$@"
