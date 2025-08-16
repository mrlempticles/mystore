"""
Simple HTTP Server for E-commerce Store
Runs the store locally on your system
"""

import http.server
import socketserver
import webbrowser
import os
import sys
from pathlib import Path

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers to allow local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def run_server(port=8000):
    """Run the local development server"""
    try:
        # Change to the directory containing this script
        os.chdir(Path(__file__).parent)
        
        # Create server
        handler = CustomHTTPRequestHandler
        httpd = socketserver.TCPServer(("", port), handler)
        
        print(f"🚀 Starting E-commerce Store Server...")
        print(f"📍 Server running at: http://localhost:{port}")
        print(f"🌐 Your store is accessible at: http://localhost:{port}")
        print(f"📱 Admin panel: Click 'Admin Panel' button on the website")
        print(f"🛑 To stop server: Press Ctrl+C")
        print("-" * 50)
        
        # Auto-open browser
        webbrowser.open(f'http://localhost:{port}')
        
        # Start server
        httpd.serve_forever()
        
    except KeyboardInterrupt:
        print(f"\n🛑 Server stopped by user")
        httpd.shutdown()
        httpd.server_close()
        sys.exit(0)
    except OSError as e:
        if e.errno == 48:  # Port already in use
            print(f"❌ Port {port} is already in use!")
            print(f"💡 Try running with a different port:")
            print(f"   python server.py --port 8001")
        else:
            print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Run E-commerce Store locally')
    parser.add_argument('--port', '-p', type=int, default=8000, 
                       help='Port to run server on (default: 8000)')
    
    args = parser.parse_args()
    run_server(args.port)