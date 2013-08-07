var reactive = require('reactive');
var events = require('event');
var value = require('value');

reactive.subscribe(function(obj, prop, fn) {
  obj.on('change:'+prop, fn);
});

reactive.unsubscribe(function(obj, prop, fn) {
  obj.off('change:'+prop, fn);
});

reactive.get(function(obj, prop) {
  return obj.get(prop);
});

reactive.set(function(obj, prop, val) {
  obj.set(prop, val);
});

/**
 * Hide the element when an attribute is truthy
 * data-hidden="<attr>"
 */

reactive.bind('data-hidden', function(el, value, obj) {
  this.change(function(val){
    el.classList.toggle('is-hidden', val);
  });
});

/**
 * Show an element when an attribute is truthy
 * data-visible="<attr>"
 */

reactive.bind('data-visible', function(el, value, obj) {
  this.change(function(val){
    el.classList.toggle('is-hidden', !val);
  });
});

/**
 * Set the text value for a set of options in a select menu.
 * The attribute value should be an array of strings that will
 * be used to populate the content of the options in a select
 * data-option-text="<attr>"
 */

reactive.bind('data-option-text', function(el, value, obj) {
  this.change(function(options){
    var options = obj.get(value);
    Array.prototype.forEach.call(el.querySelectorAll('option'), function(option, i){
      option.innerHTML = options[i];
    });
  });
});

/**
 * Bind an attribute to an input, select or textarea field
 * When the field updates, it updates the model. When the
 * model updates, the field state updates
 * data-model="email"
 */

reactive.bind('data-model', function(el, attr, model) {
  var type = el.getAttribute('type');
  var name = el.nodeName.toLowerCase();

  // When the field changes
  events.bind(el, 'change', function(){
    model.set(attr, value(el));
  });

  // When the attribute changes
  this.change(function(){
    var val = model.get(attr);
    if(val == null) {
      val = "";
    }
    if(name !== "input" && name !== "select") {
      el.innerHTML = val;
    }
    else if(type === "radio") {
      value(el, el.value === String(val));
    }
    else {
      value(el, val);
    }
  });
  
  // Fill the model with the data immediately
  // if there is no value on the model already
  if(model.get(attr) == null) {
    model.set(attr, value(el));
  }
  
});

/**
 * Parse JSON within an element and set it on the model.
 * This is usually when the backend wants to prefill the
 * model data using a script tag with JSON.
 */

reactive.bind('data-json', function(el, value, model) {
  var data = JSON.parse(el.innerHTML);
  var parsed = model.parse(data);
  model.set(parsed);
  el.parentNode.removeChild(el);
});

module.exports = reactive;
