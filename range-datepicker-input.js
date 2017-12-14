/* global RangeDatepickerBehavior */
/**
 * `range-datepicker-input`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class RangeDatepickerInput extends Polymer.mixinBehaviors(
  [Polymer.Templatizer],
  RangeDatepickerBehavior(Polymer.Element)
) {
  static get is() {
    return 'range-datepicker-input';
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
      month: String,
      _monthPlus: String,
      _yearPlus: Number,
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
        observer: '_dateFromChanged',
      },
      /**
       * Date to.
       * Format is Unix timestamp.
       */
      dateTo: {
        type: String,
        notify: true,
        observer: '_dateToChanged',
      },
      /**
       * Current hovered date.
       * Format is Unix timestamp.
       */
      _hoveredDate: String,
      enableYearChange: {
        type: Boolean,
        value: false,
      },
      /**
       * Minimal date.
       * Format is Unix timestamp.
       */
      min: Number,
      /**
       * Maximal date.
       * Format is Unix timestamp.
       */
      max: Number,
      /**
       * Array of disabled days.
       * Format is Unix timestamp.
       */
      disabledDays: Array,

      /**
       * Format of the date.
       * Default is DD/MM/YYYY.
       */
      dateFormat: {
        type: String,
        value: 'DD/MM/YYYY',
      },
      /**
       * The orientation against which to align the dropdown content
       * horizontally relative to the dropdown trigger.
       */
      horizontalAlign: {
        type: String,
        value: 'left',
      },
    };
  }

  static get observers() {
    return ['_monthChanged(month, year)'];
  }

  _handleOpenDropdown() {
    this.shadowRoot.querySelector('iron-dropdown').open();
  }

  _formatDate(date) {
    if (date) {
      return moment(date, 'X')
        .locale(this.locale)
        .format(this.dateFormat);
    }
    return '';
  }

  _dateFromChanged(date) {
    if (this.noRange && date && this.instance) {
      this.shadowRoot.querySelector('iron-dropdown').close();
      if (this.instance) {
        this.instance.dateFrom = this._formatDate(this.dateFrom);
      }
    }
  }

  _dateToChanged(date) {
    if (date) {
      this.shadowRoot.querySelector('iron-dropdown').close();
      if (this.instance) {
        this.instance.dateTo = this._formatDate(this.dateTo);
        this.instance.dateFrom = this._formatDate(this.dateFrom);
      }
    }
  }

  attached() {
    this._ensureTemplatized();
  }

  _forwardHostProp(property, value) {
    if (property === 'dateFrom') {
      const possibleDateFrom = moment(value, ['l', 'L'], true).locale(this.locale);
      if (possibleDateFrom.isValid() && possibleDateFrom.format('X') != this.dateFrom) {
        this.dateFrom = parseInt(possibleDateFrom.format('X'), 10);
      }
    } else if (property === 'dateTo') {
      const possibleDateTo = moment(value, ['l', 'L'], true).locale(this.locale);
      if (possibleDateTo.isValid() && possibleDateTo.format('X') != this.dateTo) {
        this.dateTo = parseInt(possibleDateTo.format('X'), 10);
      }
    }
  }

  _ensureTemplatized() {
    if (!this.instance) {
      this._userTemplate = this.queryEffectiveChildren('template');
      if (!this._userTemplate)
        return;
      const TemplateClass = Polymer.Templatize.templatize(this._userTemplate, this, { forwardHostProp: this._forwardHostProp });
      this.instance = new TemplateClass({ dateTo: 0, dateFrom: 0 });
    }
    const dateFrom = this.dateFrom ? this._formatDate(this.dateFrom) : 0;
    const dateTo = this.dateTo ? this._formatDate(this.dateTo) : 0;
    this._itemsParent.appendChild(this.instance.root);
    if (dateFrom) {
      this.instance.dateFrom = dateFrom;
    }
    if (dateTo) {
      this.instance.dateTo = dateTo;
    }
  }

  get _itemsParent() {
    return Polymer.dom(Polymer.dom(this._userTemplate).parentNode);
  }
}

window.customElements.define(RangeDatepickerInput.is, RangeDatepickerInput);
