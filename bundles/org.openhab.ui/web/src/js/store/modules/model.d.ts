declare namespace _default {
    export { state }
    export { getters }
    export { mutations }
    export { actions }
}
export default _default
declare namespace state {
    let semanticModel: any
    let error: any
}
declare namespace getters {
    export function semanticModel_1(state: any): any;
    export { semanticModel_1 as semanticModel }
    export function semanticModelElement(state: any): (key: any, type: any) => any;
}
declare namespace mutations {
    function setSemanticModel(state: any, model: any): void;
    function setError(state: any, error: any): void;
}
declare namespace actions {
    function loadSemanticModel(context: any): void;
}
