#!/bin/bash -e

docker run \
  --init --rm \
  -w /app \
  -v "$PWD:/app" \
  node:16 \
  bash -c 'yarn && yarn build && yarn prisma migrate deploy'

