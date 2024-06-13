import time
import logging
from collections import deque

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

WINDOW_SIZE = 10
BEARER_TOKEN='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE4MjY1ODYwLCJpYXQiOjE3MTgyNjU1NjAsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImFlZTU2OGMxLWZiMGItNDA5YS04YjlmLTRkODZhNTBkYjcxNCIsInN1YiI6InBhdG5hbmFzYWlkZWVrc2hpdGhAZ21haWwuY29tIn0sImNvbXBhbnlOYW1lIjoiS0wgVU5JVkVSU0lUWSIsImNsaWVudElEIjoiYWVlNTY4YzEtZmIwYi00MDlhLThiOWYtNGQ4NmE1MGRiNzE0IiwiY2xpZW50U2VjcmV0IjoiYU5HS1B6QlhieWFEZkh6biIsIm93bmVyTmFtZSI6IlAuU0FJIERFRUtTSElUSCIsIm93bmVyRW1haWwiOiJwYXRuYW5hc2FpZGVla3NoaXRoQGdtYWlsLmNvbSIsInJvbGxObyI6IjIxMDAwMzExMjMifQ.cjd6SnKEGq44qmDRleDPOiWnpFGdgeP3ggVm2hbp04w'


TEST_SERVER_URLS = {
    'p': 'http://20.244.56.144/test/primes',
    'f': 'http://20.244.56.144/test/fibo',
    'e': 'http://20.244.56.144/test/even',
    'r': 'http://20.244.56.144/test/rand'
}

windows = {
    'p': deque(maxlen=WINDOW_SIZE),
    'f': deque(maxlen=WINDOW_SIZE),
    'e': deque(maxlen=WINDOW_SIZE),
    'r': deque(maxlen=WINDOW_SIZE)
}
