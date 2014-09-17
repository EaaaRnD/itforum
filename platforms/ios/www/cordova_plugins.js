cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/org.apache.cordova.device/www/device.js",
        "id": "org.apache.cordova.device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.dialogs/www/notification.js",
        "id": "org.apache.cordova.dialogs.notification",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.inappbrowser/www/inappbrowser.js",
        "id": "org.apache.cordova.inappbrowser.inappbrowser",
        "clobbers": [
            "window.open"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.network-information/www/network.js",
        "id": "org.apache.cordova.network-information.network",
        "clobbers": [
            "navigator.connection",
            "navigator.network.connection"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.network-information/www/Connection.js",
        "id": "org.apache.cordova.network-information.Connection",
        "clobbers": [
            "Connection"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.splashscreen/www/splashscreen.js",
        "id": "org.apache.cordova.splashscreen.SplashScreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "file": "plugins/org.jboss.aerogear.cordova.push/www/aerogear-push.js",
        "id": "org.jboss.aerogear.cordova.push.AeroGear.UnifiedPush",
        "clobbers": [
            "push"
        ]
    },
    {
        "file": "plugins/uk.co.ilee.directions/www/directions.js",
        "id": "uk.co.ilee.directions.Directions",
        "clobbers": [
            "directions"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.plugin.sms/www/sms.js",
        "id": "org.apache.cordova.plugin.sms.Sms",
        "clobbers": [
            "window.sms"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "org.apache.cordova.device": "0.2.9",
    "org.apache.cordova.dialogs": "0.2.7",
    "org.apache.cordova.inappbrowser": "0.4.0",
    "org.apache.cordova.network-information": "0.2.8",
    "org.apache.cordova.splashscreen": "0.3.0",
    "org.jboss.aerogear.cordova.push": "0.5.0",
    "uk.co.ilee.directions": "0.1.1",
    "org.apache.cordova.plugin.sms": "0.1.0"
}
// BOTTOM OF METADATA
});