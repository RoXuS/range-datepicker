import { PolymerElement } from '@polymer/polymer/polymer-element';
import { html } from '@polymer/polymer/lib/utils/html-tag';
import '@polymer/iron-flex-layout/iron-flex-layout-classes';

import RangeDatepickerBehavior from './range-datepicker-behavior';
import './range-datepicker-calendar';

/* global RangeDatepickerBehavior */
/**
 * `range-datepicker`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class RangeDatepicker extends RangeDatepickerBehavior(PolymerElement) {
  static get template() {
    return html`
    <style include="iron-flex iron-flex-alignment">
      :host {
        display: block;
      }

      #firstDatePicker {
        margin-right: 16px;
      }
    </style>

    <iron-media-query query="(max-width: 650px)" query-matches="{{narrow}}"></iron-media-query>

    <dom-if if="[[!forceNarrow]]">
      <template>
        <dom-if if="[[!narrow]]">
          <template>
            <div class="layout vertical center-justified">
              <div class="layout horizontal">
                <range-datepicker-calendar disabled-days="[[disabledDays]]" min="[[min]]" max="[[max]]" on-new-year-is-manually-selected="_handleNewYearSelected" enable-year-change="[[enableYearChange]]" prev="" no-range="[[noRange]]" on-prev-month="_handlePrevMonth" hovered-date="{{_hoveredDate}}" date-to="{{dateTo}}" date-from="{{dateFrom}}" id="firstDatePicker" locale="[[locale]]" month="[[month]]" year="[[year]]">
                </range-datepicker-calendar>
                <range-datepicker-calendar disabled-days="[[disabledDays]]" min="[[min]]" max="[[max]]" on-new-year-is-manually-selected="_handleNewYearSelected" enable-year-change="[[enableYearChange]]" next="" no-range="[[noRange]]" on-next-month="_handleNextMonth" hovered-date="{{_hoveredDate}}" date-to="{{dateTo}}" date-from="{{dateFrom}}" locale="[[locale]]" month="[[_monthPlus]]" year="[[_yearPlus]]">
                </range-datepicker-calendar>
              </div>
            </div>
          </template>
        </dom-if>
      </template>
    </dom-if>
    <dom-if if="[[_isNarrow(forceNarrow, narrow)]]">
      <template>
        <range-datepicker-calendar disabled-days="[[disabledDays]]" min="[[min]]" max="[[max]]" on-new-year-is-manually-selected="_handleNewYearSelected" enable-year-change="[[enableYearChange]]" no-range="[[noRange]]" narrow="[[_isNarrow(forceNarrow, narrow)]]" hovered-date="{{_hoveredDate}}" date-to="{{dateTo}}" date-from="{{dateFrom}}" locale="[[locale]]" prev="" next="" month="[[month]]" year="[[year]]">
        </range-datepicker-calendar>
      </template>
    </dom-if>
`;
  }

  static get is() {
    return 'range-datepicker';
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
      },
      /**
       * Date to.
       * Format is Unix timestamp.
       */
      dateTo: {
        type: String,
        notify: true,
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
    };
  }

  static get observers() {
    return ['_monthChanged(month, year)'];
  }
}

window.customElements.define(RangeDatepicker.is, RangeDatepicker);
