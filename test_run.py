
import sys
import traceback

try:
    import output_debug_utf8
    # If output_debug_utf8 doesn't call main automatically (it does in __name__ == __main__ check)
    # But importing it won't run main if it has the check.
    # So we call it.
    output_debug_utf8.main()
except Exception:
    with open('error.log', 'w') as f:
        traceback.print_exc(file=f)
