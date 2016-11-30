/* jshint forin:true, noarg:true, noempty:true, eqeqeq:true, boss:true, undef:true, curly:true, browser:true, jquery:true */
/*
 * jQuery MultiSelect UI Widget 1.14pre
 * Copyright (c) 2012 Eric Hynds
 *
 * http://www.erichynds.com/jquery/jquery-ui-multiselect-widget/
 *
 * Depends:
 *   - jQuery 1.4.2+
 *   - jQuery UI 1.8 widget factory
 *
 * Optional:
 *   - jQuery UI effects
 *   - jQuery UI position utility
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */
/*
 * 插件使用守则：
 * 1.isUnique属性用来添加特殊样式
 * 2.isMenuEffective是个开关，如果为true则表示配置的menu参数生效，如果则menu参数失效，按照系统默认的参数来走，width:150,height:180
 * 3.对于元素（element）包含关键词province和city的特殊处理，指直接给出模板的宽和高，当然如果配置了上面的isMenuEffective则也可以自己调配
 * */
(function($, undefined) {

  var multiselectID = 0;
  var $doc = $(document);


  
  $.widget("ech.multiselect", {

    // default options
    options: {
      header: false,
      theme: 'default',
      height: 150,
      minWidth: 150,
      minHeight:18,
      classes: '',
      checkAllText: '全选',
      uncheckAllText: '清空',
      noneSelectedText: '请选择',
      selectedText: '已选择#个',//# selected
      selectedList: 0,
      show: null,
      hide: null,
      autoOpen: false,
      multiple: true,
      visiable: true,	//是否可见  新增属性
      isUnique: false, //是否使用特殊样式：
      divAlignRight:true,//弹出的下拉框和文本框是左对齐(false)，还是右对齐（true）
      isMenuEffective: false,
      position: {}
    },

    _create: function() {
      var el = this.element.hide();
      var o = this.options;

      this.speed = $.fx.speeds._default; // default speed for effects
      this._isOpen = false; // assume no

      // create a unique namespace for events that the widget
      // factory cannot unbind automatically. Use eventNamespace if on
      // jQuery UI 1.9+, and otherwise fallback to a custom string.
      this._namespaceID = this.eventNamespace || ('multiselect' + multiselectID);

//      var button = (this.button = $('<button type="button"><span class="ui-icon ui-icon-triangle-2-n-s"></span></button>'))
      //修改源码，特殊样式处理
      var button = "";
      if(!o.isUnique){
    	  button = (this.button = $('<button type="button"><div class="select_icon"></div></button>'))
	    	  .addClass('ui-multiselect ui-widget ui-state-default')
	    	  .addClass(o.classes)
	    	  .attr({ 'title':el.attr('title'), 'aria-haspopup':true, 'tabIndex':el.attr('tabIndex') })
	    	  .insertAfter(el);
      }else{
    	 button = (this.button = $('<button type="button"><div class="select_icon_unique"></div></button>'))
    	  .addClass('ui-multiselect ui-widget ui-state-default')
    	  .addClass(o.classes)
    	  .attr({ 'title':el.attr('title'), 'aria-haspopup':true, 'tabIndex':el.attr('tabIndex') })
    	  .insertAfter(el);
      }
      
      var width1 = this.element.outerWidth();
      var o = this.options;
      var j=this.element.html().indexOf('.');
      if(/\d/.test(o.minWidth) && width1 < o.minWidth) {
    	   width1 = o.minWidth;
      }else if(j>0){//修改源码 fx 区间维度 botton宽度不变
    	   width1 = o.minWidth;
      }
      
     var  buttonlabel = (this.buttonlabel = $('<span style="margin-top:3px"/>'))
		  .html(o.noneSelectedText)
		  .appendTo(button);
	  
	 var menu = (this.menu = $('<div />'))
		  .addClass('ui-multiselect-menu ui-widget ui-widget-content ')
		  .addClass(o.classes)
		  .appendTo(document.body);
	
		  var checkboxContainer,header,headerLinkContainer;
		  
      if(o.header===true){
    	  //只有当header为true时【也就显示全选和清空按钮】，才会动态调整header到下面去
    	  checkboxContainer = (this.checkboxContainer = $('<ul />'))
	    	  .addClass('ui-multiselect-checkboxes ui-helper-reset')
	    	  .appendTo(menu),
    	  
    	  header = (this.header = $('<div />'))
	    	  .addClass('ui-corner-all ui-multiselect-header ui-helper-clearfix')
	    	  .appendTo(menu),
    	  
    	  headerLinkContainer = (this.headerLinkContainer = $('<ul />'))
	    	  .addClass('ui-helper-reset-header')
	    	  .html(function() {
	    		  if(o.header === true) {
//	    			  return '<li><a class="ui-multiselect-all" href="#"><span class="ui-icon ui-icon-check"></span><span>' + o.checkAllText + '</span></a></li><li><a class="ui-multiselect-none" href="#"><span class="ui-icon ui-icon-closethick"></span><span>' + o.uncheckAllText + '</span></a></li>';
	    			  return 
	    			 ' <li>'+
	    			  	'<a class="ui-multiselect-all" href="#">'+
		    			  '<span class="ui-icon ui-icon-check"></span>'+
		    			'</a>'+
	    			  '</li>'+
	    			  '<li>'+
	    			  	'<a class="ui-multiselect-none" href="#">'+
	    			  		'<span class="ui-icon ui-icon-closethick"></span>'+
	    			  	'</a>'+
	    			  '</li>';
	    		  } else if(typeof o.header === "string") {
	    			  return '<li>' + o.header + '</li>';
	    		  } else {
	    			  return '';
	    		  }
    	  })
    	  .append('<li class="ui-multiselect-close"><a href="#" class="ui-multiselect-close"><span class="ui-icon ui-icon-circle-close"></span></a></li>')
    	  .appendTo(header);
    	  
      }else{

    	  header = (this.header = $('<div />'))
	    	  .addClass('ui-corner-all ui-multiselect-header ui-helper-clearfix')
	    	  .appendTo(menu),
	    	  
    	  headerLinkContainer = (this.headerLinkContainer = $('<ul />'))
	    	  .addClass('ui-helper-reset-header')
	    	  .html(function() {
	    		  if(o.header === true) {
	    			  return '<li><a class="ui-multiselect-all" href="#"><span class="ui-icon ui-icon-check"></span><span>' + o.checkAllText + '</span></a></li><li><a class="ui-multiselect-none" href="#"><span class="ui-icon ui-icon-closethick"></span><span>' + o.uncheckAllText + '</span></a></li>';
	    		  } else if(typeof o.header === "string") {
	    			  return '<li>' + o.header + '</li>';
	    		  } else {
	    			  return '';
	    		  }
	    	  })
	    	  .append('<li class="ui-multiselect-close"><a href="#" class="ui-multiselect-close"><span class="ui-icon ui-icon-circle-close"></span></a></li>')
	    	  .appendTo(header),
	    	  
    	  checkboxContainer = (this.checkboxContainer = $('<ul />'))
	    	  .addClass('ui-multiselect-checkboxes ui-helper-reset')
	    	  .appendTo(menu);
    	  
    	 
    	  
      
      }

    
      
      	//给控件添加主题的class名称
	    if(o.theme!='default'){
	      button.addClass('ui-widget-' + o.theme);
	      menu.addClass('ui-widget-' + o.theme);
	      header.addClass('ui-widget-header-' + o.theme);
	    }

        // perform event bindings
        this._bindEvents();

        // build menu
        this.refresh(true);

        // some addl. logic for single selects
        if(!o.multiple) {
          menu.addClass('ui-multiselect-single');
        }

        // bump unique ID
        multiselectID++;
    },

    _init: function() {
      if(this.options.header === false) {
        this.header.hide();
      }
      //设置是否可见  改良添加
      if(this.options.visiable === false) {
    	  this.button.hide();
      }else{
    	  this.button.show();
      }

      if(!this.options.multiple) { 
        this.headerLinkContainer.find('.ui-multiselect-all, .ui-multiselect-none').hide();
      }else{
    	this.headerLinkContainer.find('.ui-multiselect-all, .ui-multiselect-none').show();
      }
      if(this.options.autoOpen) {
        this.open();
      }
      if(this.element.is(':disabled')) {
        this.disable();
//  alert(this.element.parent().find("button").css("display"));
//        this.element.parent().find("button").hide();
      }
    },

    refresh: function(init) {
      var el = this.element;
      var o = this.options;
      var menu = this.menu;
      var checkboxContainer = this.checkboxContainer;
      var optgroups = [];
      var html = "";
      var id = el.attr('id') || multiselectID++; // unique ID for the label & option tags

  	var liNumber = el.find('option').size();//option數量
    var scrollExist = false;
      // build items
    var elementId = el.attr("id");
    
      el.find('option').each(function(i) {
        var $this = $(this);
        var parent = this.parentNode;
        var title = this.innerHTML;
       
        var description = this.title;
        var value = this.value;
        var inputID = 'ui-multiselect-' + (this.id || id + '-option-' + i);
        var groupID = 'ui-multiselect-' + (this.id || id + '-option');
        var isDisabled = this.disabled;
        var isSelected = this.selected;
        var isVisiable = this.visiable;
//        var labelClasses = [ 'ui-corner-all' ];
        //修改源码，去掉下拉框菜单，鼠标划过时的背景中圆角
        var labelClasses = [ '' ];//去掉圆角样式
       
        var liClasses = (isDisabled ? 'ui-multiselect-disabled ' : ' ') + this.className;
        if(o.isUnique){
        	liClasses = "ui-multiselect-unique";
        }
        var optLabel;
        var optValue;//分组
        var isGroupSelected;//分组父级是否选中
        // is this an optgroup?
        if(parent.tagName === 'OPTGROUP') {
          optLabel = parent.getAttribute('label');
          optValue = parent.getAttribute('value');
          isGroupSelected=parent.getAttribute('selected');
          //alert("optLabel=="+optLabel+"===isSelected==="+isSelected);
          // has this optgroup been added already?
          if($.inArray(optLabel, optgroups) === -1) {
            html += '<li class="ui-multiselect-optgroup-label ' + parent.className + '" >';
            //分组 父级单选框先屏蔽
            /* html += '<label ><input id="' + groupID + '" name="' + groupID + '" type="' + (o.multiple ? "checkbox" : "radio") + '" value="' +optValue + '" title="' + optLabel + '"';*/
            html += '<label >';
            /*  if(isSelected) {*/
            /*if(isGroupSelected=='selected'){
                html += ' checked="checked"';
                html += ' aria-selected="true"';
            }*/
            // disabled?
            
            /* if(isDisabled) {
              html += ' disabled="disabled"';
              html += ' aria-disabled="true"';
            }*/
            html += '<span>' + optLabel + '</span></label></li>';

            /*html += '><span>' + optLabel + '</span></lable></li>';*/
            optgroups.push(optLabel);
          }
        }

        if(isDisabled) {
          labelClasses.push('ui-state-disabled');
        }

        // browsers automatically select the first option
        // by default with single selects
        if(isSelected && !o.multiple&&!o.isUnique) {
        	labelClasses.push('ui-state-active');
        }else if(isSelected && !o.multiple&&o.isUnique){
        	labelClasses.push("ui-multiselect-unique-hover");
        }
        
        //如果配置menu生效
        
      //--------------by yangzy--------------//
        if (o["menu"] && o["menu"].liWidth) {
        	//--------------自动调整下拉框宽度默认为150，li也自动调整填满  by lixl-----------------------//
        	var menuWidth = o["menu"].menuWidth;
        	var liWidth = 	o["menu"].liWidth;
        	var height = 180;//默认高度定为180
        	var isMenuEffective = o.isMenuEffective;
        			if(!isMenuEffective){
        				menuWidth = 150;
        			}
	        		if(o.height>180){
	        			height = o.height;
	        		}
	        		
	        		if(liNumber>0){
	        			var liHeight = 25;//每個li的高度25,默認
	        			var liAllHeight = liHeight*liNumber;//li總高度
//	        			scrollExist = liAllHeight>height;//滾動條是否存在//这样写是避免li宽时撑大ul，出现水平滚动条，现在直接css设置overflow-x:hidden了，所以就不需要了
	        		}
        			if(!isMenuEffective&&elementId.indexOf("province")==-1&&elementId.indexOf("city")==-1){//没有配置menu生效
        				//TODO 修改源碼，判斷是否有滾動條，如果有則不多加两帧 ，如果沒有則为了占满，多家两帧
        				if(scrollExist){
        					liWidth = menuWidth-15;//滾動條佔據的
        				}else{
        					liWidth = menuWidth+2;//为了占满，多家两帧 
        				}
        			}else{
	        			if(elementId.indexOf("province")!=-1||elementId.indexOf("city")!=-1){//省份或者地市，直接给他们宽度和高度 ：总宽度398 ，li宽度80
	        				//TODO 修改源碼，判斷是否有滾動條，如果有則不多加两帧 ，如果沒有則为了占满，多家两帧
	        				if(!isMenuEffective){
	        					menuWidth = 398;
	        					liWidth = 80;
	        				}
	        			}else{
	        				//TODO 修改源碼，判斷是否有滾動條，如果有則不多加两帧 ，如果沒有則为了占满，多家两帧
	        				if(!isMenuEffective){
	        					if(scrollExist){
	        						if(liWidth>=menuWidth){
	        							liWidth = menuWidth-15;//滾動條佔據的
	        						}
	        					}else{
	        						if(liWidth>=menuWidth){
	        							liWidth = menuWidth+2;//为了占满，多家两帧 
	        						}
	        					}
	        				}
	        			}
        		}
        	
        	html += '<li class="' + liClasses + '" style="width:' + liWidth + 'px;clear:none;float:left;">';
        } else {
        	html += '<li class="' + liClasses + '">';
        }
        
        

        // create the label
        html += '<label for="' + inputID + '" title="' + description + '" class="' + labelClasses.join(' ') + '">';
        html += '<input id="' + inputID + '" name="multiselect_' + id + '" type="' + (o.multiple ? "checkbox" : "radio") + '" value="' + value + '" title="' + title + '"';
     
        // pre-selected?
        if(isSelected) {
          html += ' checked="checked"';
          html += ' aria-selected="true"';
        }

        // disabled?
        if(isDisabled) {
          html += ' disabled="disabled"';
          html += ' aria-disabled="true"';
        }
        
        // add the title and close everything off
        //----by yangzhenyu 20131104
        //html += ' /><span>' + title + '</span></label></li>';
        
        var menMaxWordNum = 20;
//    	alert(3);
        if (o["menu"]&&o["menu"].maxWordNum) {
        	//这里是下拉框默认的值的长度
        	
        	menMaxWordNum = o["menu"].maxWordNum;
        
        	if(o.isUnique){//字体设置为白色
    			html += ' /><span style="color:white" title="' + title + '">' + autoAddEllipsis(title,menMaxWordNum) + '</span></label></li>';
    		}else{
    			html += ' /><span  title="' + title + '">' + autoAddEllipsis(title,menMaxWordNum) + '</span></label></li>';
    		}
        	//修改源码
        } else {
        	if(o.isUnique){
        		html += ' /><span style="color:white" title="' + title + '">' + autoAddEllipsis(title,menMaxWordNum)  + '</span></label></li>';
        	}else{
        		html += ' /><span title="' + title + '">' + autoAddEllipsis(title,menMaxWordNum)  + '</span></label></li>';
        	}
        }
        
        
      });

      // insert into the DOM
      checkboxContainer.html(html);
      // cache some moar useful elements
      this.labels = menu.find('label');
      this.inputs = this.labels.children('input');

      // set widths
      this._setButtonWidth();
      this._setMenuWidth();

      // remember default value
      this.button[0].defaultValue = this.update();

      // broadcast refresh event; useful for widgets
      if(!init) {
        this._trigger('refresh');
      }
    },

    // updates the button text. call refresh() to rebuild
    update: function() {
      var o = this.options;
      var $inputs = this.inputs;
      var $checked = $inputs.filter(':checked');
      var numChecked = $checked.length;
      var value;

      if(numChecked === 0) {
        value = o.noneSelectedText;
      } else {
        if($.isFunction(o.selectedText)) {   
          value = o.selectedText.call(this, numChecked, $inputs.length, $checked.get());
        } else if(/\d/.test(o.selectedList) && o.selectedList > 0 && numChecked <= o.selectedList) {
          value = $checked.map(function() { 
        	  		//return $(this).next().html(); 
        	  		return $(this).next().attr('title') ? $(this).next().attr('title') : $(this).next().html();
        		}).get().join(', ');
        }else if (o.multiple == false) {//----分组时单选选------//
        	$checked = $inputs.filter(':checked');
        	//alert("$checked.length=" + $checked.length);
        	for (var i=0; i<$checked.length; i++) {//---只选择active
        		var ipt = $checked[i];        		
        		if ($(ipt).parents('label.ui-state-active').length == 1) {
        			
        			value = $(ipt).next().html();       			
            		break;
        		}
        	}
        } else {
          value = o.selectedText.replace('#', numChecked).replace('#', $inputs.length);
        }
      }
      
      //--点击选项后，将区间类别去掉-----fx---
      if(value.indexOf(" ")!=-1){
    	  value=value.substring(value.indexOf(" ")+1);
      }else  if(value.indexOf("主动联系")!=-1){
    	  value=value.substring(value.indexOf("主动联系")+4);
      }
      this._setButtonValue(value);

      return value;
    },

    // this exists as a separate method so that the developer 
    // can easily override it.
    _setButtonValue: function(value) {
    	this.button.attr('title',value); //-----by yangzhenyu 20131106--增加title-
    	
    	//-----by yangzhenyu 20131111--增加文字缩略显示-
    	
    	var maxWordNum = 10;//默认文本框填写5个汉字，如果需要更多则需要在手动具体-------------2014/7/8--------------bylixl---------------
    	if (this.options["button"]&&this.options["button"].maxWordNum) {
    		maxWordNum = this.options["button"].maxWordNum
    	}
    	value = autoAddEllipsis(value, maxWordNum);
//    	alert(value);
    	this.buttonlabel.text(value);
    },

    // binds events
    _bindEvents: function() {
      var self = this;
      var button = this.button;
      var o = this.options;

      function clickHandler() {
        self[ self._isOpen ? 'close' : 'open' ]();
        return false;
      }

      // webkit doesn't like it when you click on the span :(
      button
        .find('span')
        .bind('click.multiselect', clickHandler);

      // button events
      button.bind({
        click: clickHandler,
        keypress: function(e) {
          switch(e.which) {
            case 27: // esc
              case 38: // up
              case 37: // left
              self.close();
            break;
            case 39: // right
              case 40: // down
              self.open();
            break;
          }
        },
        //---------------bylixl 去除鼠标移入效果--------
//        mouseenter: function() {
//          if(!button.hasClass('ui-state-disabled')) {
//            $(this).addClass('ui-state-hover');
//            if(o.theme!='default'){
//            	 $(this).addClass('ui-state-hover-'+o.theme);
//            }
//          }
//        },
        mouseleave: function() {
        	if(!o.isUnique){
        		
        		$(this).removeClass('ui-state-hover');
        		if(o.theme!='default'){
        			$(this).removeClass('ui-state-hover-'+o.theme);
        		}
        	}else{
        		$(this).removeClass('ui-multiselect-unique-hover');
        		if(o.theme!='default'){
        			$(this).removeClass('ui-multiselect-unique-hover-'+o.theme);
        		}
        	}
        },
        //-----------------------bylixl 去除焦点效果-----------
//        focus: function() {
//          if(!button.hasClass('ui-state-disabled')) {
//            $(this).addClass('ui-state-focus');
//            if(o.theme!='default'){
//           	  $(this).addClass('ui-state-focus-'+o.theme);
//            }
//          }
//        },
        blur: function() {
        	if(!o.isUnique){
        		
        		$(this).removeClass('ui-state-focus');
        		if(o.theme!='default'){
        			$(this).removeClass('ui-state-focus-'+o.theme);
        		}
        	}else{
        		$(this).removeClass('ui-multiselect-unique-focus');
        		if(o.theme!='default'){
        			$(this).removeClass('ui-multiselect-unique-focus-'+o.theme);
        		}
        	}
        }
      });

      // header links
      this.header.delegate('a', 'click.multiselect', function(e) {
        // close link
        if($(this).hasClass('ui-multiselect-close')) {
          self.close();
          // check all / uncheck all
        } else {
          self[$(this).hasClass('ui-multiselect-all') ? 'checkAll' : 'uncheckAll']();
        }
        e.preventDefault();
      });

      // optgroup label toggle support
      this.menu.delegate('li.ui-multiselect-optgroup-label a', 'click.multiselect', function(e) {
        e.preventDefault();

        var $this = $(this);
        var $inputs = $this.parent().nextUntil('li.ui-multiselect-optgroup-label').find('input:visible:not(:disabled)');
        var nodes = $inputs.get();
        var label = $this.parent().text();
        var o = this.options;

        // trigger event and bail if the return is false
        if(self._trigger('beforeoptgrouptoggle', e, { inputs:nodes, label:label }) === false) {
          return;
        }

        // toggle inputs
        self._toggleChecked(
          $inputs.filter(':checked').length !== $inputs.length,
          $inputs
        );

        self._trigger('optgrouptoggle', e, {
          inputs: nodes,
          label: label,
          checked: nodes[0].checked
        });
      })
      
      .delegate('label', 'mouseenter.multiselect', function() {
    	  
        if(!$(this).hasClass('ui-state-disabled')) {
        	if(!o.isUnique){
        		self.labels.removeClass('ui-state-hover');
        		$(this).addClass('ui-state-hover').find('input').focus();
        		if(o.theme!='default'){
        			$(this).addClass('ui-state-hover-'+o.theme);
        		}
        	}else{
        		self.labels.removeClass('ui-multiselect-unique-hover');
        		$(this).addClass('ui-multiselect-unique-hover').find('input').focus();
        		if(o.theme!='default'){
        			$(this).addClass('ui-multiselect-unique-hover-'+o.theme);
        		}
        	}
        }
      })
      
      //源码有修改，点击下拉框，鼠标离开时，移除样式ui-state-hover
       .delegate('label', 'mouseleave.multiselect', function() {
        if(!$(this).hasClass('ui-state-disabled')) {
        	if(!o.isUnique){
        		
        		self.labels.removeClass('ui-state-hover');
        		if(o.theme!='default'){
        			$(this).removeClass('ui-state-hover-'+o.theme);
        		}
        	}else{
        		self.labels.removeClass('ui-multiselect-unique-hover');
        		if(o.theme!='default'){
        			$(this).removeClass('ui-multiselect-unique-'+o.theme);
        		}
        	}
        }
      })
      
      .delegate('label', 'keydown.multiselect', function(e) {
        e.preventDefault();

        switch(e.which) {
          case 9: // tab
            case 27: // esc
            self.close();
          break;
          case 38: // up
            case 40: // down
            case 37: // left
            case 39: // right
            self._traverse(e.which, this);
          break;
          case 13: // enter
            $(this).find('input')[0].click();
          break;
        }
      })
      .delegate('input[type="checkbox"], input[type="radio"]', 'click.multiselect', function(e) {
        var $this = $(this);
        var val = this.value;
        var checked = this.checked;
        var tags = self.element.find('option');

        // bail if this input is disabled or the event is cancelled
        if(this.disabled || self._trigger('click', e, { value: val, text: this.title, checked: checked }) === false) {
          e.preventDefault();
          return;
        }

        // make sure the input has focus. otherwise, the esc key
        // won't close the menu after clicking an item.
        $this.focus();

        // toggle aria state
        $this.attr('aria-selected', checked);

        // change state on the original option tags
        tags.each(function() {
          if(this.value === val) {
            this.selected = checked;
          } else if(!self.options.multiple) {
            this.selected = false;
          }
        });

        // some additional single select-specific logic
        if(!self.options.multiple) {
        	if(!o.isUnique){
        		self.labels.removeClass('ui-state-active');
        		$this.closest('label').toggleClass('ui-state-active', checked);
        	}else{
        		self.labels.removeClass('ui-multiselect-unique-active');
        		$this.closest('label').toggleClass('ui-multiselect-unique-active', checked);
        	}

          // close menu
          self.close();
        }

        // fire change on the select box
        self.element.trigger("change");

        // setTimeout is to fix multiselect issue #14 and #47. caused by jQuery issue #3827
        // http://bugs.jquery.com/ticket/3827
        setTimeout($.proxy(self.update, self), 10);
      });

      // close each widget when clicking on any other element/anywhere else on the page
      $doc.bind('mousedown.' + this._namespaceID, function(e) {
        if(self._isOpen && !$.contains(self.menu[0], e.target) && !$.contains(self.button[0], e.target) && e.target !== self.button[0]) {
          self.close();
        }
      });

      // deal with form resets.  the problem here is that buttons aren't
      // restored to their defaultValue prop on form reset, and the reset
      // handler fires before the form is actually reset.  delaying it a bit
      // gives the form inputs time to clear.
      $(this.element[0].form).bind('reset.multiselect', function() {
        setTimeout($.proxy(self.refresh, self), 10);
      });
    },

    // set button width
    _setButtonWidth: function() {
    	//--by yangzhenyu 29131111--开启输入按钮自动宽度---//
      if (this.options["button"] && this.options["button"].autoWidth == true) {
    	  //...
      } else {
    	  var width = this.element.outerWidth();
          var o = this.options;
          var j=this.element.html().indexOf('.');
          if(/\d/.test(o.minWidth) && width < o.minWidth) {
        	   width = o.minWidth;
          }else if(j>0){//修改源码 fx 区间维度 botton宽度不变
        	   width = o.minWidth;
          }

          // set widths
          this.button.outerWidth(width); 
          var margleft = this.button.width()-20;
          // ------------------------bylixl   修改源码，对特殊样式，特殊处理偏移量------------------------
          if(!o.isUnique){
        	  this.button.find(".select_icon").css("margin-left",this.button.width()-23);
          }else if(o.isUnique){//特殊样式，特殊处理
        	  this.button.find(".select_icon_unique").css("margin-left",this.button.width()-23);
          }
          
          var height = this.element.outerHeight();//元素本身高度，如input等（這些元素是要隱藏的）
          var o = this.options;
          var j=this.element.html().indexOf('.');
          if(/\d/.test(o.minHeight) && height < o.minHeight) {
        	  height = o.minHeight;
          }else if(j>0){//修改源码 fx 区间维度 botton宽度不变
        	  height = o.minHeight;
          }
          //------------------by lixl--修改源码，统一规定文本框高度都为18px----------------------
          this.button.css("height","20px");//
      }
    },

    // set menu width
    _setMenuWidth: function() {
      var m = this.menu;
      var el  = this.element;
      var elementId = el.attr("id");
      var isMenuEffective = this.options.isMenuEffective;
      //------by yangzy--------//
      if (!isMenuEffective&&this.options["menu"] && this.options["menu"].menuWidth) {//没有配置生效
		  //-------------bylixl  对省份地市特殊处理-----------------------
    	  var menuWidth1 = this.options["menu"].menuWidth;
    		  if(elementId.indexOf("province")!=-1){//省份或者地市，直接给他们宽度和高度 ：总宽度398 ，li宽度80
				  	menuWidth1 = 398;
    	  		}else if(elementId.indexOf("city")!=-1){
	  				menuWidth1 = 318;
    	  		}else{
	  				menuWidth1 = 150;
    	  		}
    		  m.width(menuWidth1);
      } else {//如果menu配置生效
    	  var menuWidth1 = this.button.outerWidth();
    	  if(this.options["menu"] && this.options["menu"].menuWidth){//设置最小值为150
    		  if(!isMenuEffective){
    			  menuWidth1 = 150;
    		  }else{
    			  menuWidth1 =  this.options["menu"].menuWidth;
    			  
    		  }
    	  }
    	  m.width(menuWidth1);
      }
    },

    // move up or down within the menu
    _traverse: function(which, start) {
      var $start = $(start);
      var moveToLast = which === 38 || which === 37;

      // select the first li that isn't an optgroup label / disabled
      $next = $start.parent()[moveToLast ? 'prevAll' : 'nextAll']('li:not(.ui-multiselect-disabled, .ui-multiselect-optgroup-label)')[ moveToLast ? 'last' : 'first']();

      // if at the first/last element
      if(!$next.length) {
        var $container ;
        //---------------源碼修改 lixl，如果配置了header則先找到container對象，配合上面的_create方法-----------------------
        if(o.header===true){
      	  $container = menu.find('ul').first();
        }else{
      	  $container = menu.find('ul').last();
        }

        // move to the first/last
        this.menu.find('label')[ moveToLast ? 'last' : 'first' ]().trigger('mouseover');

        // set scroll position
        $container.scrollTop(moveToLast ? $container.height() : 0);

      } else {
        $next.find('label').trigger('mouseover');
      }
    },

    // This is an internal function to toggle the checked property and
    // other related attributes of a checkbox.
    //
    // The context of this function should be a checkbox; do not proxy it.
    _toggleState: function(prop, flag) {
      return function() {
    	var value=this.value;
        if(!this.disabled) {
        	if(value!=''){
          this[ prop ] = flag;
        	}else{
        		this[ prop ] = false;
        	}
        }
       /* if(flag) {
          this.setAttribute('aria-selected', true);
        } else {
          this.removeAttribute('aria-selected');
        }*/
        //源代码有修改 当选地市选‘全部’选项时，剔除掉小勾
        if(flag) {
        	if(value!=''){
              this.setAttribute('aria-selected', true);
        	}else{
        	  this.removeAttribute('aria-selected');
        	}
        } else {
              this.removeAttribute('aria-selected');
          }
      };
    },

    _toggleChecked: function(flag, group) {
      var $inputs = (group && group.length) ?  group : this.inputs;
      var self = this;

      // toggle state on inputs
      $inputs.each(this._toggleState('checked', flag));

      // give the first input focus
    //源码修改，屏蔽此段代码，默认在第一行加上ui-state-active样式
     /*$inputs.eq(0).focus();*/

      // update button text
      this.update();

      // gather an array of the values that actually changed
      var values = $inputs.map(function() {
        return this.value;
      }).get();

      // toggle state on original option tags
      this.element
        .find('option')
        .each(function() {
          if(!this.disabled && $.inArray(this.value, values) > -1) {
        	if(this.value!=''){
                self._toggleState('selected', flag).call(this);
        	}else{
        		self._toggleState('selected', false).call(this);
        	}
          }
        });

      // trigger the change event on the select
      if($inputs.length) {
        this.element.trigger("change");
      }
    },

    _toggleDisabled: function(flag) {
    	 //修改源碼添加隱藏屬性
//      this.button.show();
      this.button.attr({ 'disabled':flag, 'aria-disabled':flag })[ flag ? 'addClass' : 'removeClass' ]('ui-state-disabled');

      var inputs = this.menu.find('input');
      var key = "ech-multiselect-disabled";

      if(flag) {
//    	  //修改源碼添加隱藏屬性
//    	  this.button.hide();
        // remember which elements this widget disabled (not pre-disabled)
        // elements, so that they can be restored if the widget is re-enabled.
        inputs = inputs.filter(':enabled').data(key, true)
      } else {
        inputs = inputs.filter(function() {
          return $.data(this, key) === true;
        }).removeData(key);
      }

      inputs
        .attr({ 'disabled':flag, 'arial-disabled':flag })
        .parent()[ flag ? 'addClass' : 'removeClass' ]('ui-state-disabled');

      this.element.attr({
        'disabled':flag,
        'aria-disabled':flag
      });
    },

    // open the menu
    open: function(e) {
      var self = this;
      var button = this.button;
      var menu = this.menu;
      var speed = this.speed;
      var o = this.options;
      var args = [];
      var el = this.element;
      var liNumber = el.find('option').size();//option數量
      //只有当header为true时【也就显示全选和清空按钮】，才会动态调整按钮的位置居中
      if(o.header === true) {
    	  var menuWidth = menu.width()-15;
    	  var buttonWidth = menu.find(".ui-helper-reset-header li a").width();
    	  var nbsp = menu.find(".ui-helper-reset-header .ui-multiselect-none").css("margin-left");//两个按钮之间的距离
    	  var aaa = buttonWidth*2+parseInt(nbsp);
    	  var buttonMarginLeft = (menuWidth-aaa)/2;
    	  $(".ui-helper-clearfix")
    	  .css("position","relative")
    	  .css("top","3px")
    	  .css("border-radius","0px")
    	  .css("border-top","1px solid #CCCCCC");
    	  
    	  menu.find(".ui-helper-reset-header .ui-multiselect-all").css("margin-left",buttonMarginLeft);
      }
      
      
      
      // bail if the multiselectopen event returns false, this widget is disabled, or is already open
      if(this._trigger('beforeopen') === false || button.hasClass('ui-state-disabled') || this._isOpen) {
        return;
      }
      var $container ;
      if(o.header===true){
    	  $container = menu.find('ul').first();
      }else{
    	  $container = menu.find('ul').last();
      }
      var effect = o.show;

      // figure out opening effects/speeds
      if($.isArray(o.show)) {
        effect = o.show[0];
        speed = o.show[1] || self.speed;
      }

      // if there's an effect, assume jQuery UI is in use
      // build the arguments to pass to show()
      if(effect) {
        args = [ effect, speed ];
      }

      // set the scroll of the checkbox container
//      $container.scrollTop(0).height(o.height);//之前高度是配置的
      //--------------修改源码固定高度180--------lixl-----------------------------
      if(o.isUnique){//特殊样式，高度动态调整
    	  	
    	  	var liHeight = 25;//每個li的高度25,默認
			var liAllHeight = liHeight*liNumber;//li總高度
			//为了去除上下拉宽和左右拉宽
			$container.scrollTop(0).height(liAllHeight+6);
			//因为之前有一块留白，现在把ul背景色直接设置为同样背景色
			 this.menu.find('ul').last().css("background","#8ac0e7");
			 
      }else{
    	  $container.scrollTop(0).height(180);
      }
      // positon
      if(o.isUnique){
    	  
      }
      this.position();

      // show the menu, maybe with a speed/effect combo
      $.fn.show.apply(menu, args);

      // select the first option
      // triggering both mouseover and mouseover because 1.4.2+ has a bug where triggering mouseover
      // will actually trigger mouseenter.  the mouseenter trigger is there for when it's eventually fixed
      
      //源码修改，屏蔽此段代码，默认在第一行加上ui-state-active样式
      /*   this.labels.eq(0).trigger('mouseover').trigger('mouseenter').find('input').trigger('focus');
      button.addClass('ui-state-active');*/
      this._isOpen = true;
      this._trigger('open');
    },

    // close the menu
    close: function() {
      if(this._trigger('beforeclose') === false) {
        return;
      }

      var o = this.options;
      var effect = o.hide;
      var speed = this.speed;
      var args = [];

      // figure out opening effects/speeds
      if($.isArray(o.hide)) {
        effect = o.hide[0];
        speed = o.hide[1] || this.speed;
      }

      if(effect) {
        args = [ effect, speed ];
      }

      $.fn.hide.apply(this.menu, args);
      if(!o.isUnique){
    	  
    	  this.button.removeClass('ui-state-active').trigger('blur').trigger('mouseleave');
      }else{
    	  this.button.removeClass('ui-multiselect-unique-active').trigger('blur').trigger('mouseleave');
      }
      this._isOpen = false;
      this._trigger('close');
    },

    enable: function() {
      this._toggleDisabled(false);
    },

    disable: function() {
      this._toggleDisabled(true);
    },
    
   /* visiable: function(){
    	this._toggleDisabled(true);
    	1wdsd
    }*/

    checkAll: function(e) {
      this._toggleChecked(true);
      this._trigger('checkAll');
    },

    uncheckAll: function() {
      this._toggleChecked(false);
      this._trigger('uncheckAll');
    },

  /*  getChecked: function() {
      return this.menu.find('input').filter(':checked');
    },*/
    getChecked: function() {
        //return this.menu.find('input').filter(':checked');
      	//---------by yangzy 20130516----------------//
      	if (this.options.multiple == false) {//----分组时单选选------//
             
              var $checked = this.inputs.filter(':checked');
                      	
          	var ipt = null;
          	for (var i=0; i<$checked.length; i++) {//---只选择active
          		ipt = $checked[i];        		
          		if ($(ipt).parents('label.ui-state-active').length == 1) {
              		break;
          		}
          	}
          	return $(ipt);
          } else {
          	return this.menu.find('input').filter(':checked');
          }    	
      },

    destroy: function() {
      // remove classes + data
      $.Widget.prototype.destroy.call(this);

      // unbind events
      $doc.unbind(this._namespaceID);

      this.button.remove();
      this.menu.remove();
      this.element.show();

      return this;
    },

    isOpen: function() {
      return this._isOpen;
    },

    widget: function() {
      return this.menu;
    },

    getButton: function() {
      return this.button;
    },

    position: function() {
      var o = this.options;

      // use the position utility if it exists and options are specifified
      if($.ui.position && !$.isEmptyObject(o.position)) {
    	  alert(1);
        o.position.of = o.position.of || button;

        this.menu
          .show()
          .position(o.position)
          .hide();

        // otherwise fallback to custom positioning
      } else {
//    	  alert(2);
        var pos = this.button.offset();

       
        //----by lixl -----修改源码，添加对齐方式选项，divAlignRight：如果配置了false则为左对齐
	      if(o.divAlignRight){//如果不是右对齐，则调整menu的位置
	    	  this.menu.css({
	              top: pos.top + this.button.outerHeight(),
	              left: pos.left
	            });
	   	 }else{
	   		 var a = this.button.width();//文本框宽度
	   		 var b = this.menu.width();//下拉框宽度
	   		 var c = pos.left;//文本框的左边距
	   		 var y = (a+c)-b;
	   		 this.menu.css({
	   			 top: pos.top + this.button.outerHeight(),
	   			 left:y+'px'});
	   	 }
      //-----------by lixl  end----------------------------
      }
    },

    // react to option changes after initialization
    _setOption: function(key, value) {
      var menu = this.menu;

      switch(key) {
        case 'header':
          menu.find('div.ui-multiselect-header')[value ? 'show' : 'hide']();
          break;
        case 'checkAllText':
          menu.find('a.ui-multiselect-all span').eq(-1).text(value);
          break;
        case 'uncheckAllText':
          menu.find('a.ui-multiselect-none span').eq(-1).text(value);
          break;
        case 'height':
          menu.find('ul').last().height(parseInt(value, 10));
          break;
        case 'minWidth':
          this.options[key] = parseInt(value, 10);
          this._setButtonWidth();
          this._setMenuWidth();
          break;
//        case 'selectedWidth':
//        	alert(key);
//        	alert(this.options[key]);
//        	break;
        case 'selectedText':
        case 'selectedList':
        case 'noneSelectedText':
          this.options[key] = value; // these all needs to update immediately for the update() call
          this.update();
          break;
        case 'classes':
          menu.add(this.button).removeClass(this.options.classes).addClass(value);
          break;
        case 'multiple':
          menu.toggleClass('ui-multiselect-single', !value);
          this.options.multiple = value;
          this.element[0].multiple = value;
          this.refresh();
          break;
        case 'position':
          this.position();
      }

      $.Widget.prototype._setOption.apply(this, arguments);
    }
  });

})(jQuery);
