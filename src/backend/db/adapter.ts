import LokiJSAdapter from "@nozbe/watermelondb/adapters/lokijs";
import schema from "./model/schema";

export const adapter = new LokiJSAdapter({
    schema,
    // (You might want to comment it out for development purposes -- see Migrations documentation)
    //migrations,
    // (optional database name or file system path)
    // dbName: 'myapp',
    useWebWorker: false,
    useIncrementalIndexedDB: true,
    // (optional, but you should implement this method)
    onSetUpError: (error) => {
        console.error("db setup error", error);
        // Database failed to load -- offer the user to reload the app or log out
    },
    onQuotaExceededError: (error) => {
        console.error("quota error", error);
        // Browser ran out of disk space -- offer the user to reload the app or log out
    },
    extraIncrementalIDBOptions: {
        serializeChunk: (_, chunk) => chunk,
        deserializeChunk: (_, chunk) => chunk,
        onDidOverwrite: () => {
            // Called when this adapter is forced to overwrite contents of IndexedDB.
            // This happens if there's another open tab of the same app that's making changes.
            // Try to synchronize the app now, and if user is offline, alert them that if they close this
            // tab, some data may be lost
            console.error("db overwritten");
        },
        onversionchange: () => {
            // database was deleted in another browser tab (user logged out), so we must make sure we delete
            // it in this tab as well - usually best to just refresh the page
            //   if (checkIfUserIsLoggedIn()) {
            //     window.location.reload()
            //   }
            console.error("db version change");
        },
    },
});
