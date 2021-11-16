### Ui for Drift Report
This project can work separately or as a part of Hydrosphere's micro frontend architecture

#### Prerequisites
* Node 14+
* Python 3.8 - used for creating simple backend server which serves static files
* poetry - used for python dependencies

### Commands
- ```npm start``` - to start local server (used port: 3000)
### How to use as a part of MFE
- ```poetry install``` - install Python dependencies for mock backend server
- ```poetry shell``` - activate poetry environment
- ```npm run build``` - will build project to **/dist** folder
- ```uvicorn main:app --reload``` - to start backend server

Now you can load exposed module to [Core Ui](https://github.com/Hydrospheredata/hydroserving-ui-shell). More about module federation [module federation](https://webpack.js.org/concepts/module-federation/)
