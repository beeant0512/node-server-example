/**
 * Created by beeant on 2016/11/21.
 */
require([
  "dojo/dom",
  "dojo/dom-construct",
  "dojo/ready",
  "dojo/on",
  "dojo/query",
  "dojo/dom-class",
  "dojo/dom-attr",
  "dojo/request",
  "dojo/json",
  "dojo/store/Memory",
  "dijit/tree/ObjectStoreModel",
  "dijit/Tree",
  "dojo/text!./_static/js/dojo-ext/template/MenuRoot.html",
  "dojo/text!./_static/js/dojo-ext/template/MenuNode.html",
  "dojo/_base/event",
  "dojo/_base/array",
  "dojox/dtl",
  "dojox/dtl/Context",
  "dojox/dtl/tag/logic",
  "dijit/layout/BorderContainer",
  "dijit/layout/TabContainer",
  "dojox/layout/ContentPane",
  "dijit/registry",
  "dojo/_base/declare",
  "dojo/NodeList-dom",
  "dojo/parser"
], function (dom, domConstruct, ready, on, query, domClass, domAttr, request, JSON, Memory, ObjectStoreModel, Tree, menuTemplate, menuNodeTemplate, event, array, dtl, Context, logic, BorderContainer, TabContainer, ContentPane, registry, declare) {
  ready(function () {
    request.post("/app/menu").then(
      function (appMenu) {
        var appMenu = JSON.parse(appMenu);
        var context = new Context({menus: appMenu});
        declare("MenuTreeNode", Tree._TreeNode, {});
        declare("MenuTree", Tree, {
          focusNode: function (node) {
            this.inherited(arguments);
            this.dndController.setSelection([node]);
          },

          _createTreeNode: function (args) {
            args.templateString = menuNodeTemplate;
            return new MenuTreeNode(args);
          }
        });

        var tabs = registry.byId("tabContainer");

        var template = new dtl.Template(dom.byId('menuTemplate').value);
        /* top menus */
        dom.byId('topMenu').innerHTML = template.render(context);
        var menuLi = query('#topMenu li');
        menuLi.on("click", function (e) {
          menuLi.removeClass("active");
          domClass.add(this, 'active');
          var menuId = domAttr.get(this, 'data-id');
          var menuTreeId = "leftSideMenu" + menuId;
          var existingMenuTree = registry.byId(menuTreeId);
          query('.sub-menu.dojoDndContainer').addClass('hidden');
          if (existingMenuTree) {
            domClass.remove(dom.byId(menuTreeId), 'hidden');
          } else {
            domConstruct.place("<div id='" + menuTreeId + "'></div>", "leftSideMenu", "after");
            // set up the store to get the tree data
            var subMenu = [];
            array.forEach(appMenu, function (data, index) {
              if(data.id == menuId){
                subMenu = data;
                return false;
              }
            });
            console.log(subMenu);
            console.log(menuId);
            var menuStore = new Memory({
              data: [subMenu],
              getChildren: function (object) {
                return object.children || [];
              }
            });

            // set up the model, assigning governmentStore, and assigning method to identify leaf nodes of tree
            var menuModel = new ObjectStoreModel({
              store: menuStore,
              query: {id: menuId},
              mayHaveChildren: function (item) {
                return "children" in item;
              }
            });
            menuTree = new MenuTree({
              model: menuModel,
              templateString: menuTemplate,
              onOpenClick: true,
              onClick: function (item) {
                if (item.link) {
                  var existingPane = registry.byId(item.id);
                  if (existingPane) {
                    tabs.selectChild(existingPane);
                    return existingPane;
                  }
                  var pane = new ContentPane({
                    "title": item.name,
                    "href": item.link + ";onlybody=true",
                    "id": item.id,
                    closable: true
                  });
                  tabs.addChild(pane);
                  tabs.selectChild(pane);
                }
              }
            }, menuTreeId);
            menuTree.startup();

          }
          event.stop(e); // prevents default link execution
        });
      },
      function (error) {
        console.log("An error occurred: " + error);
      }
    );


  })
});