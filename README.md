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

## Folder Structure

```
├─assets
├─cpp
│  ├─include        
│  └─src
├─css
├─data 
├─data processing
│  └─js
├─js (most codes are here)
│  └─component
└─thirdparty 
    ├─maptalks
    └─tabulator-master
        ├─.github
        │  └─ISSUE_TEMPLATE
        ├─dist
        │  ├─css
        │  │  ├─bootstrap
        │  │  ├─bulma
        │  │  ├─materialize
        │  │  └─semantic-ui
        │  └─js
        │      └─modules
        └─src
            ├─js
            │  └─modules
            └─scss
                ├─bootstrap
                ├─bulma
                ├─materialize
                └─semantic-ui
```

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
* **brushslider.js**: A linear brush slider used for days selection and hours selection, already deprecated.
* **map.js**: Map implenmentation, Rendering and managing the whole map viewport.

Third-party dependency:
* [Maptalks](https://maptalks.org/): The map vis library.
* [Bootstrap](https://getbootstrap.com/): Layout and some other components like Collapse, Card.
* [Reveal.js](https://revealjs.com/): For our project website, a presentation style framework.
* [Tabulator](http://tabulator.info/): For creating the interactive table

## Non-Obvious Features

#### Preset
You can quikly navigate into specific setting by click preset button. It is a feature for storytelling.

#### Reset
Map state and circular slider state can be reset by click reset button. Reset button for map is on the top right. Circular slider's reset button is on the center of itself.

#### Map Mode
Map has 3 modes, Cluster mode, Circle mode, Heatmap mode. You can change it by click map mode button which locates at the top right.

#### Table Sort
You can sort based on property by clicking header.

#### Line chart highlight
You can click color marker to highlight the corresponding line.
