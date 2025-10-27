#!/bin/zsh

set -euo pipefail

echo "Starting backend and frontend... (Ctrl-C to stop both)"

# Start backend in background
(
	cd backend
	./pipeline.sh
) &
BACK_PID=$!

# Start frontend in background
(
	cd frontend
	./pipeline.sh
) &
FRONT_PID=$!

cleanup() {
	echo "\nStopping processes..."
	# Send TERM to allow graceful shutdown
	kill -TERM ${BACK_PID} ${FRONT_PID} 2>/dev/null || true
	# Wait for them to exit
	wait ${BACK_PID} 2>/dev/null || true
	wait ${FRONT_PID} 2>/dev/null || true
}

trap cleanup INT TERM EXIT

# Wait for both to finish (Ctrl-C will trigger cleanup)
wait ${BACK_PID}
BACK_STATUS=$?
wait ${FRONT_PID}
FRONT_STATUS=$?

# Exit with non-zero if either failed
if [ ${BACK_STATUS} -ne 0 ] || [ ${FRONT_STATUS} -ne 0 ]; then
	exit 1
fi
exit 0