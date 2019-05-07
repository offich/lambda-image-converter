#!/bin/sh

set -e

if [ $# != 1 ]; then
  echo "usage: sh deploy-lambda.sh {dev|prd}"
  exit 1
fi

env=$1

export DEPLOYMENT_BUCKET=lambda-funcs-deployed-by-serverless

$(npm bin)/sls deploy --aws-profile awspractice --verbose --stage $env