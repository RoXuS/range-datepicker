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
      month: {
        type: String,
        observer: '_monthChanged',
      },
      _monthPlus: String,
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
    };
  }

  _localeChanged(locale) {
    this.month = moment().locale(locale).format('MM');
    this.year = moment().locale(locale).format('YYYY');
  }

  _handlePrevMonth() {
    this.shadowRoot.querySelector('range-datepicker-calendar[next]')._handlePrevMonth();
  }

  _handleNextMonth() {
    this.shadowRoot.querySelector('range-datepicker-calendar[prev]')._handleNextMonth();
  }

  _monthChanged(month) {
    this._monthPlus = moment(month, 'MM').locale(this.locale).add(1, 'month').format('MM');
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
