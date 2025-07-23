declare namespace _default {
    export { state };
    export { getters };
    export { mutations };
    export { actions };
}
export default _default;
declare namespace state {
    let Locations: any[];
    let Equipment: any[];
    let Points: any[];
    let Properties: any[];
    let Labels: {};
    let Tags: any[];
}
declare namespace getters {
    function semanticClasses(state: any): any;
}
declare namespace mutations {
    function setSemantics(state: any, { tags }: {
        tags: any;
    }): void;
}
declare namespace actions {
    function loadSemantics(context: any): any;
}
