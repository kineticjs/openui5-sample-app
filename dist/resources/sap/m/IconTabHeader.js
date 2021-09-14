/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","sap/ui/core/Core","sap/ui/core/Control","sap/ui/core/EnabledPropagator","sap/ui/core/delegate/ItemNavigation","sap/ui/core/IconPool","sap/ui/core/delegate/ScrollEnablement","./IconTabBarSelectList","./Button","./AccButton","./ResponsivePopover","./IconTabFilter","sap/ui/Device","sap/ui/core/ResizeHandler","./IconTabBarDragAndDropUtil","./IconTabHeaderRenderer","sap/ui/thirdparty/jquery","sap/base/Log","sap/ui/events/KeyCodes"],function(e,t,i,o,s,r,a,n,l,h,c,p,d,f,g,u,_,m,v){"use strict";var I=e.touch;var y=e.PlacementType;var S=e.ButtonType;var b=e.BackgroundDesign;var T=e.IconTabHeaderMode;var w=e.IconTabDensityMode;var C=i.extend("sap.m.IconTabHeader",{metadata:{library:"sap.m",properties:{showSelection:{type:"boolean",group:"Misc",defaultValue:true,deprecated:true},selectedKey:{type:"string",group:"Data",defaultValue:null},visible:{type:"boolean",group:"Behavior",defaultValue:true},mode:{type:"sap.m.IconTabHeaderMode",group:"Appearance",defaultValue:T.Standard},showOverflowSelectList:{type:"boolean",group:"Appearance",defaultValue:false},backgroundDesign:{type:"sap.m.BackgroundDesign",group:"Appearance",defaultValue:b.Solid},enableTabReordering:{type:"boolean",group:"Behavior",defaultValue:false},tabDensityMode:{type:"sap.m.IconTabDensityMode",group:"Appearance",defaultValue:w.Cozy}},aggregations:{items:{type:"sap.m.IconTab",multiple:true,singularName:"item",dnd:{draggable:true,droppable:true,layout:"Horizontal"}},_overflowButton:{type:"sap.m.Button",multiple:false,visibility:"hidden"},_leftArrowButton:{type:"sap.m.Button",multiple:false,visibility:"hidden"},_rightArrowButton:{type:"sap.m.Button",multiple:false,visibility:"hidden"}},events:{select:{parameters:{item:{type:"sap.m.IconTabFilter"},key:{type:"string"}}}}}});var B=sap.ui.getCore().getLibraryResourceBundle("sap.m");o.apply(C.prototype,[true]);C.SCROLL_STEP=264;C.prototype._ARROWS={Left:"Left",Right:"Right"};C.prototype.init=function(){this._bPreviousScrollForward=false;this._bPreviousScrollBack=false;this._iCurrentScrollLeft=0;this.startScrollX=0;this.startTouchX=0;this._scrollable=null;this._aTabKeys=[];this._oItemNavigation=(new s).setCycling(false);this._oItemNavigation.attachEvent(s.Events.FocusLeave,this._onItemNavigationFocusLeave,this);this._oItemNavigation.attachEvent(s.Events.AfterFocus,this._onItemNavigationAfterFocus,this);this._oItemNavigation.setDisabledModifiers({sapnext:["alt","meta"],sapprevious:["alt","meta"]});this.addDelegate(this._oItemNavigation);this._oScroller=new a(this,this.getId()+"-head",{horizontal:true,vertical:false,nonTouchScrolling:true})};C.prototype.isTouchScrollingDisabled=function(){return this.getShowOverflowSelectList()&&this.getParent().getMetadata().getName()=="sap.tnt.ToolHeader"};C.prototype._getSelectList=function(){var e=this;if(!this._oSelectList){this._oSelectList=new n({selectionChange:function(t){var i=t.getParameter("selectedItem");e.setSelectedItem(i._tabFilter)}});this._oSelectList._iconTabHeader=this}return this._oSelectList};C.prototype._getOverflowButton=function(){var e=this.getAggregation("_overflowButton");if(!e){e=new l({id:this.getId()+"-overflow",icon:"sap-icon://slim-arrow-down",type:S.Transparent,press:this._overflowButtonPress.bind(this)});e.addEventDelegate(this._onOverflowButtonEventDelegate);this.setAggregation("_overflowButton",e)}return e};C.prototype._overflowButtonPress=function(e){if(!this._oPopover){this._oPopover=new c({showArrow:false,showHeader:false,placement:y.Vertical,offsetX:0,offsetY:0}).addStyleClass("sapMITBPopover");if(d.system.phone){this._oPopover._oControl.addButton(this._createPopoverCloseButton())}this.addDependent(this._oPopover);this._oPopover._oControl._adaptPositionParams=function(){var e=_("body").hasClass("sapUiSizeCompact");this._arrowOffset=0;if(e){this._offsets=["0 0","0 0","0 2","0 0"]}else{this._offsets=["0 0","0 0","0 3","0 0"]}this._myPositions=["end bottom","begin top","end top","end top"];this._atPositions=["end top","end top","end bottom","begin top"]}}var t=this._getSelectList();this._setSelectListItems();this._oPopover.removeAllContent();this._oPopover.addContent(t);this._oPopover.setInitialFocus(t.getSelectedItem());this._oPopover.openBy(this._getOverflowButton())};C.prototype._createPopoverCloseButton=function(){var e=this;return new l({text:B.getText("SELECT_CANCEL_BUTTON"),press:function(){e._closeOverflow()}})};C.prototype._closeOverflow=function(){if(!d.system.desktop){this._oPopover.close()}if(this.oSelectedItem){this.oSelectedItem.$().focus()}};C.prototype._setSelectListItems=function(){if(!this.getShowOverflowSelectList()){return}var e,t,i=this._getSelectList(),o=this.getTabFilters();i.destroyItems();for(var s=0;s<o.length;s++){t=o[s];e=t.clone(undefined,undefined,{bCloneChildren:false,bCloneBindings:true});e._tabFilter=t;i.addItem(e);if(t==this.oSelectedItem){i.setSelectedItem(e)}}};C.prototype._findSelectItem=function(e){var t=this._getSelectList(),i=t.getItems(),o;for(var s=0;s<i.length;s++){o=i[s];if(o._tabFilter==e){return o}}};C.prototype._onItemNavigationFocusLeave=function(){if(!this.oSelectedItem){return}var e=this.getItems();var t=-1;var i;for(var o=0;o<e.length;o++){i=e[o];if(i instanceof p==false){continue}t++;if(this.oSelectedItem==i){break}}this._oItemNavigation.setFocusedIndex(t)};C.prototype._onItemNavigationAfterFocus=function(e){var t=this.getDomRef("head"),i=e.getParameter("index"),o=e.getParameter("event");if(o.keyCode===undefined){return}this._iCurrentScrollLeft=t.scrollLeft;this._checkOverflow();if(i!==null&&i!==undefined){this._scrollIntoView(this.getTabFilters()[i],0)}};C.prototype.getTabFilters=function(){var e=this.getItems();var t=[];e.forEach(function(e){if(e instanceof p){t.push(e)}});return t};C.prototype.exit=function(){if(this._oItemNavigation){this.removeDelegate(this._oItemNavigation);this._oItemNavigation.destroy();delete this._oItemNavigation}if(this._oScroller){this._oScroller.destroy();this._oScroller=null}if(this._sResizeListenerId){f.deregister(this._sResizeListenerId);this._sResizeListenerId=null}if(this._aTabKeys){this._aTabKeys=null}if(this._oPopover){this._oPopover.destroy();this._oPopover=null}};C.prototype._handleOnLongDragOver=function(){if(!this._oPopover||!this._oPopover.isOpen()){this._overflowButtonPress()}};C.prototype._handleOnDragOver=function(e){this._getOverflowButton().addStyleClass("sapMBtnDragOver");e.preventDefault()};C.prototype._handleOnDrop=function(){this._getOverflowButton().removeStyleClass("sapMBtnDragOver")};C.prototype._handleOnDragLeave=function(){this._getOverflowButton().removeStyleClass("sapMBtnDragOver")};C.prototype._setsDragAndDropConfigurations=function(){if(!this.getEnableTabReordering()&&this.getDragDropConfig().length){this.destroyDragDropConfig()}else if(this.getEnableTabReordering()&&!this.getDragDropConfig().length){g.setDragDropAggregations(this,"Horizontal")}};C.prototype.onBeforeRendering=function(){this._bRtl=t.getConfiguration().getRTL();this._onOverflowButtonEventDelegate={onlongdragover:this._handleOnLongDragOver.bind(this),ondragover:this._handleOnDragOver.bind(this),ondragleave:this._handleOnDragLeave.bind(this),ondrop:this._handleOnDrop.bind(this)};if(this._sResizeListenerId){f.deregister(this._sResizeListenerId);this._sResizeListenerId=null}this._updateSelection();this._isTouchScrollingDisabled=this.isTouchScrollingDisabled();this._oScroller.setHorizontal(!this._isTouchScrollingDisabled&&(!this.getEnableTabReordering()||!d.system.desktop));this._setsDragAndDropConfigurations()};C.prototype.setSelectedKey=function(e){var t=this.getTabFilters(),i=0,o=this._isInsideIconTabBar(),s;if(t.length>0){e=e||t[0]._getNonEmptyKey()}if(this.$().length){for(;i<t.length;i++){if(t[i]._getNonEmptyKey()===e){this.setSelectedItem(t[i],true);s=true;break}}if(!s&&!o&&e){this.setSelectedItem(null)}}this.setProperty("selectedKey",e,true);return this};C.prototype.setSelectedItem=function(e,t){if(!e){if(this.oSelectedItem){this.oSelectedItem.$().removeClass("sapMITBSelected");this.oSelectedItem=null}return this}if(!e.getEnabled()){return this}if(this.getShowOverflowSelectList()){var i=this._findSelectItem(e);if(i){this._getSelectList().setSelectedItem(i)}}var o=this.getParent();var s=this._isInsideIconTabBar();var r=false;if(e.getContent().length===0&&this.oSelectedItem&&this.oSelectedItem.getContent().length===0){r=true}if(this.oSelectedItem&&this.oSelectedItem.getVisible()&&(!t&&s&&o.getExpandable()||this.oSelectedItem!==e)){this.oSelectedItem.$().removeClass("sapMITBSelected").attr("aria-selected",false).removeAttr("aria-expanded")}if(e.getVisible()){if(this.oSelectedItem===e){if(!t&&s&&o.getExpandable()){o._toggleExpandCollapse()}}else{if(s){o.$("content").attr("aria-labelledby",e.sId)}this.oSelectedItem=e;this.setProperty("selectedKey",this.oSelectedItem._getNonEmptyKey(),true);if(!s){this.oSelectedItem.$().addClass("sapMITBSelected").attr({"aria-selected":true})}if(s&&(o.getExpandable()||o.getExpanded())){this.oSelectedItem.$().addClass("sapMITBSelected").attr({"aria-selected":true});var a=this.oSelectedItem.getContent();if(a.length>0){o._rerenderContent(a)}else{if(!r){o._rerenderContent(o.getContent())}}if(!t&&o.getExpandable()&&!o.getExpanded()){o._toggleExpandCollapse(true)}}}if(this.oSelectedItem.$().length>0){this._scrollIntoView(e,500)}else{this._scrollAfterRendering=true}}this.oSelectedItem=e;var n=this.oSelectedItem._getNonEmptyKey();this.setProperty("selectedKey",n,true);if(s){o.setProperty("selectedKey",n,true)}if(!t){if(s){o.fireSelect({selectedItem:this.oSelectedItem,selectedKey:n,item:this.oSelectedItem,key:n})}else{this.fireSelect({selectedItem:this.oSelectedItem,selectedKey:n,item:this.oSelectedItem,key:n})}}return this};C.prototype.getVisibleTabFilters=function(){var e=this.getTabFilters(),t=[],i;for(var o=0;o<e.length;o++){i=e[o];if(i.getVisible()){t.push(i)}}return t};C.prototype._getFirstVisibleItem=function(e){for(var t=0;t<e.length;t++){if(e[t].getVisible()){return e[t]}}return null};C.prototype._initItemNavigation=function(){var e=this,t=this.getDomRef("head"),i=this.getItems(),o=[],r=-1;i.forEach(function(t){if(t instanceof p){var i=e.getFocusDomRef(t);_(i).attr("tabindex","-1");o.push(i);if(t===e.oSelectedItem){r=o.indexOf(i)}}});if(!this._oItemNavigation){this._oItemNavigation=new s;this._oItemNavigation.attachEvent(s.Events.FocusLeave,this._onItemNavigationFocusLeave,this);this._oItemNavigation.attachEvent(s.Events.AfterFocus,this._onItemNavigationAfterFocus,this);this.addDelegate(this._oItemNavigation)}this._oItemNavigation.setRootDomRef(t);this._oItemNavigation.setItemDomRefs(o);this._oItemNavigation.setPageSize(o.length);this._oItemNavigation.setSelectedIndex(r)};C.prototype.onThemeChanged=function(){this._applyTabDensityMode()};C.prototype._applyTabDensityMode=function(){var e=this.getTabDensityMode();this.$().removeClass("sapUiSizeCompact");switch(e){case w.Compact:this.$().addClass("sapUiSizeCompact");break;case w.Inherit:if(this.$().closest(".sapUiSizeCompact").length){this.$().addClass("sapUiSizeCompact")}break}};C.prototype.onAfterRendering=function(){this._applyTabDensityMode();if(this._oScroller){this._oScroller.setIconTabBar(this,_.proxy(this._afterIscroll,this),_.proxy(this._scrollPreparation,this))}var e=this.getParent();var i=this._isInsideIconTabBar();if(this.oSelectedItem&&(!i||i&&e.getExpanded())){this.oSelectedItem.$().addClass("sapMITBSelected").attr({"aria-selected":true})}if(t.isThemeApplied()){setTimeout(this["_checkOverflow"].bind(this),350);if(this.oSelectedItem){this._scrollIntoView(this.oSelectedItem,500)}}else{t.attachThemeChanged(this._handleThemeLoad,this)}this._initItemNavigation();if(this.getShowOverflowSelectList()){this.$("overflow").attr("tabindex",-1)}this._sResizeListenerId=f.register(this.getDomRef(),_.proxy(this._fnResize,this));this._bCheckIfIntoView=true};C.prototype._handleThemeLoad=function(){setTimeout(this["_checkOverflow"].bind(this),350);if(this.oSelectedItem){this._scrollIntoView(this.oSelectedItem,500)}t.detachThemeChanged(this._handleThemeLoad,this)};C.prototype.destroyItems=function(){this.oSelectedItem=null;this._aTabKeys=[];this.destroyAggregation("items");return this};C.prototype.addItem=function(e){if(!(e instanceof sap.m.IconTabSeparator)){var t=e.getKey();if(this._aTabKeys.indexOf(t)!==-1){m.warning("sap.m.IconTabHeader: duplicate key '"+t+"' inside the IconTabFilter. Please use unique keys.")}this._aTabKeys.push(t)}this.addAggregation("items",e);this._invalidateParentIconTabBar()};C.prototype.insertItem=function(e,t){if(!(e instanceof sap.m.IconTabSeparator)){var i=e.getKey();if(this._aTabKeys.indexOf(i)!==-1){m.warning("sap.m.IconTabHeader: duplicate key '"+i+"' inside the IconTabFilter. Please use unique keys.")}this._aTabKeys.push(i)}this.insertAggregation("items",e,t);this._invalidateParentIconTabBar()};C.prototype.removeAllItems=function(){var e=this.removeAllAggregation("items");this._aTabKeys=[];this.oSelectedItem=null;this._invalidateParentIconTabBar();return e};C.prototype.removeItem=function(e){e=this.removeAggregation("items",e);if(e&&!(e instanceof sap.m.IconTabSeparator)){var t=e.getKey();this._aTabKeys.splice(this._aTabKeys.indexOf(t),1)}if(this.oSelectedItem===e){this.oSelectedItem=null}this._invalidateParentIconTabBar();return e};C.prototype.updateAggregation=function(){this.oSelectedItem=null;i.prototype.updateAggregation.apply(this,arguments);this.invalidate()};C.prototype.removeAggregation=function(e,t,o){var s=this.getTabFilters();var r=i.prototype.removeAggregation.apply(this,arguments);if(o){return r}if(r&&r==this.oSelectedItem&&e=="items"){var a=s?Array.prototype.indexOf.call(s,r):-1;s=this.getTabFilters();a=Math.max(0,Math.min(a,s.length-1));var n=s[a];if(n){this.setSelectedItem(n,true)}else{var l=this.getParent();if(this._isInsideIconTabBar()&&l.getExpanded()){l.$("content").children().remove()}}}return r};C.prototype.removeAllAggregation=function(e,t){if(e=="items"){var o=this.getParent();if(this._isInsideIconTabBar()&&o.getExpanded()){o.$("content").children().remove()}}return i.prototype.removeAllAggregation.apply(this,arguments)};C.prototype._getDisplayText=function(e){var t=e.getText();if(this.isInlineMode()){var i=e.getCount();if(i){if(this._bRtl){t="("+i+") "+t}else{t+=" ("+i+")"}}}return t};C.prototype.isInlineMode=function(){return this._bTextOnly&&this.getMode()==T.Inline};C.prototype._checkTextOnly=function(e){if(e.length>0){for(var t=0;t<e.length;t++){if(!(e[t]instanceof sap.m.IconTabSeparator)){if(e[t].getIcon()){this._bTextOnly=false;return false}}}}this._bTextOnly=true;return true};C.prototype._checkNoText=function(e){if(e.length>0){for(var t=0;t<e.length;t++){if(!(e[t]instanceof sap.m.IconTabSeparator)){if(e[t].getText().length>0){return false}}}}return true};C.prototype._checkInLine=function(e){var t;if(e.length>0){for(var i=0;i<e.length;i++){t=e[i];if(!(t instanceof sap.m.IconTabSeparator)){if(t.getIcon()||t.getCount()){this._bInLine=false;return false}}}}this._bInLine=true;return true};C.prototype._checkScrolling=function(e){var t=this.$();var i=false;var o=this.getDomRef("scrollContainerInner");var s=this.getDomRef("head");if(s&&o){if(s.offsetWidth>o.offsetWidth){i=true}}if(this._scrollable!==i){t.toggleClass("sapMITBScrollable",i);t.toggleClass("sapMITBNotScrollable",!i);this._scrollable=i}this._setTabsVisibility();return i};C.prototype._getScrollButton=function(e){var t="_"+e.toLowerCase()+"ArrowButton";if(this.getAggregation(t)){return this.getAggregation(t)}var i=e===this._ARROWS.Left?"TABSTRIP_SCROLL_BACK":"TABSTRIP_SCROLL_FORWARD";var o=B.getText(i);var s=r.getIconURI("slim-arrow-"+e.toLowerCase());var a=new h(this.getId()+"-arrowScroll"+e,{type:S.Transparent,icon:s,tooltip:o,tabIndex:"-1",ariaHidden:"true",press:this._onScrollButtonPress.bind(this,e)});this.setAggregation(t,a);return this.getAggregation(t)};C.prototype._onScrollButtonPress=function(e){var t=e===this._ARROWS.Left?C.SCROLL_STEP:-C.SCROLL_STEP;if(this._bRtl){t=-t}var i=this._oScroller.getScrollLeft()-t;if(e===this._ARROWS.Left){if(i<0){i=0}}else{var o=this.$("scrollContainerInner").width();var s=this.$("head").width();if(i>s-o){i=s-o}}this._scrollPreparation();setTimeout(this._oScroller["scrollTo"].bind(this._oScroller,i,0,500),0);setTimeout(this["_afterIscroll"].bind(this),500)};C.prototype._checkOverflow=function(){if(this.bIsDestroyed){return}var e=this.getDomRef("head");var t=this.$();if(this._checkScrolling(e)&&e){var i=false;var o=false;var s=this.getDomRef("scrollContainerInner");var r=this.getDomRef("head");if(this._oScroller.getScrollLeft()>0){if(this._bRtl){o=true}else{i=true}}if(this._oScroller.getScrollLeft()+s.offsetWidth<r.offsetWidth){if(this._bRtl){i=true}else{o=true}}if(o!=this._bPreviousScrollForward||i!=this._bPreviousScrollBack){this._bPreviousScrollForward=o;this._bPreviousScrollBack=i;t.toggleClass("sapMITBScrollBack",i);t.toggleClass("sapMITBNoScrollBack",!i);t.toggleClass("sapMITBScrollForward",o);t.toggleClass("sapMITBNoScrollForward",!o)}}else{this._bPreviousScrollForward=false;this._bPreviousScrollBack=false}};C.prototype._handleActivation=function(e){var i=e.target.id,o=e.srcControl,s,r=_(e.target);if(o instanceof l){return}var a=_(document.getElementById(i));if(a.parents()&&Array.prototype.indexOf.call(a.parents(),this.$("content")[0])>-1){}else{if(i){e.preventDefault();if(r.hasClass("sapMITBFilterIcon")||r.hasClass("sapMITBCount")||r.hasClass("sapMITBText")||r.hasClass("sapMITBTab")||r.hasClass("sapMITBContentArrow")||r.hasClass("sapMITBSep")||r.hasClass("sapMITBSepIcon")){s=e.srcControl.getId().replace(/-icon$/,"");o=t.byId(s);if(o.getMetadata().isInstanceOf("sap.m.IconTab")&&!(o instanceof sap.m.IconTabSeparator)){this.setSelectedItem(o)}}else if(o.getMetadata().isInstanceOf("sap.m.IconTab")&&!(o instanceof sap.m.IconTabSeparator)){this.setSelectedItem(o)}}else{if(o.getMetadata().isInstanceOf("sap.m.IconTab")&&!(o instanceof sap.m.IconTabSeparator)){this.setSelectedItem(o)}}}};C.prototype._scrollIntoView=function(e,t){if(this.bIsDestroyed||!e.$().length){return}var i=e.$(),o=this._oScroller.getScrollLeft(),s=this.$("scrollContainerInner").width(),r=i.outerWidth(true),a=i.position().left,n=this._bPreviousScrollBack?this._getScrollButton(this._ARROWS.Left).$().width():0,l=this.getShowOverflowSelectList()?this._getOverflowButton().$().width():0,h;if(a-o<0||a-o>s-r){if(a-o<0){h=a-n}else{h=Math.min(a,a+r-s+l);h=Math.round(h)}this._scrollPreparation();this._iCurrentScrollLeft=h;setTimeout(this._oScroller["scrollTo"].bind(this._oScroller,h,0,t),0);setTimeout(this["_afterIscroll"].bind(this),t)}};C.prototype._scroll=function(e,t){this._scrollPreparation();var i=this.getDomRef("head");var o=i.scrollLeft;var s=d.browser.msie||d.browser.edge;if(!s&&this._bRtl){e=-e}var r=o+e;_(i).stop(true,true).animate({scrollLeft:r},t,_.proxy(this._adjustAndShowArrow,this));this._iCurrentScrollLeft=r};C.prototype._adjustAndShowArrow=function(){this._$bar&&this._$bar.toggleClass("sapMITBScrolling",false);this._$bar=null;if(d.system.desktop){this._checkOverflow()}};C.prototype._scrollPreparation=function(){if(!this._$bar){this._$bar=this.$().toggleClass("sapMITBScrolling",true)}};C.prototype._afterIscroll=function(){this._checkOverflow();this._adjustAndShowArrow();this._setTabsVisibility()};C.prototype._fnResize=function(){this._checkOverflow();if(this.oSelectedItem&&this._bCheckIfIntoView){this._scrollIntoView(this.oSelectedItem,0);if(!this._isTouchScrollingDisabled){this._bCheckIfIntoView=false}}this._setTabsVisibility()};C.prototype._isInsideIconTabBar=function(){var e=this.getParent();return e instanceof i&&e.isA("sap.m.IconTabBar")};C.prototype._invalidateParentIconTabBar=function(){if(this._isInsideIconTabBar()){this.getParent().invalidate()}};C.prototype._setTabsVisibility=function(){if(!this._isTouchScrollingDisabled){return}var e=this.getItems(),t,i,o,s;for(s=0;s<e.length;s++){t=e[s];i=t.$();if(!i.hasClass("sapMITBSelected")&&!this._isTabIntoView(i)){i.addClass("sapMITBFilterHidden")}else{o=true;i.removeClass("sapMITBFilterHidden")}}if(!o){for(s=0;s<e.length;s++){t=e[s];i=t.$();if(this._isTabIntoView(i,true)){i.removeClass("sapMITBFilterHidden");break}}}this._moveVisibleTabs()};C.prototype._isTabIntoView=function(e,t){if(!e.length){return false}var i=this._oScroller.getScrollLeft(),o=this.$("scrollContainerInner").width(),s=this.$("head"),r=s.innerWidth()-s.width(),a=e.css("padding-left"),n=e.width()+parseFloat(a),l=Math.ceil(e.position().left-r/2);if(l-i<0||!t&&l+n-i>o){return false}return true};C.prototype._moveVisibleTabs=function(){if(!this._oScroller){return}var e=this._oScroller.getScrollLeft(),t=this.$("head"),i=t.innerWidth()-t.width(),o=this.$().find(".sapMITBFilter:not(.sapMITBFilterHidden)").first(),s,r;if(!o.length){return}r=o.position().left-i/2;if(!this._bRtl&&r-e>2){s=e-r;t.css("transform","translate("+s+"px)")}else{t.css("transform","")}return true};C.prototype.getFocusDomRef=function(e){var t=e||this.oSelectedItem;if(!t){return null}return t.getDomRef()};C.prototype.applyFocusInfo=function(e){if(e.focusDomRef){_(e.focusDomRef).focus()}};C.prototype._updateSelection=function(){var e=this.getItems(),t=this.getSelectedKey(),i=0,o=this.getParent(),s=this._isInsideIconTabBar(),r=o&&o.getMetadata().getName()=="sap.tnt.ToolHeader";if(e.length>0){if(!this.oSelectedItem||t&&t!==this.oSelectedItem._getNonEmptyKey()){if(t){for(;i<e.length;i++){if(!(e[i]instanceof sap.m.IconTabSeparator)&&e[i]._getNonEmptyKey()===t){this.oSelectedItem=e[i];break}}}if(!this.oSelectedItem&&(s||!t)){for(i=0;i<e.length;i++){if(!(e[i]instanceof sap.m.IconTabSeparator)&&e[i].getVisible()){this.oSelectedItem=e[i];break}}}}if(!r&&this.oSelectedItem&&!this.oSelectedItem.getVisible()){for(i=0;i<e.length;i++){if(!(e[i]instanceof sap.m.IconTabSeparator)&&e[i].getVisible()){this.oSelectedItem=e[i];break}}}if(this.oSelectedItem){this.setProperty("selectedKey",this.oSelectedItem._getNonEmptyKey(),true)}}};C.prototype.ontouchstart=function(e){var t=e.targetTouches[0];this._iActiveTouch=t.identifier;this._iTouchStartPageX=t.pageX;this._iTouchStartPageY=t.pageY;this._iTouchDragX=0;this._iTouchDragY=0;var i=_(e.target);if(i.hasClass("sapMITBArrowScroll")){e.preventDefault()}};C.prototype.ontouchmove=function(e){if(this._iActiveTouch===undefined){return}var t=I.find(e.changedTouches,this._iActiveTouch);if(!t||t.pageX===this._iTouchStartPageX){return}this._iTouchDragX+=Math.abs(this._iTouchStartPageX-t.pageX);this._iTouchDragY+=Math.abs(this._iTouchStartPageY-t.pageY);this._iTouchStartPageX=t.pageX;this._iTouchStartPageY=t.pageY};C.prototype.ontouchend=function(e){if(this._iActiveTouch===undefined){return}var t=d.system.desktop?5:15;if(this._scrollable&&this._iTouchDragX>t||this._iTouchDragY>t){return}var i=0;var o=1;var s;if(e.which===s||e.which===i||e.which===o){this._handleActivation(e)}this._iActiveTouch=undefined};C.prototype.ontouchcancel=C.prototype.ontouchend;C.prototype.onkeydown=function(e){switch(e.which){case v.ENTER:this._handleActivation(e);e.preventDefault();break;case v.SPACE:e.preventDefault();break}};C.prototype.onkeyup=function(e){if(e.which===v.SPACE){this._handleActivation(e);e.preventDefault()}};C.prototype._handleDragAndDrop=function(e){var t=e.getParameter("dropPosition"),i=e.getParameter("draggedControl"),o=e.getParameter("droppedControl"),s=i.getParent().getMetadata().getName()==="sap.m.IconTabBarSelectList";if(s){this._handleDragAndDropBetweenHeaderAndList(t,o,i)}else{g.handleDrop(this,t,i,o,false)}this._initItemNavigation();i.$().focus()};C.prototype._handleDragAndDropBetweenHeaderAndList=function(e,t,i){var o=this._getSelectList(),s=g.getDraggedDroppedItemsFromList(o.getAggregation("items"),i,t);if(!s){return}g.handleDrop(this,e,i._tabFilter,t,false);g.handleDrop(o,e,i,s.oDroppedControlFromList,false);o._initItemNavigation()};C.prototype._moveTab=function(e,t){var i=g.moveItem.call(this,e,t);this._initItemNavigation();if(i){this._scrollIntoView(e,0)}};C.prototype.ondragrearranging=function(e){if(!this.getEnableTabReordering()){return}var t=e.srcControl;this._moveTab(t,e.keyCode);t.$().focus()};C.prototype.onsaphomemodifiers=C.prototype.ondragrearranging;C.prototype.onsapendmodifiers=C.prototype.ondragrearranging;C.prototype.onsapincreasemodifiers=C.prototype.ondragrearranging;C.prototype.onsapdecreasemodifiers=C.prototype.ondragrearranging;return C});