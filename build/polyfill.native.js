import mediaQuery from "css-mediaquery";
import * as ScreenOrientation from "expo-screen-orientation";
import { Dimensions } from "react-native";
class MediaQuery {
    constructor(query) {
        this.query = query;
        this.listeners = [];
        this.orientation = ScreenOrientation.Orientation.PORTRAIT_UP;
        this.resize = () => {
            this.updateListeners({ orientation: this.orientation });
        };
        // @ts-ignore
        (async () => {
            const orientation = await ScreenOrientation.getOrientationAsync();
            this.updateListeners({ orientation });
        })();
        this.unsubscribe = ScreenOrientation.addOrientationChangeListener(({ orientationInfo: { orientation } }) => {
            this.updateListeners({ orientation });
        });
        Dimensions.addEventListener("change", this.resize);
    }
    _unmount() {
        if (this.unsubscribe)
            this.unsubscribe.remove();
        Dimensions.removeEventListener("change", this.resize);
    }
    addListener(listener) {
        this.listeners.push(listener);
    }
    removeListener(listener) {
        const index = this.listeners.indexOf(listener);
        if (index !== -1)
            this.listeners.splice(index, 1);
    }
    // @ts-ignore
    get matches() {
        const windowDimensions = Dimensions.get("window");
        return mediaQuery.match(this.query, {
            type: "screen",
            orientation: ScreenOrientation.Orientation[this.orientation].toLowerCase(),
            ...windowDimensions,
            "device-width": windowDimensions.width,
            "device-height": windowDimensions.height,
        });
    }
    updateListeners({ orientation }) {
        this.orientation = orientation;
        this.listeners.forEach((listener) => {
            listener(this);
        });
    }
}
if (window) {
    // @ts-ignore
    window.matchMedia = (mediaQueryString) => new MediaQuery(mediaQueryString);
}
//# sourceMappingURL=polyfill.native.js.map