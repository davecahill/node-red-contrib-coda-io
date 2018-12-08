"use strict";

var _ = require('lodash');

module.exports = function(RED) {

    function CodaIoGetDataNode(n) {

        RED.nodes.createNode(this, n);
        let node = this;
        node.on('input', function(msg) {

            // If nextPageLink is given, use the lind to request
            if (typeof msg.coda.nextPageLink !== 'undefined') {
                msg.url = msg.coda.nextPageLink;
            }
            // Construct a request URL from scratch
            else {
                const CodaReqestUrl = require('./core.js');
                let coda = new CodaReqestUrl(msg.coda.doc_id, msg.coda.secondary_type, msg.coda.secondary_id);

                msg.url = coda.getRequestUrl(n.request_for);
                // If the secondary type is table and the rows option is selected
                // get the rows
                if (msg.coda.secondary_type == 'tables' && n.request_for == 'rows') {
                    msg.url = coda.appendLimit(msg.url, n.limit);
                }
                else if (msg.coda.secondary_type != 'tables' && n.request_for == 'rows') {
                    node.error('Requesting for rows while a table information was not supplied in the "Connection settings" node. Make sure the option "Table" is selected in the "Connection settings" node.', err);
                }
            }

            node.send(msg);
        });
    }
    RED.nodes.registerType("coda-io-get-data", CodaIoGetDataNode);
}
