import { PolymerElement } from '@polymer/polymer/polymer-element';
import { html } from '@polymer/polymer/lib/utils/html-tag';
import { LegacyElementMixin } from '@polymer/polymer/lib/legacy/legacy-element-mixin';
import { templatize } from '@polymer/polymer/lib/utils/templatize';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom';
import { format, parse } from 'date-fns/esm';
import { enGB, fr } from 'date-fns/esm/locale/index';
import '@polymer/paper-material/paper-material';
import '@polymer/iron-flex-layout/iron-flex-layout-classes';
import './range-datepicker-calendar';
import RangeDatepickerBehavior from './range-datepicker-behavior';

const locales = { en: enGB, fr };

class RangeDatepickerInput extends
  RangeDatepickerBehavior(LegacyElementMixin(PolymerElement)) {
  static get is() {
    return 'range-datepicker-input';
  }

  static get properties() {
    return {
      /**
       * If setted only one date can be selected.
       */
      noRange: {
        type: Boolean,
        value: false,
        observer: '_noRangeChanged',
      },
      /**
       * Force display one month.
       */
      forceNarrow: {
        type: Boolean,
        value: false,
      },
      /**
       * If true, only one month is displayed.
       */
      narrow: {
        type: Boolean,
        value: false,
        notify: true,
      },
      /**
       * Set locale of the calendar.
       * Default is 'en'.
       */
      locale: {
        type: String,
        value: 'en',
        observer: '_localeChanged',
      },
      /**
       * Set month.
       * Format is MM (example: 07 for July, 12 for january).
       * Default is current month.
       */
      month: String,
      _monthPlus: String,
      _yearPlus: Number,
      /**
       * Set year.
       * Default is current year.
       */
      year: String,
      /**
       * Date from.
       * Format is Unix timestamp.
       */
      dateFrom: {
        type: String,
        notify: true,
        observer: '_dateFromChanged',
        value: () => null,
      },
      /**
       * Date to.
       * Format is Unix timestamp.
       */
      dateTo: {
        type: String,
        notify: true,
        observer: '_dateToChanged',
        value: () => null,
      },
      /**
       * Current hovered date.
       * Format is Unix timestamp.
       */
      _hoveredDate: String,
      enableYearChange: {
        type: Boolean,
        value: false,
      },
      /**
       * Minimal date.
       * Format is Unix timestamp.
       */
      min: Number,
      /**
       * Maximal date.
       * Format is Unix timestamp.
       */
      max: Number,
      /**
       * Array of disabled days.
       * Format is Unix timestamp.
       */
      disabledDays: Array,

      /**
       * Format of the date.
       * Default is dd/MM/yyyy.
       */
      dateFormat: {
        type: String,
        value: 'dd/MM/yyyy',
      },
      /**
       * The orientation against which to align the dropdown content
       * horizontally relative to the dropdown trigger.
       */
      horizontalAlign: {
        type: String,
        value: 'left',
      },
      verticalAlign: {
        type: String,
        value: 'top',
      },
      _isNarrow: Function,
      _parentTemplate: {
        type: Element,
        value: () => null,
      },
      ctor: {
        type: Function,
        value: () => null,
      },
      instances: {
        type: Array,
        value: () => [],
      },
      instance: {
        type: Object,
        value: () => { },
      },
      dropdownPosition: {
        type: String,
        value: 'fixed',
      },
      verticalOffset: {
        type: Number,
        value: 0,
      },
    };
  }

  static get template() {
    return html`
      <style include="iron-flex iron-flex-alignment">
        :host {
          display: block;
        }

        #firstDatePicker {
          margin-right: 16px;
        }

        iron-dropdown {
          background: white;
        }

        paper-material {
          padding: 16px;
          display: block;
        }
      </style>
      <iron-media-query query="(max-width: 650px)" query-matches="{{narrow}}"></iron-media-query>
        <div id="trigger" on-tap="_handleOpenDropdown">
          <slot></slot>
        </div>

        <iron-dropdown no-overlap allow-outside-scroll vertical-align="[[verticalAlign]]" horizontal-align="[[horizontalAlign]]">
          <paper-material slot="dropdown-content">
            <dom-if if="[[!forceNarrow]]">
              <template>
                <dom-if if="[[!narrow]]">
                  <template>
                    <div class="layout vertical center-justified">
                      <div class="layout horizontal">
                        <range-datepicker-calendar disabled-days="[[disabledDays]]" min="[[min]]" max="[[max]]" on-new-year-is-manually-selected="_handleNewYearSelected"
                          enable-year-change="[[enableYearChange]]" prev no-range="[[noRange]]" on-prev-month="_handlePrevMonth"
                          hovered-date="{{_hoveredDate}}" date-to="{{dateTo}}" date-from="{{dateFrom}}" id="firstDatePicker"
                          locale="[[locale]]" month="[[month]]" year="[[year]]">
                        </range-datepicker-calendar>
                        <range-datepicker-calendar disabled-days="[[disabledDays]]" min="[[min]]" max="[[max]]" on-new-year-is-manually-selected="_handleNewYearSelected"
                          enable-year-change="[[enableYearChange]]" next no-range="[[noRange]]" on-next-month="_handleNextMonth"
                          hovered-date="{{_hoveredDate}}" date-to="{{dateTo}}" date-from="{{dateFrom}}" locale="[[locale]]"
                          month="[[_monthPlus]]" year="[[_yearPlus]]">
                        </range-datepicker-calendar>
                      </div>
                    </div>
                  </template>
                </dom-if>
              </template>
            </dom-if>
            <dom-if if="[[_isNarrow(forceNarrow, narrow)]]">
              <template>
                <range-datepicker-calendar disabled-days="[[disabledDays]]" min="[[min]]" max="[[max]]" enable-year-change="[[enableYearChange]]"
                  narrow="[[_isNarrow(forceNarrow, narrow)]]" hovered-date="{{_hoveredDate}}" date-to="{{dateTo}}"
                  date-from="{{dateFrom}}" locale="[[locale]]" month="[[month]]" year="[[year]]" no-range="[[noRange]]"
                  next prev>
                </range-datepicker-calendar>
              </template>
            </dom-if>
          </paper-material>
        </iron-dropdown>`;
  }

  static get observers() {
    return ['_monthChanged(month, year)'];
  }

  ready() {
    super.ready();
    if (this.dropdownPosition === 'absolute') {
      this._setAbsolutePositioning();
    }
  }

  _setAbsolutePositioning(e) {
    const ironDropdownEl = this.shadowRoot.querySelector('iron-dropdown');
    ironDropdownEl.resetFit();
    ironDropdownEl.style.position = 'absolute';
    ironDropdownEl.style.top = this.verticalOffset;
    ironDropdownEl.style.left = '0';
    ironDropdownEl.fit();
  }

  _handleOpenDropdown() {
    this.shadowRoot.querySelector('iron-dropdown').open();
  }

  closeDropdown() {
    this.shadowRoot.querySelector('iron-dropdown').close();
  }

  _formatDate(date) {
    if (date) {
      const dateFn = parse(date, 't', new Date());
      return format(dateFn, this.dateFormat, { locale: locales[this.locale], awareOfUnicodeTokens: true });
    }
    return '';
  }

  _dateFromChanged(date) {
    if (this.instance) {
      if (this.noRange && date) {
        this.shadowRoot.querySelector('iron-dropdown').close();
      }
      this.instance.dateFrom = this._formatDate(this.dateFrom);
    }
  }

  _dateToChanged(date) {
    if (this.instance) {
      if (date) {
        this.shadowRoot.querySelector('iron-dropdown').close();
      }
      this.instance.dateTo = this._formatDate(this.dateTo);
      this.instance.dateFrom = this._formatDate(this.dateFrom);
    }
  }

  connectedCallback() {
    if (!this.ctor) {
      const props = {
        __key__: true,
        [this.dateTo]: true,
        [this.dateFrom]: true,
        dateTo: true,
        dateFrom: true,
      };
      this._parentTemplate = this.queryEffectiveChildren('template');
      this.ctor = templatize(this._parentTemplate, this, {
        instanceProps: props,
        forwardHostProp(prop, value) {
          this.instances.forEach((inst) => {
            inst.forwardHostProp(prop, value);
          });
        },
      });
      this._ensureTemplatized();
    }
  }

  _ensureTemplatized() {
    this.instance = new this.ctor({ dateTo: '', dateFrom: '' });
    this.instances.push(this.instance);
    this._itemsParent.appendChild(this.instance.root);

    const dateFrom = this.dateFrom ? this._formatDate(this.dateFrom) : '';
    const dateTo = this.dateTo ? this._formatDate(this.dateTo) : '';
    if (dateFrom) {
      this.instance.dateFrom = dateFrom;
    }
    if (dateTo) {
      this.instance.dateTo = dateTo;
    }
  }

  get _itemsParent() {
    return dom(dom(this._parentTemplate).parentNode);
  }
}

window.customElements.define(RangeDatepickerInput.is, RangeDatepickerInput);
