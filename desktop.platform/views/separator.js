// ========================================================================
// SproutCore
// copyright 2006-2008 Sprout Systems, Inc.
// ========================================================================

require('views/view') ;

/**
  @class

  Displays a horizontal or vertical separator line.  Simply create one of 
  these views and configure the layout direction and layout frame.
  
  @extends SC.View
  @since SproutCore 1.0
*/
SC.SeparatorView = SC.View.extend(
/** @scope SC.SeparatorView.prototype */ {

  emptyElement: '<span><span></span></span>',
  styleClass: ['sc-separator-view'],

  /** 
    Select the direction of the separator line.  Must be one of SC.LAYOUT_VERTICAL or SC.LAYOUT_HORIZONTAL.
    
    @property {String}
  */
  layoutDirection: SC.LAYOUT_HORIZONTAL,

  prepareDisplay: function() {
    var ret = sc_super();
    this.$().addClass(this.get('layoutDirection'));
  }

});