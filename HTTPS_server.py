from http.server import HTTPServer, SimpleHTTPRequestHandler
import ssl
import os
import re

os.chdir("./docs")

class MyRequestHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        regex = re.compile(r"\/vr-programming(\/?)$")
        
        if self.path.startswith('/vr-programming'):
            if regex.match(self.path):
                return SimpleHTTPRequestHandler.translate_path(self, '/index.html')
            else:
                return SimpleHTTPRequestHandler.translate_path(self, path[len('/vr-programming'):])
        else:
            return SimpleHTTPRequestHandler.translate_path(self, path)

httpd = HTTPServer(('0.0.0.0', 4443), MyRequestHandler)

httpd.socket = ssl.wrap_socket (httpd.socket, 
        keyfile="../key.pem", 
        certfile='../cert.pem', server_side=True)

httpd.serve_forever()