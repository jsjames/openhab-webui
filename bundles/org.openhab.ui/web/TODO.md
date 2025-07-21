TODO

- [] HIGH - production build scripts and reporting
- [] HIGH - no babel support - is this needed moving forward? - Vite has built-in support for this
- [x] HIGH - dynamic imports for i18n, node_modules needs to be looked at - currently hacked to get running
- [x] HIGH - vuetrend does not support vue 3 - vue3trend does exist
- [] HIGH - Cypress - haven't even looked at this or testing yet
- [] HIGH - Swiper-slide needs to be retrofited with new (https://v6.framework7.io/vue/migration-from-v5#swiper)
- [] HIGH - decide on prettier or other formatter? which rules (currently I just have used default rules)
- [] HIGH - TODO-V3 comments in code need to be cleaned up / examined
- [] HIGH - vuex reactive items are not getting updated
- [x] HIGH - add support for Codemirror v6
- [] MED - Codemirror - codemirror is basically in place, but many of the addon features need to be added
- [] MED - Blockly test/update? Haven't looked at yet.
- [x] MED - enable strict for typescript - done, required for building
- [] MED - Websocket proxy through vite (Developer Tools/Log Viewer) not working
- [] LOW - Update storage from vuex to pinia

BUGS

- [x] bars theme-filled applied to app class, but does not change navbar style. It seems in vue3 (contrary to documentation that I can find), that f7-app classes will not be applied. So, added code to add to the html element at the top.
- [] vue3-masonry-css is buggy especially when you change the window width??
- [] There are two home pages created in the DOM under the view? Removing the "stacked" setting addresses this, but that breaks other things.
- [] on item-detail->oh-label-card->oh-trend - the width setting is only correct AFTER the page is display - doesn't seem to be reactive
- [] back button on settings/items/item-details does not work
- [] farci i18n file under setup-wizard causes vite json error

NOTES

- scope-css - had to update save a local implementation and convert to imports vs. require (any licensing issues??)
