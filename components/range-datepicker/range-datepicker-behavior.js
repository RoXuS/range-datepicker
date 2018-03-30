/**
 * `range-datepicker-behavior`
 *
 */

/* eslint no-unused-vars: off */

/* @polymerMixin */
const RangeDatepickerBehavior = subclass =>
  class extends subclass {
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
  };
