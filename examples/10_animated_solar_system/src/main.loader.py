
import webview
import time
import sys

def open_window():
    webview.create_window('Omni Native App', 'http://localhost:3003/main.html')
    webview.start()

if __name__ == '__main__':
    try:
        open_window()
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
