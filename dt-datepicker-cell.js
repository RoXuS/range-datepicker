class DtDatePickerCell extends Polymer.Element {
  static get is() { return 'dt-datepicker-cell'; }
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
    return [
      '_dateChanged(dateFrom, dateTo, hoveredDate, day)',
    ];
  }

  _dateChanged(dateFrom, dateTo, hoveredDate, day) {
    console.log('ici')
    this._selected = false;
    this._hovered = false;
    if (dateTo === day.date || dateFrom === day.date) {
      this._selected = true;
    }
    if (((hoveredDate === day.date || day.date < hoveredDate) && day.date > dateFrom && !dateTo && !this._selected) || (day.date > dateFrom && day.date < dateTo)) {
      this._hovered = true;
    }


    // if (!(dateTo && dateFrom)) {
    //   this._hovered = false;
    // }
    // this._selected = false;
    // if (dateTo === this.day.date || dateFrom === this.day.date) {
    //   this._selected = true;
    // }
    // if (dateFrom && hoveredDate && this.day.date && !(dateTo && dateFrom)) {
    //   if ((hoveredDate === this.day.date || this.day.date < hoveredDate) && this.day.date > dateFrom && !this._selected) {
    //     this._hovered = true;
    //   }
    // }
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

window.customElements.define(DtDatePickerCell.is, DtDatePickerCell);