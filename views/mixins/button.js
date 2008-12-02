// ========================================================================
// SproutCore
// copyright 2006-2008 Sprout Systems, Inc.
// ========================================================================

/** @static

  This mixin implements many of the basic state-handling attributes for 
  button-like views, including an auto-updated title, and mapping the current
  value to an isSelected state.
  
  Usually you will not work with this mixin directly.  Instead, you should use
  a class that incorporates the mixin such as SC.ButtonView, SC.CheckboxView
  or SC.RadioView.
  
  This mixin assumes you have already applied the SC.Control and 
  SC.DelegateSupport mixins as well.
  
  @since SproutCore 1.0  
*/
SC.Button = {
  
  // ..........................................................
  // VALUE PROPERTIES
  // 
  
  /**
    Used to automatically update the state of the button view for toggle style
    buttons.

    for toggle style buttons, you can set the value and it will be used to
    update the isSelected state of the button view.  The value will also
    change as the user selects or deselects.  You can control which values
    the button will treat as isSelected by setting the toggleOnValue and 
    toggleOffValue.  Alternatively, if you leave these properties set to
    YES or NO, the button will do its best to convert a value to an 
    appropriate state:
  
    - null, false, 0  -> isSelected = false
    - any other single value -> isSelected = true
    - array -> if all values are the same state: that state.  otherwise MIXED.
    
    @property {Object}
  */  
  value: null,
  
  /**
    Value of a selected toggle button.
  
    for a toggle button, set this to any object value you want.  The button
    will be selected if the value property equals the targetValue.  If the
    value is an array of multiple items that contains the targetValue, then
    the button will be set to a mixed state.

    default is YES
    
    @property {Object}
  */
  toggleOnValue: YES,

  /**
    Value of an unselected toggle button.
  
    For a toggle button, set this to any object value you want.  When the
    user toggle's the button off, the value of the button will be set to this
    value.
  
    default is NO 
  
    @property {Object}
  */
  toggleOffValue: NO,
  
  // ..........................................................
  // TITLE 
  // 
  
  /**
    If YES, then the title will be localized.
  */
  localize: NO,
  localizeBindingDefault: SC.Binding.bool(),

  /**
    The button title.  If localize is YES, then this should be the localization key to display.  Otherwise, this will be the actual string displayed in the title.  This property is observable and bindable.
    
    @property {String}
  */  
  title: '',

  /**
    If you set this property, the title property will be updated automatically
    from the content using the key you specify.
  */
  contentTitleKey: null,
  
  /**
    The button icon.  Set this to either a URL or a CSS class name (for 
    spriting).  To display an icon, you must set hasIcon to YES when the 
    button is created.  Note that if you pass a URL, it must contain at 
    least one slash to be detected as such.
    
    @property {String}
  */
  icon: null,

  /**
    If you set this property, the icon will be updated automatically from the
    content using the key you specify.
  */
  contentIconKey: null,
  
  /**
    The computed display title.  This is generated by localizing the title property if necessary.
    
    @property {String}
  */
  displayTitle: function() {
    var ret = this.get('title');
    return (ret && this.get('localize')) ? ret.loc() : (ret || '');
  }.property('title','localize').cacheable(),
  
  /**
    The selector path to the element that contains the button title.   You should only set this property when you first configure the button.  Changing it will not cause the button to redisplay.
  */
  titleSelector: '.sc-button-label',

  /** @private - update title display */
  updateDisplayMixin: function() {
    var icon = this.get('icon') ;
    var needsTitle = NO;
    
    // get the icon.  If there is an icon, then get the image and update it.
    // if there is no image element yet, create it and insert it just before
    // title.
    if (icon) {
      var blank = static_url('blank');
      var img = this.$('img.icon') ;
      if (img.length === 0) {
        img = SC.$('<img src=%@ alt="" class="icon" />'.fmt(blank)) ;
        this.$(this.get('titleSelector') || 'label').text('').prepend(img)
          .append(SC.$('<span class="inner"></span>'));
        needsTitle = YES ;
      }
      
      // this is a URL...set it as src
      if (icon.indexOf('/') >= 0) {
        // wipe any previous sprite and set src
        img.attr('class', 'icon').attr('src', icon);
          
      // this is a sprite. set as class
      } else img.addClass(icon).attr('src', blank) ;
    }
    this.$().setClass('icon', !!icon) ;

    // get the title of the button.  if the display title has changed, then 
    // update the HTML.
    var title = this.get('displayTitle') ;
    if (needsTitle || (title !== this._button_title)) {
      this._button_title = title ;
      var cq = this.$(this.get('titleSelector') || 'label');
      if (icon) cq = cq.find('span.inner') ;
      cq.text(title);  
    }
    
  },

  /**
    Updates the value, title, and icon keys based on the content object, if 
    set.
  */
  contentPropertyDidChange: function(target, key) {
    var del = this.get('displayDelegate');
    var content = this.get('content'), value ;

    var valueKey = this.getDelegateProperty(del, 'contentValueKey') ;
    if (valueKey && (key === valueKey || key === '*')) {
      this.set('value', content ? content.get(valueKey) : null) ;
    }

    var titleKey = this.getDelegateProperty(del, 'contentTitleKey') ;
    if (titleKey && (key === titleKey || key === '*')) {
      this.set('title', content ? content.get(titleKey) : null) ;
    }

    var iconKey = this.getDelegateProperty(del, 'contentIconKey');
    if (iconKey && (key === iconKey || key === '*')) {
      this.set('icon', content ? content.get(iconKey) : null) ;
    }
  },

  /** @private - when title changes, dirty display. */
  _button_displayObserver: function() {
    this.displayDidChange();
  }.observes('title', 'icon'),

  /**
    The key equivalent that should trigger this button on the page.
  */
  keyEquivalent: null,
  
  /**
    Handle a key equivalent if set.  Trigger the default action for the 
    button.  Depending on the implementation this may vary.
    
    @param {String} keystring
    @param {SC.Event} evt
    @returns {Boolean}  YES if handled, NO otherwise
  */
  performKeyEquivalent: function(keystring, evt) {
    if (!this.get('isEnabled')) return NO;
    var keyEquivalent = this.get('keyEquivalent');
    if (keyEquivalent && (keyEquivalent === keystring)) {
      // button has defined a keyEquivalent and it matches!
      // if triggering succeeded, true will be returned and the operation will 
      // be handeled (i.e performKeyEquivalent will cease crawling the view 
      // tree)
      return this.triggerAction(evt);
    }
    return YES;
  },

  /**
    Your class should implement this method to perform the default action on
    the button.  This is used to implement keyboard control.  Your button
    may make this change in its own way also.
  */
  triggerAction: function(evt) {
    throw "SC.Button.triggerAction() is not defined in %@".fmt(this);
  },

  // ..........................................................
  // VALUE <-> isSelected STATE MANAGEMNT
  // 

  /**
    This is the standard logic to compute a proposed isSelected state for a
    new value.  This takes into account the toggleOnValue/toggleOffValue 
    properties, among other things.  It may return YES, NO, or SC.MIXED_STATE.
    
    @param {Object} value
    @returns {Boolean} return state
  */
  computeIsSelectedForValue: function(value) {
    var targetValue = this.get('toggleOnValue') ;
    var state, next ;
    
    if (SC.$type(value) === SC.T_ARRAY) {

      // treat a single item array like a single value
      if (value.length === 1) {
        state = (value[0] == targetValue) ;
        
      // for a multiple item array, check the states of all items.
      } else {
        state = null;
        value.find(function(x) {
          next = (x == targetValue) ;
          if (state === null) {
            state = next ;
          } else if (next !== state) state = SC.MIXED_STATE ;
          return state === SC.MIXED_STATE ; // stop when we hit a mixed state.
        });
      }
      
    // for single values, just compare to the toggleOnValue...use truthiness
    } else {
      state = (value == targetValue) ;
    }
    return state ;
  },
  
  prepareDisplayMixin: function() {
    // if value is not null, update isSelected to match value.  If value is
    // null, we assume you may be using isSelected only.  
    if (!SC.none(this.get('value'))) this._button_valueDidChange();  
  },
  
  /** @private
    Whenever the button value changes, update the selected state to match.
  */
  _button_valueDidChange: function() {
    var value = this.get('value');  
    var state = this.computeIsSelectedForValue(value);
    this.set('isSelected', state) ; // set new state...
  }.observes('value'),
  
  /** @private
    Whenever the selected state is changed, make sure the button value is also updated.  Note that this may be called because the value has just changed.  In that case this should do nothing.
  */
  _button_isSelectedDidChange: function() {
    var newState = this.get('isSelected');
    var curState = this.computeIsSelectedForValue(this.get('value'));
    
    // fix up the value, but only if computed state does not match.
    // never fix up value if isSelected is set to MIXED_STATE since this can
    // only come from the value.
    if ((newState !== SC.MIXED_STATE) && (curState !== newState)) {
      var valueKey = (newState) ? 'toggleOnValue' : 'toggleOffValue' ;
      this.set('value', this.get(valueKey));
    }
  }.observes('isSelected')
  
} ;