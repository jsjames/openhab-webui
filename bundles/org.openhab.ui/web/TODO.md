TODO

- [] HIGH - production build scripts
- [] HIGH - no babel support - is this needed moving forward?
- [] HIGH - dynamic imports for i18n, node_modules needs to be looked at
- [] HIGH - vuetrend does not support vue 3 - need to find alternative or update vuetrend
- [] HIGH - Cypress - haven't even looked at this or testing yet
- [] HIGH - Codemirror - to upgrade to vue3 reqires Codemirror v6 which architecturally is different
- [] MED - do we still need cross-env? - import.meta.env.PROD and DEV are automatically set. for blockly SOURCE_MAPS=1 would need solution
- [] MED - Blockly test/update? Haven't looked at yet.
- [] MED - enable strict for typescript - currently typescript is supported, but with lose settings
- [] MED - Websocket proxy through vite (Developer Tools/Log Viewer) not working
- [] LOW - Update storage from vuex to pinia

BUGS

- [] bars theme-filled applied to app class, but does not change navbar style
- [] vue3-masonry-css is buggy especially when you change the window width??

CONFLICT (content): Merge conflict in bundles/org.openhab.ui/web/src/pages/settings/transformations/transformations-list.vue
Auto-merging bundles/org.openhab.ui/web/src/pages/settings/transformations/transformation-edit.vue
CONFLICT (content): Merge conflict in bundles/org.openhab.ui/web/src/pages/settings/transformations/transformation-edit.vue
Auto-merging bundles/org.openhab.ui/web/src/pages/settings/rules/rules-list.vue
CONFLICT (content): Merge conflict in bundles/org.openhab.ui/web/src/pages/settings/rules/rules-list.vue
Auto-merging bundles/org.openhab.ui/web/src/pages/settings/rules/rule-edit.vue
CONFLICT (content): Merge conflict in bundles/org.openhab.ui/web/src/pages/settings/rules/rule-edit.vue
Auto-merging bundles/org.openhab.ui/web/src/pages/settings/model/model.vue
CONFLICT (content): Merge conflict in bundles/org.openhab.ui/web/src/pages/settings/model/model.vue
Auto-merging bundles/org.openhab.ui/web/src/pages/settings/model/add-from-thing.vue
CONFLICT (content): Merge conflict in bundles/org.openhab.ui/web/src/pages/settings/model/add-from-thing.vue
Auto-merging bundles/org.openhab.ui/web/src/pages/settings/items/item-details.vue
CONFLICT (content): Merge conflict in bundles/org.openhab.ui/web/src/pages/settings/items/item-details.vue
Auto-merging bundles/org.openhab.ui/web/src/pages/developer/developer-tools.vue
CONFLICT (content): Merge conflict in bundles/org.openhab.ui/web/src/pages/developer/developer-tools.vue
Auto-merging bundles/org.openhab.ui/web/src/js/store/modules/semantics.js
CONFLICT (content): Merge conflict in bundles/org.openhab.ui/web/src/js/store/modules/semantics.js
Auto-merging bundles/org.openhab.ui/web/src/js/routes.js
Auto-merging bundles/org.openhab.ui/web/src/components/widgets/system/oh-icon.vue
CONFLICT (content): Merge conflict in bundles/org.openhab.ui/web/src/components/widgets/system/oh-icon.vue
Auto-merging bundles/org.openhab.ui/web/src/components/thing/channel-list.vue
CONFLICT (content): Merge conflict in bundles/org.openhab.ui/web/src/components/thing/channel-list.vue
Auto-merging bundles/org.openhab.ui/web/src/components/tags/tag-mixin.js
CONFLICT (content): Merge conflict in bundles/org.openhab.ui/web/src/components/tags/tag-mixin.js
Auto-merging bundles/org.openhab.ui/web/src/components/tags/semantics-picker.vue
CONFLICT (content): Merge conflict in bundles/org.openhab.ui/web/src/components/tags/semantics-picker.vue
Auto-merging bundles/org.openhab.ui/web/src/components/rule/rule-status-mixin.js
CONFLICT (content): Merge conflict in bundles/org.openhab.ui/web/src/components/rule/rule-status-mixin.js
Auto-merging bundles/org.openhab.ui/web/src/components/item/item-form.vue
CONFLICT (content): Merge conflict in bundles/org.openhab.ui/web/src/components/item/item-form.vue
Auto-merging bundles/org.openhab.ui/web/src/components/config/controls/item-picker.vue
CONFLICT (content): Merge conflict in bundles/org.openhab.ui/web/src/components/config/controls/item-picker.vue
Auto-merging bundles/org.openhab.ui/web/src/components/config/config-parameter.vue
CONFLICT (content): Merge conflict in bundles/org.openhab.ui/web/src/components/config/config-parameter.vue
