# backend/app/core/limiter.py
"""Rate limiting utilities for the FastAPI backend.

We use **slowapi** to provide simple, decorator‑based limits. The
`limiter` instance is imported by the main application and can be used
in any router via the `Depends` injection.
"""

from slowapi import Limiter
from slowapi.util import get_remote_address

# Default limit: 100 requests per minute per IP address.
limiter = Limiter(key_func=get_remote_address, default_limits=["100/minute"])
