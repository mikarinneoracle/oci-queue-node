## OCI Queue example in NodeJS with GitHub Actions

### OCI Queue

Create Queue and copy the Queue OCID and Enpoint:

<p>
<img src="endpoint.png" width="800" />

<p>
When using another <code>region</code> than <code>EU_FRANKFURT_1</code> please modify the 
<a href="https://github.com/mikarinneoracle/oci-queue-node/blob/main/index.js#L10">
<code>index.js</code></a> Line #10 accordingly:

<pre>
const region = common.Region.EU_FRANKFURT_1;
</pre>

### Policies

Setup policies for your user in the tenancy

e.g. <code>Allow &lt;USER_GROUP&gt; to manage queues in compartment &lt;COMPARTMENT&gt;</code>

More on OCI Queue IAM policies: https://docs.oracle.com/en-us/iaas/Content/queue/policy-reference.htm

### Secrets

Setup secrets to run this example with GitHub Actions:

<ul>
    <li><b>OCI_TENANCY</b>: OCI Tenancy OCID</li>
    <li><b>OCI_USER</b>: OCI User OCID</li>
    <li><b>OCI_FINGERPRINT</b>: OCI User Fingerprint</li>
    <li><b>OCI_KEY</b>: OCI User Private Key</li>
    <li><b>OCI_PASSPHRASE</b>: OCI User Private Key passphrase (optional)</li>
    <li><b>Q_ID</b>: OCI Queue OCID</li>
    <li><b>Q_ENDPOINT</b>OCI Queue Endpoint</li>
</ul>

### Run Action

Monitor the GitHub action to run:

<p>
<img src="action.png" width="800" />

<p>
This example will poll for messages in the queue and finally writes a new message to it.

### View Messages on the Queue

<img src="messages.png" width="800" />

### Running locally

Clone this repo, setup npm and <code>oci cli</code> and modify <a href="https://github.com/mikarinneoracle/oci-queue-node/blob/main/index.js#L8">index.js</a> line 8 by uncommenting it and removing/commenting lines 10-18 and replace lines 21-22
with Queue details :

<pre>
// Use this locally instead of env vars and region:
const provider = new common.ConfigFileAuthenticationDetailsProvider();

// Q settings
const queueId = 'ocid1.queue.oc1.eu-frankfurt-1.ama....a5z4ic2tslq';
const endpoint = 'https://cell-1.queue.messaging.eu-frankfurt-1.oci.oraclecloud.com';
</pre>

Then run:

<pre>
npm install
node index.js
</pre>

### Sending messages to Queue while it is polling

You can send messages to the queue and see them being received while polling using the OCI Queue Console  
<code>Actions/Send Message</code>.

<p>
You can also play with the queue's <code>Dead Letter Queue</code> settings to see how many
times the same message is being received (default is 5).
