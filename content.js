// Derivded from the code provided by Rob W <http://stackoverflow.com/users/938089/rob-w>
// Demo: var serialized_html = DOMtoString(document);

function DOMtoString(document_root) {
    var html = '',
        node = document_root.firstChild;
    while (node) {
        switch (node.nodeType) {
        case Node.ELEMENT_NODE:
            var text = node.innerHTML.trim();
            //Current version of Airtable API contains the Schema in <script> tag under the header.
            if( text.indexOf('window.application') !== -1)
            {
                html = text.replace('window.application = ', '');
                html = html.replace(';','');
                break;
            }
            break;
        }
        node = node.nextSibling;
    }
    if( !html || html.trim() === '')
    {
        return '';
    }
    return html;
}

//Send the HTML header information to the DOMtoString function.
//Currently the Airtable schema is provided in the Header sectioin.
chrome.runtime.sendMessage({
    action: "getSchema",
    source: DOMtoString(document.head)
});

