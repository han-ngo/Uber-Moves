let instance = null

class AppManager {
    static get instance() {
        return instance
    }

    static set instance(_instance) {
        instance = _instance
    }

    constructor() {
        this.UberData = null;
        this.NewYorkGeoJson = null;
        
        if (AppManager.instance === null) {
            AppManager.instance = this
        }
        return AppManager.instance
    }

    static getInstance() {
        return new AppManager()
    }

    getMap() {
        return this.map;
    }

    setMap(map) {
        this.map = map;
    }
}