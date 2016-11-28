# Summary
Returns DOM node with matching `id` attribute or falsy value (ex: null or undefined) if not found.  If `id` is a DomNode, this function is a no-op.

# params
* id: String|DOMNode

    A string to match an HTML id attribute or a reference to a DOM Node
* doc: Document?

    Document to work in. Defaults to the current value of dojo/_base/window.doc.  Can be used to retrieve node references from other documents.

# example
Look up a node by ID:

````
require(["dojo/dom"], function(dom){  
    var n = dom.byId("foo");  
});  
````
