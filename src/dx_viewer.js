module.exports = function(RED) {
    
    function DxViewer(config) {
        RED.nodes.createNode(this, config);
        this.active = (config.active === null || typeof config.active === "undefined") || config.active;
        this.property = config.property || 'payload';
        
        var node = this;
        var errorCondition = false;
        
        function sendDataToClient(data, msg) {
            var d = {
                id:node.id,
            };
            if (data) {
                d.data = data;
            }
            try {
                RED.comms.publish("dx-viewer", d);
            }
            catch(e) {
                node.error("Error sending data", msg);
            }
        }
        
        function handleError(err, msg, statusText) {
            if (!errorCondition) {
                node.status({ fill:"red", shape:"dot", text:statusText });
                errorCondition = true;
            }
            node.error(err, msg);
        }

        function clearError() {
            if (errorCondition) {
                node.status({});
                errorCondition = false;
            }
        }

        node.on("input", function(msg) {       
            if (this.active !== true) { return; }
            let value = msg[node.property];

            if (value == null) {      // null or undefined
                clearError();
                sendDataToClient(null, msg);    // delete table
                return;
            }
            if (!Array.isArray(value)) {
                handleError(`msg.${node.property} is not an array`, msg, `msg.${node.property} is not an array`);
                sendDataToClient(null, msg);    // delete table
                return;
            }
            // check size
            if (value.length == 0) {
                handleError(`msg.${node.property} is an empty array`, msg, `msg.${node.property} is an empty array`);
                sendDataToClient(null, msg);    // delete table
                return;
            }
            // check value element. if it is an array, then return the original value,
            // if it is an object - like returned from db, then convert it into the acceptable format.
            if (!Array.isArray(value[0])) {
                var newValue = [Object.keys(value[0])];
                value.forEach(row => {
                    newValue = newValue.concat([Object.values(row)]);
                })
                value = newValue;
            }

            clearError();
            data = {
                value,
                time: new Date()
            }
            sendDataToClient(data, msg);
        });

        node.on("close", function() {
            // send empty data to close the view
            RED.comms.publish("data", { id:this.id });
            node.status({});
        });
    }
    RED.nodes.registerType("dx-viewer", DxViewer);
    
    // Via the button on the node (in the FLOW EDITOR), the image pushing can be enabled or disabled
    RED.httpAdmin.post("/dx-viewer/:id/:state", RED.auth.needsPermission("image-output.write"), function(req,res) {
        var state = req.params.state;
        var node = RED.nodes.getNode(req.params.id);
        
        if(node === null || typeof node === "undefined") {
            res.sendStatus(404);
            return;  
        }

        if (state === "enable") {
            node.active = true;
            res.send('activated');
        }
        else if (state === "disable") {
            node.active = false;
            res.send('deactivated');
        }
        else {
            res.sendStatus(404);
        }
    });
};