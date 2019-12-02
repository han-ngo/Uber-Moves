# Uber-Moves

## Runing the Application

### Website
https://ubermoves.github.io/

### Run locally
#### for python 2
```
$ python -m SimpleHTTPServer 8080
```
#### for python 3
```
$ python -m http.server 8080
```
You can then view the page at http://localhost:8080/

## Code Documentation

* [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML): The main HTML is app.html which provides the base for the visualization on the web browser.
* **script.js**: Entry point for the whole project, instantiates and initializes components after reading the data file. Registers necessary listeners. 
* **bars.js**: Provides code for the three charts - Days of the week, Hours of the day and Line(s) graph.  Following are the three methods that handle these respectively:
    1. bars_dow()
    2. bars_hourly()
    3. dow_hourly()
* **table.js**: Table component base code.
* **appmanager.js**: A singleton class which provides global access ability between different components.
* **circularslider.js**: A circular brush slider used for days selection and hours selection, based on canvas rendering.
* **Brushslider.js**: A linear brush slider used for days selection and hours selection, already deprecated.

Third-party dependency:
* [Map Talk](https://maptalks.org/): The map vis library.
* [Bootstrap](https://getbootstrap.com/): Layout and some other components like Collapse, Card.
* [Reveal.js](https://revealjs.com/): For our project website, a presentation style framework.
* [Tabulator](http://tabulator.info/): For creating the interactive table
