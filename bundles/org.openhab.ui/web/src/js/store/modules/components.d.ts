declare namespace _default {
    export { state };
    export { getters };
    export { mutations };
}
export default _default;
declare namespace state {
    let widgets: any[];
    let pages: any[];
}
declare namespace getters {
    export function widget(state: any): (uid: any) => any;
    export function widgets_1(state: any): any[];
    export { widgets_1 as widgets };
    export function page(state: any): (uid: any) => any;
    export function pages_1(state: any): any[];
    export { pages_1 as pages };
}
declare namespace mutations {
    function setWidgets(state: any, { widgets }: {
        widgets: any;
    }): void;
    function setPages(state: any, { pages }: {
        pages: any;
    }): void;
}
