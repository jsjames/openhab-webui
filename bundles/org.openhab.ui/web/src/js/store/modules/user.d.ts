declare namespace _default {
    export { state };
    export { getters };
    export { mutations };
}
export default _default;
declare namespace state {
    let user: any;
    let noAuth: boolean;
}
declare namespace getters {
    export function user_1(state: any): any;
    export { user_1 as user };
    export function noAuth_1(state: any): any;
    export { noAuth_1 as noAuth };
    export function isAdmin(state: any): any;
}
declare namespace mutations {
    function setUser(state: any, { user }: {
        user: any;
    }): void;
    function setNoAuth(state: any, value: any): void;
}
