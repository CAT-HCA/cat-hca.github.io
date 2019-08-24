let express = require('express');
let bodyParser = require('body-parser');
let fs = require("fs");
let app = express();

// Create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false })

/* HELPER METHODS FOR TRACING DURING DEBUGGING */

function logOneService(service)
{
    console.log(" Service ID: " + service.ServiceID + 
                " Service Name:" + service.ServiceName + 
                " Price: " + service.Price);
}

function logArrayOfServices(arr)
{
    for(let i=0; i < arr.length; i++)
    {
        logOneService(arr[i])
    }
}

/* HELPER METHODS FOR SEARCHING CATEGORIES AND SERVICES */

function getMatchingServiceById(id, data)
{
    console.log("looking for that service...");
    let match = null;
    for(let i = 0; i < data.length; i++)
    {
        if (data[i].ServiceID == id)
        {
            match = data[i];
            break;
        }
    }
    return match;
}

function getServiceCategoryTextByValue(value, data)
{
    let match = null;
    for(let i = 0; i < data.length; i++)
    {
        if (data[i].Value == value)
        {
            match = data[i];
            break;
        }
    }
    return match;
}

function getMatchingServicesByCategory(catID, data)
{
    //console.log("looking for services in category...");
    let matches = [];
    for(let i = 0; i < data.length; i++)
    {
         if (data[i].CategoryName.toUpperCase() == catID.toUpperCase())
        {
            matches[matches.length] = data[i];
        }
    }
    //console.log("Found " + matches.length + " matches")
    return matches;
}


/* THIS CODE ALLOWS REQUESTS FOR THE SPA PAGE */

app.get('/', function (req, res) {
   res.sendFile( __dirname + "/public/" + "index.html" );
})

app.get('/index.html', function (req, res) {
    res.sendFile( __dirname + "/public/" + "index.html" );
 })

 /* THIS CODE ALLOWS REQUESTS FOR THE API THROUGH */

 // GET CATEGORIES
 app.get('/api/categories', function (req, res) {
    console.log("Got a GET request for categories");
	
    let data = fs.readFileSync( __dirname + "/data/" + "categories.json", 'utf8');
    data = JSON.parse(data);
    
    // calls to JSON.parse and JSON.stringify not needed if debugging removed
    //console.log("Returned data is: ");
    //for(let i=0; i < data.length; i++)
      // console.log(data.Category + " - " + data.Value);
    res.end( JSON.stringify(data) );
});

// GET ALL SERVICES
app.get('/api/services', function (req, res) {
    console.log("Got a GET request for ALL services");
	
    let data = fs.readFileSync( __dirname + "/data/services.json", 'utf8');
    //console.log("DATA--> " + data);

    // strips off bad characters which seem to be in services.json file...
    // need to eventually use an editor to strip them away so we don't need
    // to do this.
    data = data.toString();
    data = data.replace(/[^\x20-\x7E]/g, '');
    ///console.log("DATA--> " + data);

    data = JSON.parse(data);
	
    //calls to JSON.parse and JSON.stringify not needed if debugging removed
    //console.log("Returned data is: ");
    //logArrayOfServices(data);
    res.end( JSON.stringify(data) );
});

// GET ONE SERVICE BY ID
app.get('/api/services/:id', function (req, res) {
    let id = req.params.id;
    console.log("Got a GET request for service " + id);

    let data = fs.readFileSync( __dirname + "/data/services.json", 'utf8');
    //console.log("DATA--> " + data);

    // strips off bad characters which seem to be in services.json file...
    // need to eventually use an editor to strip them away so we don't need
    // to do this.
    data = data.toString();
    data = data.replace(/[^\x20-\x7E]/g, '');
    ///console.log("DATA--> " + data);

    data = JSON.parse(data);

    // find course by id
    let match = getMatchingServiceById(id, data)
    if (match == null)
	{
		res.status(404).send('Not Found');
		return;
	}

    //console.log("Returned data is: ");
    //logOneService(match);
    res.end( JSON.stringify(match) );
})

// GET MANY SERVICES BY CATEGORY
app.get('/api/services/bycategory/:id', function (req, res) {
    let id = req.params.id;
    console.log("Got a GET request for services in category " + id);                      

    let categories = fs.readFileSync( __dirname + "/data/categories.json", 'utf8');
    categories = JSON.parse(categories);

    let selectedCategory = getServiceCategoryTextByValue(id, categories).Category
    console.log( "Value was : " + id + " which matched category " + selectedCategory);

    let data = fs.readFileSync( __dirname + "/data/services.json", 'utf8');
    console.log("DATA--> " + data);

    // strips off bad characters which seem to be in services.json
    data = data.toString();
    data = data.replace(/[^\x20-\x7E]/g, '');
    console.log("DATA--> " + data);

    data = JSON.parse(data);

    // find the matching services
    let matches = getMatchingServicesByCategory(selectedCategory, data);

    console.log("Returned data is: ");
    logArrayOfServices(matches);
    res.end( JSON.stringify(matches) );
})
 
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

let server = app.listen(8081, function () {
   //let host = server.address().address
   let port = server.address().port
   
   console.log("App listening at port %s", port)
})
