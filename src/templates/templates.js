Ember.TEMPLATES["columns"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\r\n		<div class=\"columnContainer\">\r\n			<div class=\"columnTop\">\r\n				<div class=\"columnLabel\" ");
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "editName", {hash:{
    'on': ("click")
  },hashTypes:{'on': "STRING"},hashContexts:{'on': depth0},contexts:[depth0],types:["STRING"],data:data})));
  data.buffer.push(">\r\n					");
  stack1 = helpers['if'].call(depth0, "isEditing", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n				</div>\r\n				<img class=\"editButton\" src=\"images/edit.png\" />\r\n			</div>\r\n			<div class=\"column\">\r\n				");
  stack1 = helpers.each.call(depth0, "post", "in", "column.feed", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n			</div>\r\n		</div>\r\n	");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', helper, options;
  data.buffer.push("\r\n						");
  data.buffer.push(escapeExpression((helper = helpers['focus-input'] || (depth0 && depth0['focus-input']),options={hash:{
    'focus-out': ("saveName"),
    'insert-newline': ("saveName"),
    'type': ("text"),
    'value': ("column.name")
  },hashTypes:{'focus-out': "STRING",'insert-newline': "STRING",'type': "STRING",'value': "ID"},hashContexts:{'focus-out': depth0,'insert-newline': depth0,'type': depth0,'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "focus-input", options))));
  data.buffer.push("\r\n					");
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\r\n						<span>");
  stack1 = helpers._triageMustache.call(depth0, "column.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</span>\r\n					");
  return buffer;
  }

function program6(depth0,data) {
  
  var buffer = '', stack1, helper, options;
  data.buffer.push("\r\n					");
  stack1 = (helper = helpers.equal || (depth0 && depth0.equal),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0,depth0],types:["ID","STRING"],data:data},helper ? helper.call(depth0, "column.service", "Facebook", options) : helperMissing.call(depth0, "equal", "column.service", "Facebook", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n					");
  stack1 = (helper = helpers.equal || (depth0 && depth0.equal),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0,depth0],types:["ID","STRING"],data:data},helper ? helper.call(depth0, "column.service", "Twitter", options) : helperMissing.call(depth0, "equal", "column.service", "Twitter", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n					");
  stack1 = (helper = helpers.equal || (depth0 && depth0.equal),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(11, program11, data),contexts:[depth0,depth0],types:["ID","STRING"],data:data},helper ? helper.call(depth0, "column.service", "Instagram", options) : helperMissing.call(depth0, "equal", "column.service", "Instagram", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n				");
  return buffer;
  }
function program7(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\r\n						\r\n						\r\n						<div class=\"card\">\r\n							<div class=\"smTopPane\">\r\n								");
  stack1 = helpers._triageMustache.call(depth0, "image", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n							</div>\r\n						</div>\r\n						\r\n					");
  return buffer;
  }

function program9(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\r\n						\r\n						Twitter\r\n					");
  return buffer;
  }

function program11(depth0,data) {
  
  var buffer = '';
  data.buffer.push("\r\n						\r\n						Instagram\r\n					");
  return buffer;
  }

  data.buffer.push("<div id=\"headerPane\">\r\n	<h1>PEOPLE+</h1>\r\n	<img id=\"settingsButton\" src=\"images/settings.png\" />\r\n</div>\r\n<div id=\"columnPane\">\r\n	");
  stack1 = helpers.each.call(depth0, "column", "in", "model", {hash:{
    'itemController': ("columns")
  },hashTypes:{'itemController': "STRING"},hashContexts:{'itemController': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\r\n</div>");
  return buffer;
  
});
Ember.TEMPLATES["login"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\r\n<p>");
  stack1 = helpers._triageMustache.call(depth0, "item", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</p>\r\n");
  return buffer;
  }

  data.buffer.push("<h1>Wait, are you sure?!</h1>\r\n");
  stack1 = helpers.each.call(depth0, "item", "in", "model", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  return buffer;
  
});