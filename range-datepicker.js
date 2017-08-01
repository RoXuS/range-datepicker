/**
 * `range-datepicker`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class RangeDatepicker extends Polymer.Element {
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

  _localeChanged(locale) {
    if (!this.month) {
      this.month = moment().locale(locale).format('MM');
    }
    if (!this.year) {
      this.year = moment().locale(locale).format('YYYY');
    }
  }

  _handlePrevMonth() {
    if (!this.enableYearChange) {
      this.shadowRoot.querySelector('range-datepicker-calendar[next]')._handlePrevMonth();
    }
  }

  _handleNextMonth() {
    if (!this.enableYearChange) {
      this.shadowRoot.querySelector('range-datepicker-calendar[prev]')._handleNextMonth();
    }
  }

  _monthChanged(month, year) {
    if (year && month) {
      this._monthPlus = moment(month, 'MM').locale(this.locale).add(1, 'month').format('MM');
      if (this._monthPlus === '01') {
        this._yearPlus = parseInt(year, 10) + 1;
      } else {
        this._yearPlus = parseInt(year, 10);
      }
    }
  }

  _isNarrow(forceNarrow, narrow) {
    if (forceNarrow || narrow) {
      return true;
    }
    return false;
  }

  _noRangeChanged(isNoRange, wasNoRange) {
    if (!wasNoRange && isNoRange) {
      this.dateTo = undefined;
      this._hoveredDate = undefined;
    }
  }
}

window.customElements.define(RangeDatepicker.is, RangeDatepicker);
