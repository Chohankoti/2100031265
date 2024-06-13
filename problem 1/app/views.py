import requests
from django.http import JsonResponse
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from collections import deque
import time
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

WINDOW_SIZE = 10

windows = {
    'p': deque(maxlen=WINDOW_SIZE),
    'f': deque(maxlen=WINDOW_SIZE),
    'e': deque(maxlen=WINDOW_SIZE),
    'r': deque(maxlen=WINDOW_SIZE)
}

TEST_SERVER_URLS = {
    'p': 'http://20.244.56.144/test/primes',
    'f': 'http://20.244.56.144/test/fibo',
    'e': 'http://20.244.56.144/test/even',
    'r': 'http://20.244.56.144/test/random'
}

BEARER_TOKEN='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE4MjYyODA3LCJpYXQiOjE3MTgyNjI1MDcsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImFlZTU2OGMxLWZiMGItNDA5YS04YjlmLTRkODZhNTBkYjcxNCIsInN1YiI6InBhdG5hbmFzYWlkZWVrc2hpdGhAZ21haWwuY29tIn0sImNvbXBhbnlOYW1lIjoiS0wgVU5JVkVSU0lUWSIsImNsaWVudElEIjoiYWVlNTY4YzEtZmIwYi00MDlhLThiOWYtNGQ4NmE1MGRiNzE0IiwiY2xpZW50U2VjcmV0IjoiYU5HS1B6QlhieWFEZkh6biIsIm93bmVyTmFtZSI6IlAuU0FJIERFRUtTSElUSCIsIm93bmVyRW1haWwiOiJwYXRuYW5hc2FpZGVla3NoaXRoQGdtYWlsLmNvbSIsInJvbGxObyI6IjIxMDAwMzExMjMifQ.Bs8s5QHemzCyN_42g-DNoCZzqS-1fFd7O6ivn0apJKw'
@method_decorator(csrf_exempt, name='dispatch')
class NumbersView(View):

    def get(self, request, numberid):
        if numberid not in TEST_SERVER_URLS:
            return JsonResponse({'error': 'Invalid number type'}, status=400)

        start_time = time.time()
        url = TEST_SERVER_URLS[numberid]

        try:
            headers = {
                'Authorization': f'Bearer {BEARER_TOKEN}'
            }
            response = requests.get(url, headers=headers, timeout=0.5)
            response.raise_for_status()  # Raise HTTPError for bad responses
            fetched_numbers = response.json().get('numbers', [])
        except requests.RequestException as e:
            logger.error(f"Request to test server failed: {e}")
            return JsonResponse({'error': 'Failed to fetch numbers from test server'}, status=500)

        # Ensure uniqueness and add to window
        prev_window_state = list(windows[numberid])
        for num in fetched_numbers:
            if num not in windows[numberid]:
                windows[numberid].append(num)

        curr_window_state = list(windows[numberid])
        avg = sum(curr_window_state) / len(curr_window_state) if curr_window_state else 0

        response_data = {
            "numbers": fetched_numbers,
            "windowPrevState": prev_window_state,
            "windowCurrState": curr_window_state,
            "avg": avg
        }

        # Ensure response within 500 milliseconds
        elapsed_time = time.time() - start_time
        if elapsed_time > 0.5:
            return JsonResponse({'error': 'Response time exceeded 500 ms'}, status=500)

        return JsonResponse(response_data)
