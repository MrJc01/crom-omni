
import webview
import sys
import os

# Get path to local HTML file
current_dir = os.path.dirname(os.path.abspath(__file__))
html_path = os.path.join(current_dir, "main.html")

def open_window():
    if os.path.exists(html_path):
        webview.create_window('Omni Native App', f'file://{html_path}')
    else:
        # Try to find any HTML file in the directory
        for f in os.listdir(current_dir):
            if f.endswith('.html'):
                html_path = os.path.join(current_dir, f)
                webview.create_window('Omni Native App', f'file://{html_path}')
                break
        else:
            print(f"Error: No HTML file found in {current_dir}")
            sys.exit(1)
    webview.start()

if __name__ == '__main__':
    try:
        open_window()
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
