# virto
This repository is intended to mantain the code of my Undergraduate Thesis Project on Informatics Engineering. It contains both the proyect and a blog on which I'll be publishing all the progress I make, you can check it out [here](https://jdjuli.github.io/virto/)

# About

My thesis aims to explore how it would be to program on a VR environment, as it's a technology that is becoming more and more available and affordable. 
On the first days of the computers, programmers had to use perforated cards, but when screens became available, more complex tools such as IDEs came up and later on, the evolution of the computer graphics brought us tools like [Scratch](https://scratch.mit.edu/), that allow us to write programs with geometric forms instead of writing code.

# Documents and links
- [Thesis in spanish (.pdf)](https://jdjuli.github.io/virto/memoria.pdf)
- [Slides (.pdf)](https://jdjuli.github.io/virto/presentacion.pdf)
- [Videos of the first release](https://www.youtube.com/channel/UCS-eM4L0dlqbrv3XB45IxKA)
- Suggested demos to be tried:
  - [Demo 18](https://jdjuli.github.io/virto/scenes/demos/demo18/): First idea of VR IDE, programs are built vertically and elements are created through a menu.
  - [Demo 19](https://jdjuli.github.io/virto/scenes/demos/demo19/): Second idea, programs are built horizontally and the instructions are parametrizable. Values are constants.
  - [Demo 20](https://jdjuli.github.io/virto/scenes/demos/demo20/): Similar to the Demo 19, but environment changed and now variables are available.
  - [Demo 22](https://jdjuli.github.io/virto/scenes/demos/demo22/): Adds conditional and repetitive instructions to the Demo 20

# I want to try it

To try the scenes, you'll only need to clone or download this respository and serve the __/docs__ path over HTTPS. 
This proyect provides a python script intended to serve the files over HTTPS, but to use it, I suggest to install first OpenSSL and HUGO and use the script __HTTPS_server.bat__ on MS Windows or translate it to the scripting languaje you use on your operative system, so you can rebuild the blog and regenerate the server certificate whenever you want.
