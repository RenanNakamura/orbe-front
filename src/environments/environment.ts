// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    buddy: 'http://localhost:8080',
    campaign: 'http://localhost:8081',
    storage: 'http://localhost:8083',
    webhook: 'http://localhost:8089',
    flow: 'http://localhost:8082',
    calendar: 'http://localhost:8092',
    whatsappService: 'http://localhost:9000',
    chat: 'http://localhost:8091',
    chatWebSocket: 'ws://localhost:8091/ws/chat',
    receptcha: {
        sitekey: '6LdsZT0pAAAAACxAmMHdH5grjNUDJSQ6rdfdBE04'
    },
    facebookApp: {
        appId: '1045862770673410',
        configId: '1031328955052004',
        version: 'v21.0'
    }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
