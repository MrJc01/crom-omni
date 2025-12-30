
import webview
import sys
import os

# Get path to local index.html
current_dir = os.path.dirname(os.path.abspath(__file__))
html_path = os.path.join(current_dir, "index.html")

def open_window():
    if os.path.exists(html_path):
        webview.create_window('Omni Native App', f'file://{html_path}')
    else:
        # Fallback to server if needed, or strictly local file
        print(f"Error: index.html not found at {html_path}")
        # Try finding js file
    webview.start()

if __name__ == '__main__':
    try:
        open_window()
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
