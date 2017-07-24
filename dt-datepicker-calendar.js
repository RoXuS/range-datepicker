class DtDatepickerCalendar extends Polymer.Element {
  static get is() { return 'dt-datepicker-calendar'; }
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
      _dateTo: Number,
      _dateFrom: Number,
    };
  }

  _localeChanged(locale) {
    moment.locale(locale);
  }

  static get observers() {
    return [
      '_yearAndMonthChanged(year, month)',
    ]
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

        columns.push({ hover: false, date: parseInt(startDate.format('X'), 10), title: parseInt(startDate.format('D'), 10) });

        if (dayNumber === lastDayOfWeek) {
          rows.push(columns.slice());
          columns = [];
        }

        startDate.add(1, 'day');

        if (startDate.format('DD/MM/YYYY') === endDate.format('DD/MM/YYYY')) {
          columns.push({ hover: false, date: parseInt(startDate.format('X'), 10), title: parseInt(startDate.format('D'), 10) });
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
    return moment(`${month}/${year}`, 'MM/YYYY').format('MMMM YYYY')
  }

  _tdIsEnabled(day) {
    if (day) {
      return 'enabled';
    }
    return '';
  }

  _handleDateSelected(event) {
    const date = event.detail.date;
    if (this._dateFrom && this._dateTo) {
      this._dateFrom = date;
      this._dateTo = undefined;
    } else {
      if (!this._dateFrom || (this._dateFrom && date < this._dateFrom)) {
        this._dateFrom = date;
      } else if (!this._dateTo || (this._dateTo && date > this._dateTo)) {
        this._dateTo = date;
      }
    }
  }

  _handleDateHovered(event) {
    this._hoveredDate = event.detail.date;
  }

  _handleNextMonth() {
    this.month = moment(this.month, 'MM').add(1, 'month').format('MM');
  }

  _handlePrevMonth() {
    this.month = moment(this.month, 'MM').subtract(1, 'month').format('MM');
  }
}

window.customElements.define(DtDatepickerCalendar.is, DtDatepickerCalendar);