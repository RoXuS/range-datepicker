import { PolymerElement } from '@polymer/polymer/polymer-element';
import { html } from '@polymer/polymer/lib/utils/html-tag';
import '@polymer/iron-flex-layout/iron-flex-layout-classes';

class RangeDatepickerCell extends PolymerElement {
  static get template() {
    return html`
    <style include="iron-flex iron-flex-alignment">
      :host {
        @apply --paper-font-common-base;
        display: block;
        width: 38px;
      }

      div {
        text-align: center;
        height: 38px;
        width: 38px;
        margin: 0;
        padding: 0;
        color: var(--range-datepicker-cell-text);
      }

      div:not(.disabled):hover {
        background: var(--range-datepicker-cell-hover, #e4e7e7);
        cursor: pointer;
      }

      div.hovered {
        background: var(--range-datepicker-cell-hovered, rgba(0, 150, 136, 0.5)) !important;
        color: var(--range-datepicker-cell-hovered-text, white);
      }

      div.selected {
        background: var(--range-datepicker-cell-selected, rgb(0, 150, 136)) !important;
        color: var(--range-datepicker-cell-selected-text, white);
        ;
      }

      div.disabled {
        opacity: 0.4;
      }
    </style>

    <div on-click="_handleTap" on-mouseover="_handleHover" class\$="layout horizontal center center-justified [[_isSelected(_selected)]] [[_isHovered(_hovered)]] [[_isEnabled(day, min, max, disabledDays)]]">
      <template is="dom-if" if="[[day]]">
        [[day.title]]
      </template>
    </div>
`;
  }

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
      min: Number,
      max: Number,
      _disabled: {
        type: Boolean,
        value: false,
      },
      disabledDays: {
        type: Array,
        value: [],
      },
    };
  }

  static get observers() {
    return ['_dateChanged(dateFrom, dateTo, hoveredDate, day)'];
  }

  _dateChanged(dateFrom, dateTo, hoveredDate, day) {
    this._selected = false;
    this._hovered = false;
    const parsedDateFrom = parseInt(dateFrom, 10);
    const parsedDateTo = parseInt(dateTo, 10);
    if (day) {
      if (parsedDateTo === day.date || parsedDateFrom === day.date) {
        this._selected = true;
      }
      if (
        ((hoveredDate === day.date || day.date < hoveredDate)
          && day.date > parsedDateFrom
          && !parsedDateTo
          && !Number.isNaN(parsedDateFrom)
          && parsedDateFrom !== undefined
          && !this._selected)
        || (day.date > parsedDateFrom && day.date < parsedDateTo)
      ) {
        this._hovered = true;
      }
    }
  }

  _handleTap() {
    if (!this._disabled) {
      this.dispatchEvent(new CustomEvent('date-is-selected', {
        detail: { date: this.day.date },
      }));
    }
  }

  _handleHover() {
    this.dispatchEvent(new CustomEvent('date-is-hovered', {
      detail: { date: this.day.date },
    }));
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

  _isEnabled(day, min, max, disabledDays) {
    this._disabled = false;
    if (disabledDays && day && day.date) {
      if (
        day.date < min
        || day.date > max
        || disabledDays.findIndex(disabledDay => parseInt(disabledDay, 10) === day.date) !== -1
      ) {
        this._disabled = true;
        return 'disabled';
      }
    }
    return '';
  }
}

window.customElements.define(RangeDatepickerCell.is, RangeDatepickerCell);
