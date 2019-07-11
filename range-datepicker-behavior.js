import format from 'date-fns/esm/format';
// import en from 'date-fns/esm/locale/en';
//
// const locales = { en, fr };

/**
 * `range-datepicker-behavior`
 *
 */

/* eslint no-unused-vars: off */

/* @polymerMixin */
export default subclass => class extends subclass {
  _localeChanged(locale) {
    if (!this.month) {
      this.month = format(new Date(), 'MM', { awareOfUnicodeTokens: true });
    }
    if (!this.year) {
      this.year = format(new Date(), 'yyyy');
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
      const monthPlus = `0${((month % 12) + 1)}`;
      this._monthPlus = monthPlus.substring(monthPlus.length - 2);
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
