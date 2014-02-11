Node.js dashboard for SAP HANA
=========

![Screenshot](http://scn.sap.com/servlet/JiveServlet/showImage/38-98373-337370/pastedImage_15.png)

A realtime web dashboard which displays informaion about how your SAP HANA DB is performing. Includes CPU, Memory, and Disk Space. Intended to be used on a large format monitor in a IT operations room or similar scenario.

Version
----

1.0

Install Requirements
----

1. SAP HANA Instance (e.g. AWS Developer Image)
2. Node.js installed (this does not need to be on the HANA box but same network with access to the HANA port - normally 30015).

Node Dependencies

We will also use a couple of helpful dependencies from the node community including: 
- Socket.io
- Express and 
- hdb 
 
Installing these packages is as simple as running "npm install hdb”. Once you have the dependencies installed we can start creating our app.

![SAP HDB NPM](https://nodei.co/npm/hdb.png?compact=true)
![HANA Node Integration](http://scn.sap.com/servlet/JiveServlet/downloadImage/38-98373-337377/474-400/pastedImage_35.png)


Read More
----
[You can read more here](http://scn.sap.com/community/developer-center/hana/blog/2013/12/05/nodejs-dashboard-for-sap-hana)
