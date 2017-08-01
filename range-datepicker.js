/* global RangeDatepickerBehavior */
/**
 * `range-datepicker`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class RangeDatepicker extends RangeDatepickerBehavior(Polymer.Element) {
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
