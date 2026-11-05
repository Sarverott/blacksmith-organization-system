#!/usr/bin/env bash
# Tells who listens that <tag> is out. Each channel only when its secret is set.
#   community: DISCORD_WEBHOOK; TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID
#   social:    SOCIAL_WEBHOOK, receives {event, repository, tag, url}   ([TODO] which media)
#   workshop:  BOS_WORKSHOP_HOOK, receives {event, repository, tag, sync}  ([TODO] no listener yet)
# Usage: notify.sh community|social|workshop <tag>
source "$(dirname "$0")/_common.sh"
audience="${1:?community|social|workshop}"
tag="${2:?tag}"
url=$(release_url "$tag")

post_json() { curl -fsS -H 'Content-Type: application/json' -d @- "$1"; }

case "$audience" in
  community)
    text="Blacksmith Organization System $tag is out: $url"
    if [ -n "${DISCORD_WEBHOOK:-}" ]; then
      jq -n --arg t "$text" '{content: $t}' | post_json "$DISCORD_WEBHOOK" && echo "discord: sent"
    else echo "discord: no DISCORD_WEBHOOK"; fi
    if [ -n "${TELEGRAM_BOT_TOKEN:-}" ] && [ -n "${TELEGRAM_CHAT_ID:-}" ]; then
      curl -fsS "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
        --data-urlencode "chat_id=$TELEGRAM_CHAT_ID" --data-urlencode "text=$text" > /dev/null && echo "telegram: sent"
    else echo "telegram: no TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID"; fi
    ;;
  social)
    if [ -z "${SOCIAL_WEBHOOK:-}" ]; then echo "social: no SOCIAL_WEBHOOK"; exit 0; fi
    jq -n --arg r "$GITHUB_REPOSITORY" --arg t "$tag" --arg u "$url" \
      '{event: "release", repository: $r, tag: $t, url: $u}' | post_json "$SOCIAL_WEBHOOK"
    ;;
  workshop)
    if [ -z "${BOS_WORKSHOP_HOOK:-}" ]; then echo "workshop: no BOS_WORKSHOP_HOOK"; exit 0; fi
    jq -n --arg r "$GITHUB_REPOSITORY" --arg t "$tag" \
      '{event: "release", repository: $r, tag: $t, sync: ["master", "development"]}' | post_json "$BOS_WORKSHOP_HOOK"
    ;;
  *) echo "unknown audience: $audience" >&2; exit 2 ;;
esac
