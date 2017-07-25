class RangeDatepickerCell extends Polymer.Element {
  static get is() {
    return 'range-datepicker-cell';
  }
  static get properties() {
    return {
      day: Object,
      _selected: {
        type: Boolean,
        value: false,
      },
      _hovered: {
        type: Boolean,
        value: false,
      },
      dateTo: Number,
      dateFrom: Number,
      month: String,
      hoveredDate: Number,
    };
  }

  ready() {
    super.ready();
    this.addEventListener('click', this._handleTap);
    this.addEventListener('mouseover', this._handleHover);
  }

  static get observers() {
    return ['_dateChanged(dateFrom, dateTo, hoveredDate, day)'];
  }

  _dateChanged(dateFrom, dateTo, hoveredDate, day) {
    this._selected = false;
    this._hovered = false;
    if (day) {
      if (dateTo === day.date || dateFrom === day.date) {
        this._selected = true;
      }
      if (
        ((hoveredDate === day.date || day.date < hoveredDate) &&
          day.date > dateFrom &&
          !dateTo &&
          !this._selected) ||
        (day.date > dateFrom && day.date < dateTo)
      ) {
        this._hovered = true;
      }
    }
  }

  _handleTap() {
    this.dispatchEvent(new CustomEvent('date-is-selected', { detail: { date: this.day.date } }));
  }

  _handleHover() {
    this.dispatchEvent(new CustomEvent('date-is-hovered', { detail: { date: this.day.date } }));
  }

  _isSelected(selected) {
    if (selected) {
      return 'selected';
    }
    return '';
  }

  _isHovered(hovered) {
    if (hovered) {
      return 'hovered';
    }
    return '';
  }
}

window.customElements.define(RangeDatepickerCell.is, RangeDatepickerCell);
