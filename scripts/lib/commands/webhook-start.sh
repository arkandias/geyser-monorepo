###############################################################################
# WEBHOOK-START COMMAND
###############################################################################

show_webhook_start_help() {
    cat <<EOF
Start a webhook on port 9000

Usage: geyser webhook-start

Start a secure webhook server on port 9000 using SSL/TLS certificates.
Requires WEBHOOK_SECRET environment variable to be set.

Options:
  -h, --help        Show this help message

Note: Run 'geyser webhook-stop' to stop any running webhook.
EOF
}

handle_webhook_start() {
    # Parse options
    while [[ "$#" -gt 0 ]]; do
        case "$1" in
        -h | --help)
            show_webhook_start_help
            exit 0
            ;;
        *)
            error "Unknown parameter '$1' (see 'geyser webhook-start --help')"
            ;;
        esac
    done

    # Ensure webhook secret is provided
    if [[ -z "${WEBHOOK_SECRET}" ]]; then
        error "Missing required variable WEBHOOK_SECRET"
    fi

    # Check if a webhook is already running
    if lsof -i :9000 -t; then
        error "A process is already listening on port 9000. \
Stop it first with 'geyser webhook-stop'"
    fi

    export WEBHOOK_SECRET
    webhook -port 9000 -verbose -secure \
        -template "${GEYSER_HOME}/config/webhooks/${GEYSER_MODE}.json" \
        -cert "${GEYSER_HOME}/nginx/certs/${GEYSER_DOMAIN}/fullchain.crt" \
        -key "${GEYSER_HOME}/nginx/certs/${GEYSER_DOMAIN}/private.key" \
        &>>"${LOG_DIR}/webhook.log" &
    info "Webhook listening on port 9000. Run 'geyser webhook-stop' to stop it"
}
