#!/bin/bash

for i in "$@"
do
case $i in
    -m=*|--method=*)
        method="${i#*=}"
        shift # past argument=value
        ;;
    *)
        # unknown option
        ;;
esac
done

if [ -z "$CORE_ENVIRONMENT" ]; then
  CORE_ENVIRONMENT=local
fi
CORE_ENVIRONMENT=$(echo $CORE_ENVIRONMENT | awk '{print tolower($0)}')

projectDirectoryName=${PWD##*/}
projectPath=$(pwd)
docker_compose_file=docker-compose.yml
env_file=.env

if [ -f $env_file ]; then
    source $env_file
    export $(cut -d= -f1 $env_file)
fi

echo "Running in:"
echo "Environment: $CORE_ENVIRONMENT"
echo "Method: $method"
echo "Compose file: $docker_compose_file"
echo ""

install() {
  docker-compose -f $docker_compose_file run --rm node bash -c "npm install"
}

build() {
  docker-compose -f $docker_compose_file run --rm node bash -c "npm run build"
}

testWatch() {
  docker-compose -f $docker_compose_file run --rm node bash -c "npm run test-dev"
}

lintStaged() {
  docker-compose -f $docker_compose_file run --rm node bash -c "npm run lint-staged"
}

publish() {
  build
  npm login
  npm version prerelease
  npm publish
}

case "$method" in
  build)
    build
    ;;
  test-watch)
    testWatch
    ;;
  lint-staged)
    lintStaged
    ;;
  install)
    install
    ;;
  publish)
    publish
    ;;
  *)
    echo $"Usage: $0 {test-watch|build}"
    exit 1
esac

exit 0
