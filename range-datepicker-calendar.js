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
      year: {
        type: String,
        notify: true,
      },
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
      _yearsList: {
        type: Array,
        value: [],
      },
      enableYearChange: {
        type: Boolean,
        value: false,
        observer: '_enableYearChangeChanged',
      },
      min: Number,
      max: Number,
      disabledDays: Array,
    };
  }

  _localeChanged() {
    if (moment.localeData(this.locale)) {
      const dayNamesOfTheWeek = moment.localeData(this.locale).weekdaysMin();
      const firstDayOfWeek = moment.localeData(this.locale).firstDayOfWeek();
      const tmp = dayNamesOfTheWeek.slice().splice(0, firstDayOfWeek);
      const newDayNamesOfTheWeek = dayNamesOfTheWeek
        .slice()
        .splice(firstDayOfWeek, dayNamesOfTheWeek.length)
        .concat(tmp);
      this.set('_dayNamesOfTheWeek', newDayNamesOfTheWeek);
    }
  }

  static get observers() {
    return ['_yearAndMonthChanged(year, month)'];
  }

  _yearAndMonthChanged(year, month) {
    if (year && month) {
      const startDate = moment([year, month - 1]).locale(this.locale);
      const endDate = moment(startDate)
        .locale(this.locale)
        .endOf('month');

      const rows = [];
      let columns = [];

      const lastDayOfWeek = 6;

      while (startDate.format('DD/MM/YYYY') !== endDate.format('DD/MM/YYYY')) {
        const dayNumber = startDate.weekday();

        columns.push({
          hover: false,
          date: parseInt(startDate.format('X'), 10),
          title: parseInt(startDate.format('D'), 10),
        });

        if (dayNumber === lastDayOfWeek) {
          for (let i = columns.length; i < lastDayOfWeek + 1; i += 1) {
            columns.unshift(0);
          }
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
          for (let i = columns.length; i <= lastDayOfWeek; i += 1) {
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
    return moment(`${month}/${year}`, 'MM/YYYY')
      .locale(this.locale)
      .format('MMMM');
  }

  _tdIsEnabled(day) {
    if (day) {
      return 'enabled';
    }
    return '';
  }

  _handleDateSelected({ detail }) {
    const { date } = detail;
    if (!this.noRange) {
      if (this.dateFrom && this.dateTo) {
        this.dateFrom = date;
        this.dateTo = null;
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
    const tbody = this.shadowRoot.querySelector('.tbody');
    const monthName = this.shadowRoot.querySelector('.monthName > div');
    tbody.classList.add('withTransition');
    tbody.classList.add('moveToLeft');
    monthName.classList.add('withTransition');
    monthName.classList.add('moveToLeft');

    this.month = moment(this.month, 'MM')
      .locale(this.locale)
      .add(1, 'month')
      .format('MM');
    if (this.month === '01') {
      this.year = moment(this.year, 'YYYY')
        .locale(this.locale)
        .add(1, 'year')
        .format('YYYY');
    }
    this.dispatchEvent(new CustomEvent('next-month'));

    setTimeout(() => {
      tbody.classList.remove('withTransition');
      tbody.classList.add('moveToRight');
      tbody.classList.remove('moveToLeft');
      monthName.classList.remove('withTransition');
      monthName.classList.add('moveToRight');
      monthName.classList.remove('moveToLeft');

      setTimeout(() => {
        tbody.classList.add('withTransition');
        tbody.classList.remove('moveToRight');
        monthName.classList.add('withTransition');
        monthName.classList.remove('moveToRight');
        setTimeout(() => {
          tbody.classList.remove('withTransition');
          monthName.classList.remove('withTransition');
        }, 100);
      }, 100);
    }, 100);
  }

  _handlePrevMonth() {
    const tbody = this.shadowRoot.querySelector('.tbody');
    const monthName = this.shadowRoot.querySelector('.monthName > div');
    tbody.classList.add('withTransition');
    tbody.classList.add('moveToRight');
    monthName.classList.add('withTransition');
    monthName.classList.add('moveToRight');

    this.month = moment(this.month, 'MM')
      .locale(this.locale)
      .subtract(1, 'month')
      .format('MM');
    if (this.month === '12') {
      this.year = moment(this.year, 'YYYY')
        .locale(this.locale)
        .subtract(1, 'year')
        .format('YYYY');
    }
    this.dispatchEvent(new CustomEvent('prev-month'));

    setTimeout(() => {
      tbody.classList.remove('withTransition');
      tbody.classList.add('moveToLeft');
      tbody.classList.remove('moveToRight');
      monthName.classList.remove('withTransition');
      monthName.classList.add('moveToLeft');
      monthName.classList.remove('moveToRight');

      setTimeout(() => {
        tbody.classList.add('withTransition');
        tbody.classList.remove('moveToLeft');
        monthName.classList.add('withTransition');
        monthName.classList.remove('moveToLeft');
        setTimeout(() => {
          monthName.classList.remove('withTransition');
          monthName.classList.remove('withTransition');
        }, 100);
      }, 100);
    }, 100);
  }

  _ifNarrow(pos, narrow) {
    if (pos || narrow) {
      return true;
    }
    return false;
  }

  ready() {
    super.ready();
    const yearsList = [];
    for (let i = 1970; i <= 2100; i += 1) {
      yearsList.push(i);
    }
    this.set('_yearsList', yearsList);
  }

  _enableYearChangeChanged(enableYearChange) {
    this.narrow = enableYearChange;
  }
}

window.customElements.define(RangeDatepickerCalendar.is, RangeDatepickerCalendar);
