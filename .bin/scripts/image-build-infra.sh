#!/usr/bin/env bash

set -euo pipefail

readonly IMAGE_NAME=${1:?"Merci de préciser le directory (ex. reverse_proxy)"}
shift
readonly VERSION=$("${SCRIPT_DIR}/version-current.sh" $IMAGE_NAME)

echo "Build & Push docker de $IMAGE_NAME sur le registry github (https://ghcr.io/faxaq/website)"

get_channel() {
  local version="$1"
  channel=$(echo "$version" | cut -d '-' -f 2)

  if [ "$channel" == "$version" ]; then
    channel="latest"
  else
    channel=$(echo $channel | cut -d '.' -f 1 )
  fi

  echo $channel
}

select_version() {
  local NEXT_PATCH_VERSION=$("${SCRIPT_DIR}/version-generate.sh" "patch")

  if [ $NEXT_PATCH_VERSION == $VERSION ]; then
    read -p "Current commit is already deployed as $VERSION. Do you want to overwrite ? [Y/n]: " overwrite
    case $overwrite in
      [yY][eE][sS]|[yY]|"")
        echo "$VERSION"
        return;
        ;;
      *)
        ;;
    esac
  fi;

  read -p "Current version $VERSION > New version ($NEXT_PATCH_VERSION) ? [Y/n]: " response
  case $response in
    [nN][oO]|[nN])
      read -p "Custom version : " CUSTOM_VERSION
      echo "$CUSTOM_VERSION"
      ;;
    [yY][eE][sS]|[yY]|"")
      echo "$NEXT_PATCH_VERSION"
      ;;
    *)
      echo "$response"
      ;;
  esac
}

NEXT_VERSION=$(select_version)

echo -e '\n'
read -p "Do you need to login to ghcr.io registry? [y/N]" RES_LOGIN

case $RES_LOGIN in
  [yY][eE][sS]|[yY])
    read -p "[ghcr.io] user ? : " u
    read -p "[ghcr.io] GH personnal token ? : " p

    echo "Login sur le registry ..."
    echo $p | docker login ghcr.io -u "$u" --password-stdin
    echo "Logged!"
    ;;
esac

set +e
docker buildx create --name norra --driver docker-container --bootstrap --use 2> /dev/null
set -e

echo "Building $IMAGE_NAME:$NEXT_VERSION ..."
docker buildx build "$INFRA_DIR/$IMAGE_NAME" \
      --platform linux/amd64,linux/arm64 \
      --tag ghcr.io/faxaq/website_$IMAGE_NAME:"$NEXT_VERSION" \
      --tag ghcr.io/faxaq/website_$IMAGE_NAME:$(get_channel $NEXT_VERSION) \
      --label "org.opencontainers.image.source=https://ghcr.io/faxaq/website" \
      --label "org.opencontainers.image.description=$IMAGE_NAME norra.fr" \
      --label "org.opencontainers.image.version=$NEXT_VERSION" \
      --label "org.opencontainers.image.licenses=MIT" \
      --builder norra \
      --push

TAG="$IMAGE_NAME@$NEXT_VERSION"
echo "Creating tag $TAG"
git --git-dir="$ROOT_DIR/.git" tag -f $TAG
git --git-dir="$ROOT_DIR/.git" push -f origin $TAG
