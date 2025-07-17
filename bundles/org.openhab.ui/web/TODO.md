TODO

- [] HIGH - production build scripts and reporting
- [] HIGH - no babel support - is this needed moving forward?
- [] HIGH - dynamic imports for i18n, node_modules needs to be looked at - currently hacked to get running
- [] HIGH - vuetrend does not support vue 3 - need to find alternative or update vuetrend
- [] HIGH - Cypress - haven't even looked at this or testing yet
- [] HIGH - Codemirror - to upgrade to vue3 reqires Codemirror v6 which architecturally is different
- [] HIGH - Swiper-slide needs to be retrofited with new (https://v6.framework7.io/vue/migration-from-v5#swiper)
- [] HIGH - decide on prettier or other formatter? which rules (currently I just have default rules)
- [] HIGH - TODO-V3 comments in code need to be cleaned up / examined
- [] MED - do we still need cross-env in npm scripts (projects.json)? - import.meta.env.PROD and DEV are automatically set. for blockly SOURCE_MAPS=1 would need solution
- [] MED - Blockly test/update? Haven't looked at yet.
- [] MED - enable strict for typescript - currently typescript is supported, but with lose settings
- [] MED - Websocket proxy through vite (Developer Tools/Log Viewer) not working
- [] LOW - Update storage from vuex to pinia

BUGS

- [x] bars theme-filled applied to app class, but does not change navbar style. It seems in vue3 (contrary to documentation that I can find), that f7-app classes will not be applied. So, added code to add to the html element at the top.
- [] vue3-masonry-css is buggy especially when you change the window width??
- [] There are two home pages created in the DOM under the view?  Removing the "stacked" setting addresses this, but that breaks other things.

NOTES

- scope-css - had to update save local js file and convert to imports vs. require (any licensing issues??)
