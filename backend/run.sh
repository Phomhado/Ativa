#!/usr/bin/env bash
set -euo pipefail

export FLASK_APP=backend.app:create_app
export FLASK_RUN_HOST=0.0.0.0
export FLASK_RUN_PORT=5000

flask run --app backend.app:create_app
