import hashlib
import hmac
from typing import Any


class TelegramLoginError(Exception):
    pass


def verify_telegram_login(data: dict[str, Any], bot_token: str) -> dict[str, Any]:
    """Verify Telegram Login Widget auth data.

    Docs: https://core.telegram.org/widgets/login

    Secret key: sha256(bot_token)
    Check string: key=value pairs sorted by key, joined with \n, excluding 'hash'.
    """

    if not bot_token:
        raise TelegramLoginError("missing bot token")

    received_hash = (data.get("hash") or "").strip()
    if not received_hash:
        raise TelegramLoginError("missing hash")

    pairs = []
    for k, v in data.items():
        if k == "hash":
            continue
        if v is None:
            continue
        pairs.append((str(k), str(v)))

    pairs.sort(key=lambda kv: kv[0])
    check_string = "\n".join([f"{k}={v}" for k, v in pairs])

    secret_key = hashlib.sha256(bot_token.encode("utf-8")).digest()
    calc_hash = hmac.new(secret_key, check_string.encode("utf-8"), hashlib.sha256).hexdigest()

    if not hmac.compare_digest(calc_hash, received_hash):
        raise TelegramLoginError("bad hash")

    return data
