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

(async () => {
    var res = "";
    try {
        
        const queueId = 'ocid1.queue.oc1.eu-frankfurt-1.amaaaaaauevftmqa4cesw3xy5zoyfox5r455vdwghv3yfxycla5z4ic2tslq';
        const endpoint = 'https://cell-1.queue.messaging.eu-frankfurt-1.oci.oraclecloud.com';

        const getReq = {
          queueId: queueId
        };

        const client = new queue.QueueClient({
          authenticationDetailsProvider: provider
        });
        
        client.endpoint = endpoint;

        console.log("Polling .. ");
        var getRes = await client.getMessages(getReq);
        while(getRes && getRes.getMessages && getRes.getMessages.messages.length)
        {
            getRes.getMessages.messages.forEach(function(msg) {
                console.log(msg);
            });
            console.log("Polling .. ");
            getRes = await client.getMessages(getReq);
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