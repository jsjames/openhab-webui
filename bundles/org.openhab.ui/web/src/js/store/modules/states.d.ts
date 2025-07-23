declare namespace _default {
    export { state };
    export { getters };
    export { actions };
    export { mutations };
}
export default _default;
declare namespace state {
    let trackingList: any[];
    let itemStates: {};
    let trackerConnectionId: any;
    let trackerEventSource: any;
    let pendingTrackingListUpdate: boolean;
    let keepConnectionOpen: boolean;
    let sseConnected: boolean;
}
declare namespace getters {
    function trackedItems(state: any): any;
    function isItemTracked(state: any): (itemName: any) => boolean;
}
declare namespace actions {
    function initializeTrackingStore(context: any): void;
    function startTrackingStates(context: any): void;
    function stopTrackingStates(context: any): void;
    function updateTrackingList(context: any, payload: any): void;
    function sendCommand(context: any, { itemName, cmd, updateState }: {
        itemName: any;
        cmd: any;
        updateState: any;
    }): any;
}
declare namespace mutations {
    function addToTrackingList(state: any, itemName: any): void;
    function setTrackingEventSource(state: any, payload: any): void;
    function setTrackerConnectionId(state: any, payload: any): void;
    function setTrackingList(state: any, payload: any): void;
    function clearTrackingList(state: any, payload: any): void;
    function keepConnectionOpen(state: any, value: any): void;
    function sseConnected(state: any, value: any): void;
    function setItemState(state: any, { itemName, itemState }: {
        itemName: any;
        itemState: any;
    }): void;
    function setPendingTrackingListUpdate(state: any, payload: any): void;
    function clearStateTracker(state: any): void;
}
