//@ui5-bundle sap/ui/demo/todo/Component-preload.js
sap.ui.require.preload({
	"sap/ui/demo/todo/Boot.js":function(){sap.ui.define(["sap/ui/core/Core","sap/ui/core/library","sap/m/library"],function(e){"use strict";Promise.all([e.getLibraryResourceBundle("sap.ui.core",true),e.getLibraryResourceBundle("sap.m",true)]).then(function(){e.boot()})});
},
	"sap/ui/demo/todo/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/core/ComponentSupport"],function(e){"use strict";return e.extend("sap.ui.demo.todo.Component",{metadata:{manifest:"json"}})});
},
	"sap/ui/demo/todo/controller/App.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/model/Filter","sap/ui/model/FilterOperator"],function(e,t,r){"use strict";return e.extend("sap.ui.demo.todo.controller.App",{onInit:function(){this.aSearchFilters=[];this.aTabFilters=[]},addTodo:function(){var e=this.getView().getModel();var t=e.getProperty("/todos").map(function(e){return Object.assign({},e)});t.push({title:e.getProperty("/newTodo"),completed:false});e.setProperty("/todos",t);e.setProperty("/newTodo","")},clearCompleted:function(){var e=this.getView().getModel();var t=e.getProperty("/todos").map(function(e){return Object.assign({},e)});var r=t.length;while(r--){var i=t[r];if(i.completed){t.splice(r,1)}}e.setProperty("/todos",t)},updateItemsLeftCount:function(){var e=this.getView().getModel();var t=e.getProperty("/todos")||[];var r=t.filter(function(e){return e.completed!==true}).length;e.setProperty("/itemsLeftCount",r)},onSearch:function(e){var i=this.getView().getModel();this.aSearchFilters=[];var s=e.getSource().getValue();if(s&&s.length>0){i.setProperty("/itemsRemovable",false);var o=new t("title",r.Contains,s);this.aSearchFilters.push(o)}else{i.setProperty("/itemsRemovable",true)}this._applyListFilters()},onFilter:function(e){this.aTabFilters=[];var i=e.getParameter("item").getKey();switch(i){case"active":this.aTabFilters.push(new t("completed",r.EQ,false));break;case"completed":this.aTabFilters.push(new t("completed",r.EQ,true));break;case"all":default:}this._applyListFilters()},_applyListFilters:function(){var e=this.byId("todoList");var t=e.getBinding("items");t.filter(this.aSearchFilters.concat(this.aTabFilters),"todos")}})});
},
	"sap/ui/demo/todo/i18n/i18n.properties":'TITLE=todos\r\nINPUT_PLACEHOLDER=What needs to be done?\r\nITEM_LEFT=item left\r\nITEMS_LEFT=items left\r\nCLEAR_COMPLETED=Clear completed\r\n',
	"sap/ui/demo/todo/i18n/i18n_de.properties":'TITLE=Todos\r\nINPUT_PLACEHOLDER=Was muss getan werden?\r\nITEM_LEFT=Eintrag \\u00fcbrig\r\nITEMS_LEFT=Eintr\\u00e4ge \\u00fcbrig\r\nCLEAR_COMPLETED=Erledigte Eintr\\u00e4ge entfernen\r\n',
	"sap/ui/demo/todo/i18n/i18n_en.properties":'TITLE=todos\r\nINPUT_PLACEHOLDER=What needs to be done?\r\nITEM_LEFT=item left\r\nITEMS_LEFT=items left\r\nCLEAR_COMPLETED=Clear completed\r\n',
	"sap/ui/demo/todo/manifest.json":'{"_version":"1.12.0","sap.app":{"id":"sap.ui.demo.todo","type":"application"},"sap.ui5":{"dependencies":{"minUI5Version":"1.60.0","libs":{"sap.ui.core":{},"sap.m":{}}},"rootView":{"viewName":"sap.ui.demo.todo.view.App","type":"XML","async":true,"id":"app"},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"sap.ui.demo.todo.i18n.i18n"}},"":{"type":"sap.ui.model.json.JSONModel","uri":"model/todoitems.json"}},"resources":{"css":[{"uri":"css/styles.css"}]}}}',
	"sap/ui/demo/todo/model/todoitems.json":'{"newTodo":"","todos":[{"title":"Start this app","completed":true},{"title":"Learn OpenUI5","completed":false}],"itemsRemovable":true,"completedCount":1}',
	"sap/ui/demo/todo/view/App.view.xml":'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" controllerName="sap.ui.demo.todo.controller.App" displayBlock="true"><Shell><App><Page title="{i18n>TITLE}" backgroundDesign="List"><subHeader><Toolbar><SearchField\r\n\t\t\t\t\t\t\tid="searchTodoItemsInput"\r\n\t\t\t\t\t\t\tliveChange=".onSearch"\r\n\t\t\t\t\t\t\twidth="100%"/></Toolbar></subHeader><content><Input class="todoInput" id="addTodoItemInput" value="{/newTodo}" placeholder="{i18n>INPUT_PLACEHOLDER}" change=".addTodo"/><List id="todoList"\r\n\t\t\t\t\t\titems="{ path: \'/todos\', events: { change: \'.updateItemsLeftCount\' } }"\r\n\t\t\t\t\t\tmode="MultiSelect"\r\n\t\t\t\t\t\tgrowing="true"\r\n\t\t\t\t\t\tgrowingScrollToLoad="true"\r\n\t\t\t\t\t\tshowNoData="false"\r\n\t\t\t\t\t\tshowSeparators="None"\r\n\t\t\t\t\t\trememberSelections="false"><infoToolbar><Toolbar><Label id="itemsLeftLabel" text="{= ${/itemsLeftCount} === 1 ? ${/itemsLeftCount} + \' \' + ${i18n>ITEM_LEFT} : ${/itemsLeftCount} + \' \' + ${i18n>ITEMS_LEFT} }"/></Toolbar></infoToolbar><CustomListItem class="todoListItem" selected="{completed}"><Input enabled="{=!${completed}}" value="{title}"/></CustomListItem></List></content><footer><Bar><contentMiddle><SegmentedButton selectedKey="all" selectionChange=".onFilter" class="sapMSegmentedButtonNoAutoWidth"><items><SegmentedButtonItem id="filterButton-all" text="All" key="all"/><SegmentedButtonItem id="filterButton-active" text="Active" key="active"/><SegmentedButtonItem id="filterButton-completed" text="Completed" key="completed"/></items></SegmentedButton></contentMiddle><contentRight><Button id="clearCompleted" enabled="{/itemsRemovable}" icon="sap-icon://delete" text="{i18n>CLEAR_COMPLETED}" press=".clearCompleted"/></contentRight></Bar></footer></Page></App></Shell></mvc:View>\r\n'
});