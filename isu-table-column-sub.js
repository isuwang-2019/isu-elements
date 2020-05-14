/**


 */

import {PolymerElement} from "@polymer/polymer";
import {FlattenedNodesObserver} from "@polymer/polymer/lib/utils/flattened-nodes-observer";
import {Templatizer} from '@polymer/polymer/lib/legacy/templatizer-behavior.js';
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";

/**
 * `isu-grid`
 *
 * Example:
 * ```html
 * <isu-table-column-sub model-as="user">
 *   <template>
 *    <div class="ext-container">
 *    <div>姓名：[[user.name]]</div>
 *    <div>sex: [[user.sex]]</div>
 *    <div>phone: [[user.phone]]</div>
 *    </div>
 *   </template>
 * </isu-table-column-sub>
 *
 * ```
 * @customElement
 * @polymer
 * @demo demo/isu-table-column/index.html
 */
class IsuTableColumn extends mixinBehaviors([Templatizer], PolymerElement) {
    static get template() {
        return null;
    }

    static get properties() {
        return {
            /**
             *The key whose value needs to be displayed in the td. eg: 'sex'
             *
             * @type {string}
             */
            prop: {
                type: String
            },
            /**
             *The keys whose values need to be displayed in the td. eg: 'sex,name'
             *
             * @type {string}
             */
            props: {
                type: String
            },
            /**
             *The separator when a column displays multiple fields
             *
             * @type {string}
             */
            separator: {
                type: String
            },

            tmpl: Object,

            modelAs: {
                type: String,
                value: 'item'
            }
        };
    }

    static get is() {
        return "isu-table-column-sub";
    }

    constructor() {
        super();
        this.tmpl = this._findTemplate().pop();

        if (this.tmpl) {
            // hack for template.__dataHost
            this.tmpl.__dataHost = this.parentElement;
            this._parentModel = {};
            this.templatize(this.tmpl);
        }
    }

    _findTemplate() {
        return FlattenedNodesObserver.getFlattenedNodes(this)
            .filter(node => node.localName === 'template');
    }

    stampTemplate(instanceProps, key = this.modelAs) {
        if (this.tmpl) return this.stamp({[key]: instanceProps, "global": this.tmpl.__dataHost.global});
        return null;
    }
}

window.customElements.define(IsuTableColumn.is, IsuTableColumn);
