import requests
from django.http import JsonResponse
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .vev import deque, logger, windows, WINDOW_SIZE, BEARER_TOKEN, TEST_SERVER_URLS

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
