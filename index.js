const queue = require("oci-queue");
const core = require("oci-core");
const identity = require("oci-identity");
const common = require("oci-common");
const os = require("oci-objectstorage");

// Use this locally instead of env vars and region:
//const provider = new common.ConfigFileAuthenticationDetailsProvider();

const region = common.Region.EU_FRANKFURT_1;
const provider = new common.SimpleAuthenticationDetailsProvider(
  process.env.OCI_TENANCY,
  process.env.OCI_USER,
  process.env.OCI_FINGERPRINT,
  process.env.OCI_KEY,
  process.env.OCI_PASSPHRASE ? process.env.OCI_PASSPHRASE : '',
  region
);

// Q settings
const queueId = process.env.Q_ID;
const endpoint = process.env.Q_ENDPOINT;

(async () => {
    var res = "";
    try {
        
        const getReq = {
          queueId: queueId,
          timeoutInSeconds: 2
        };

        const client = new queue.QueueClient({
          authenticationDetailsProvider: provider
        });
        
        client.endpoint = endpoint;

        var timeout = false;
        console.log("Polling .. ");
        var getRes = await client.getMessages(getReq).catch(error => {
            console.log("timeout");
            timeout = true;
        });
        while(!timeout && getRes && getRes.getMessages && getRes.getMessages.messages.length)
        {
            getRes.getMessages.messages.forEach(function(msg) {
                console.log(msg);
            });
            console.log("Polling .. ");
            getRes = await client.getMessages(getReq).catch(error => {
                console.log("timeout");
                timeout = true;
            });
        }

        const d = new Date();
        console.log("Writing .. ");
        const putReq = {
          queueId: queueId,
          putMessagesDetails: { messages : [ { content: 'hello @ ' + d } ] }
        };
        
        const putRes = await client.putMessages(putReq);
        console.log(putRes);
        
    } catch (error) {
        console.log("Error: " + error);
        res = "error";
    } finally {
        return res;
    }
}) ();