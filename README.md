# Final Project: SpareFood

---

  

Name: William Schulmeister

  

Date: May 12, 2020

  

Project Topic: An expansion on my midterm project. This website stores different markets and their respective spare foods so that people can buy at a cheaper price and avoid food waste.

  

URL: www.sparefood.herokuapp.com

  

---

  
  

### 1. MongoDB

  
#### Schema 1: Market
Data point fields:

-  `Field 1`: Name `Type: String (required)`
-  `Field 2`: Address `Type: String (required)`
- `Field 3`: Food `Type: [foodSchema]`

 Schema:

```javascript

var  marketSchema = new  mongoose.Schema({

name: {

type:  String,

required:  true

},

address:{

type:  String,

required:  true

},

food: {

type: [foodSchema]

}

});

```
#### Schema 2: Food
Data point fields:

-  `Field 1`: Name `Type: String (required)`
-  `Field 2`: Date `Type: String (required)`
- `Field 3`: Price `Type: Number (required)`
-  `Field 4`: Organic `Type: Boolean (required)`
- `Field 5`: Weight `Type: Number (required)`

**Note: Date attribute is generated at the time of the request. It is not part of the post request.**

 Schema:

```javascript

var  foodSchema = new  mongoose.Schema({

name: {

type:  String,

required:  true

},

date: {

type:  String,

required:  true

},

price: {

type:  Number,

required:  true,

min:  0.0

},

organic: {

type:  Boolean,

required:  true

},

weight: {

type:  Number,

required:  true,

min:  0.0

}

});

```


### 2. Sockets
 - Sockets are used for the following tasks:
	 - When a market is added via API call or form, it is updated live on the home page.
	 - When a new item of food is added via API call or form, the following happens live:
		 - It is added to the list of foods on the market to which it was added, visible on the home page.
		 - It is added to the table in the 'Details and Options' section associated with the right market.
		 - It is added, in order, to the list of food on the Food view.

### 3. View Data

1. Home page: Views all markets. Available in the header at all times.
2. Market page: Views information about a specific market. Accessible via 'Details and Options'. 
3. Food page: Views all food in order with links to their markets. Available in the header at all times.
4. New Market form accessible via 'New Market' on the home page.
5. Add Food form accessible via 'Add Food' on the Market page.
6. About page. Available in the header at all times.

### 4. API
  
#### GET Requests

*Get Markets*

HTML form route: `/`

GET endpoint route: `/api/markets`

*Get Market Info*

HTML form route: `/markets/:id`

GET endpoint route: `/api/markets/:id`

*Get Food from Market*

HTML form route: n/a

GET endpoint route: `/api/markets/:id/food`

#### POST Requests
**Postman's requests were only going through as the query, not the body, for whatever reason.  Functionality is still there, but it needs to be submitted as part of the query.**

*Post Market*

HTML form route: `/createMarket`

POST endpoint route: `/api/markets`

Query Params:

name: String

address: String

Example Node.js GET request to endpoint:

```javascript

var request = require('request');
var options = {
  'method': 'POST',
  'url': 'localhost:8000/api/markets/?name=Shoppers&address=sampleAdress',
  'headers': {
  }
};
request(options, function (error, response) { 
  if (error) throw new Error(error);
  console.log(response.body);
});

```
***
*Post Food Item to Market*

HTML form route: `/markets/:id/addFood`

POST endpoint route: `/api/markets/:id/food`

Query Params:

name: String

price: Number

weight: Number

organic: Boolean

****
Example Node.js GET request to endpoint:
``` javascript
var request = require('request');
var options = {
  'method': 'POST',
  'url': 'localhost:8000/api/markets/5eb4a7b9d44bfd02c7c9c4fd/food?name=apples&price=1.11&weight=1.01&organic=false',
  'headers': {
  }
};
request(options, function (error, response) { 
  if (error) throw new Error(error);
  console.log(response.body);
});

```
#### Delete Requests
*Delete Market and its Food*

HTML form route: n/a

DELETE endpoint route: `/api/markets/:id`

*Delete Food item from a Market*

HTML form route: n/a

DELETE endpoint route: `/api/markets/:id/food/:idFood`


*Delete All Food from a Market*

HTML form route: n/a

DELETE endpoint route: `/api/markets/:id/allFood`

### 4. Modules

Market.js module available in the models folder. Exports models for Market and Food based on their schema.

### 5. NPM Packages

 1. less-middleware: 
	 - [https://www.npmjs.com/package/less-middleware](https://www.npmjs.com/package/less-middleware)
	 - Compiles .less stylesheets into .css. Adds variables, functions, and more to standard css.
	 - Used for all styling. Stylesheets viewable at /public/assets.
2. date-format:
	- [https://www.npmjs.com/package/dateformat](https://www.npmjs.com/package/dateformat)
	- Modifies a JS Date() object into whatever form needed as given by several modifiers.
	- Used to store date at which food was entered into the system.
3. showdown:
  - [https://www.npmjs.com/package/showdown](https://www.npmjs.com/package/showdown)
  - Parses markdown string into HTML.
  - Used to render About page.
### 6. UI
Picked a monochromatic color scheme with 3 colors. Less allowed for easy use as primary, secondary and tertiary. Hope it looks good :)

**Thanks for an awesome class!**
