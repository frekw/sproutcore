// ========================================================================
// SproutCore
// copyright 2006-2008 Sprout Systems, Inc.
// ========================================================================

require('views/page');

/** 
  Extend SC.Page to emit a design document for the entire page.
*/
SC.Page.prototype.emitDesign = function() {

  // awake all views.  this is needed to emit the design for them.
  this.awake();

  // the pageName must be set on the page so we can emit properly
  var pageName = this.get('pageName');
  
  // now encode the page.
  var ret = SC.DesignCoder.encode(this);
  
  // and add some wrapper
  ret = ['// SproutCore ViewBuilder Design Format v1.0',
    '// WARNING: This file is automatically generated.  DO NOT EDIT.  Changes you',
    '// make to this file will be lost.', '',
    '%@ = %@;'.fmt(pageName, ret),''].join("\n");
  
  return ret ;
};

/**
  Extend SC.Page to create a PageDesignController on demand.
  
  @property {SC.PageDesignController}
*/
SC.Page.prototype.designController = function() {
  if (!this._designController) {
    this._designController = SC.PageDesignController.create({ page: this });
  }
  return this._designController ;
}.property().cacheable();

/**
  Extend SC.Page to emit the localization for the current configuration of the
  view and all of its subviews.
*/
SC.Page.prototype.emitLocalization = function(design) {

  // awake all views.  this is needed to emit the design for them.
  this.awake();

  // the pageName must be set on the page so we can emit properly
  var pageName = this.get('pageName');
  
  // now encode the page.
  var ret = SC.LocalizationCoder.encode(this);

  // and add some wrapper
  ret = ['// SproutCore ViewBuilder Localization Format v1.0',
    '// WARNING: This file is automatically generated.  DO NOT EDIT.  Changes you',
    '// make to this file will be lost.', '',
    '%@.loc(%@);'.fmt(pageName, ret),''].join("\n");
  return ret ;
} ;

/** @private implement support for encoders */
SC.Page.prototype.encodeDesign = function(c) {
  // step through and find all views.  encode them.
  for(var key in this) {
    var view = this[key];
    if (view instanceof SC.View) c.js(key, view.emitDesign());
  }
  
  // save page name;
  c.string('pageName', this.get('pageName'));
};

SC.Page.prototype.encodeLoc = function(c) {
  // step through and find all views.  encode them.
  for(var key in this) {
    var view = this[key];
    if (view instanceof SC.View) c.js(key, view.emitLocalization());
  }
};

  
