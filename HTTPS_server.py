from http.server import HTTPServer, SimpleHTTPRequestHandler
import ssl
import os
import re

#
# Puerto en el que escuchará el servidor, que no debe estar siendo usado por otro programa
#
PUERTO=4443
#
# Ruta donde están los archivos que queremos servir, si es la misma ubicación del script, usar "./"
#
RUTA_ARCHIVOS = "./docs"
#
# El nombre de repositorio permite acceder a los archivos de dos maneras:
# · https://localhost:PUERTO/miPagina.html
# · https://localhost:PUERTO/NOMBRE_REPOSITORIO/miPagina.html
#
# El propósito es usar rutas relativas que funcionen tanto en nuestro ordenador como en Gitlab/Github pages
#
NOMBRE_REPOSITORIO = "vr-programming/"

os.chdir("./docs")

class MyRequestHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        regex = re.compile(r"\/"+NOMBRE_REPOSITORIO+"(\/?)$")
        
        if self.path.startswith("/"+NOMBRE_REPOSITORIO):
            if regex.match(self.path):
                return SimpleHTTPRequestHandler.translate_path(self, '/index.html')
            else:
                return SimpleHTTPRequestHandler.translate_path(self, path[len("/"+NOMBRE_REPOSITORIO):])
        else:
            return SimpleHTTPRequestHandler.translate_path(self, path)

httpd = HTTPServer(('0.0.0.0', PUERTO), MyRequestHandler)

httpd.socket = ssl.wrap_socket (httpd.socket, 
                                keyfile="../key.pem", 
                                certfile='../cert.pem', 
                                server_side=True)

httpd.serve_forever()