# bookPouch

This is a simple book list created with vanilla js and pouchDB, riffed off the todo app created in the pouchDB ["Getting Started"](https://pouchdb.com/getting-started.html) tutorial.

#### Instructions

Microwave on high for 4 minutes. Set aside until cool then serve up using your preferred method. 

`python2 -m SimpleHTTPServer` is one way, VS Code Live Server another. 

Grab a seat, you should now have a totally functioning app. Navigate to Storage in your DevTools to verify pouchDB is active.

#### So you want to sync with a local installation of CouchDB?

Find installation instructions here that will work for you:
http://docs.couchdb.org/en/latest/install/unix.html#installation-using-the-apache-couchdb-convenience-binary-packages

On my Xubuntu machine, I was able to install CouchDB successfully by adding the CouchDB repo to my package manager (xenial corresponds to the release I'm on)

`echo "deb https://apache.bintray.com/couchdb-deb xenial main"     | sudo tee -a /etc/apt/sources.list`

... and then running update to refresh package availability and then install couchdb

`sudo apt-get update && sudo apt-get install couchdb`


Once installed, CouchDB should start running automatically, by default on port 5984. You can verify it's up and running by going here:

`localhost:5984/_utils`

If you go back and check your app now, you'll notice CORS errors. To allow PouchDB and CouchDB to sync, enable CORS using the handy dandy add-cors-to-couchdb package

`npm install -g add-cors-to-couchdb`
`add-cors-to-couchdb`

In order to tell your app about the new CouchDB instance, assign the address of your new database to remoteCouch in your app.js file.

If your CouchDB is running locally on port 5984 you can just uncomment 
`let remoteCouch = 'http://localhost:5984/books';` and comment out the other 'false' remoteCouch assignment.

Once this file is saved and syncing begins, this database should be created automatically. If it isn't, you can manually create it in _utils by selecting "Create Database" in the Databases tab.

A cool way to verify whether pouchDB is syncing with your local couchDB instance is to open your app in an alternate browser to see if they display the same list.

*For a more betterer "gettin' started" guide visit: https://pouchdb.com/getting-started.html*
