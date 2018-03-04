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
      _isNarrow: Function,
    };
  }

  static get observers() {
    return ['_monthChanged(month, year)'];
  }

  constructor() {
    super();
    this.instances = [];
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
      this.instance.dateFrom = this._formatDate(this.dateFrom);
    }
  }

  _dateToChanged(date) {
    if (date) {
      this.shadowRoot.querySelector('iron-dropdown').close();
      this.instance.dateTo = this._formatDate(this.dateTo);
      this.instance.dateFrom = this._formatDate(this.dateFrom);
    }
  }

  connectedCallback() {
    if (!this.ctor) {
      const props = {
        __key__: true,
        [this.dateTo]: true,
        [this.dateFrom]: true,
      };
      this._parentTemplate = this.queryEffectiveChildren('template');
      this.ctor = Polymer.Templatize.templatize(this._parentTemplate, this, {
        instanceProps: props,
        forwardHostProp(prop, value) {
          this.instances.forEach((inst) => {
            inst.forwardHostProp(prop, value);
          });
        },
      });
      this._ensureTemplatized();
    }
  }

  _ensureTemplatized() {
    this.instance = new this.ctor({ dateTo: 0, dateFrom: 0 });
    this.instances.push(this.instance);

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
    return Polymer.dom(Polymer.dom(this._parentTemplate).parentNode);
  }
}

window.customElements.define(RangeDatepickerInput.is, RangeDatepickerInput);
