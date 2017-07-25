/**
 * `range-datepicker-calendar`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class RangeDatepickerCalendar extends Polymer.Element {
  static get is() {
    return 'range-datepicker-calendar';
  }
  static get properties() {
    return {
      month: String,
      year: String,
      _dayNamesOfTheWeek: {
        type: Array,
        value: [],
      },
      _daysOfMonth: Array,
      locale: {
        type: String,
        value: 'en',
        observer: '_localeChanged',
      },
      dateTo: {
        type: Number,
        notify: true,
      },
      prev: Boolean,
      next: Boolean,
      dateFrom: {
        type: Number,
        notify: true,
      },
      hoveredDate: {
        type: Number,
        notify: true,
      },
      noRange: {
        type: Boolean,
        value: false,
      },
      narrow: {
        type: Boolean,
        value: false,
      },
    };
  }

  _localeChanged(locale) {
    moment.locale(locale);
  }

  static get observers() {
    return ['_yearAndMonthChanged(year, month)'];
  }

  ready() {
    super.ready();
    this.set('_dayNamesOfTheWeek', moment.weekdaysMin(true));
  }

  _yearAndMonthChanged(year, month) {
    if (year && month) {
      const startDate = moment([year, month - 1]);
      const endDate = moment(startDate).endOf('month');

      const rows = [];
      let columns = [];

      const firstDayOfWeek = moment.localeData().firstDayOfWeek();
      const lastDayOfWeek = 6 + moment.localeData().firstDayOfWeek();

      while (startDate.format('DD/MM/YYYY') !== endDate.format('DD/MM/YYYY')) {
        const dayNumber = startDate.isoWeekday();
        if (rows.length === 0 && columns.length === 0 && dayNumber !== firstDayOfWeek) {
          for (let i = firstDayOfWeek; i < dayNumber; i += 1) {
            columns.push(0);
          }
        }

        columns.push({
          hover: false,
          date: parseInt(startDate.format('X'), 10),
          title: parseInt(startDate.format('D'), 10),
        });

        if (dayNumber === lastDayOfWeek) {
          rows.push(columns.slice());
          columns = [];
        }

        startDate.add(1, 'day');

        if (startDate.format('DD/MM/YYYY') === endDate.format('DD/MM/YYYY')) {
          columns.push({
            hover: false,
            date: parseInt(startDate.format('X'), 10),
            title: parseInt(startDate.format('D'), 10),
          });
          for (let i = dayNumber % lastDayOfWeek; i < lastDayOfWeek - firstDayOfWeek; i += 1) {
            columns.push(0);
          }
          rows.push(columns.slice());
          columns = [];
        }
      }
      this.set('_daysOfMonth', rows);
    }
  }

  _computeCurrentMonthName(month, year) {
    return moment(`${month}/${year}`, 'MM/YYYY').format('MMMM YYYY');
  }

  _tdIsEnabled(day) {
    if (day) {
      return 'enabled';
    }
    return '';
  }

  _handleDateSelected(event) {
    const date = event.detail.date;
    if (!this.noRange) {
      if (this.dateFrom && this.dateTo) {
        this.dateFrom = date;
        this.dateTo = 0;
        this.hoveredDate = undefined;
      } else if (!this.dateFrom || (this.dateFrom && date < this.dateFrom)) {
        this.dateFrom = date;
      } else if (!this.dateTo || (this.dateTo && date > this.dateTo)) {
        this.dateTo = date;
      }
    } else {
      this.dateFrom = date;
    }
  }

  _handleDateHovered(event) {
    if (!this.noRange) {
      this.hoveredDate = event.detail.date;
    }
  }

  _handleNextMonth() {
    this.month = moment(this.month, 'MM').add(1, 'month').format('MM');
    this.dispatchEvent(new CustomEvent('next-month'));
  }

  _handlePrevMonth() {
    this.month = moment(this.month, 'MM').subtract(1, 'month').format('MM');
    this.dispatchEvent(new CustomEvent('prev-month'));
  }

  _ifNarrow(pos, narrow) {
    if (pos || narrow) {
      return true;
    }
    return false;
  }
}

window.customElements.define(RangeDatepickerCalendar.is, RangeDatepickerCalendar);
