declare namespace _default {
    function connect(path: any, topics: any, messageCallback: any, errorCallback: any, heartbeatCallback: any): any;
    function connectStateTracker(path: any, readyCallback: any, updateCallback: any, errorCallback: any, heartbeatCallback: any): any;
    function close(client: any, callback: any): void;
}
export default _default;
