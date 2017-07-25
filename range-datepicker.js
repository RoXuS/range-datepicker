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
    moment.locale(locale);
  }

  _handlePrevMonth() {
    this.shadowRoot.querySelector('range-datepicker-calendar[next]')._handlePrevMonth();
  }

  _handleNextMonth() {
    this.shadowRoot.querySelector('range-datepicker-calendar[prev]')._handleNextMonth();
  }

  ready() {
    super.ready();
    this.month = moment().format('MM');
    this.year = moment().format('YYYY');
  }

  _monthChanged(month) {
    this._monthPlus = moment(month, 'MM').add(1, 'month').format('MM');
  }

  _isNarrow(forceNarrow, narrow) {
    if (forceNarrow || narrow) {
      return true;
    }
    return false;
  }
}

window.customElements.define(RangeDatepicker.is, RangeDatepicker);
