# README #

Scraping master for amazon, flipkart, snapdeal, paytm, shopclues e-commerce websites

### create a .env file where environment variables can be add

##### add send grid key in .env file
```
SENDGRID_API_USER=user
SENDGRID_API_KEY=key
```

## Install Packages ##
```npm install```

## Run express app to view stats ##
```node bin/www```

## View Scraping Stats ##
```localhost:3001/stats```

## To start scraping website catalog urls  ##
```node scrap_website_catalog_urls.js amazon```

## To start scraping products of website using catalog urls scrapperd above  ##
```node scrap_website_products.js amazon```


### Changes done on 2018 Feb 20 to make it running

```
- Moved from bitbucket to git
- environemt file is added to use it secret keys from it
- scraping scripts will run on Sunday Only

```