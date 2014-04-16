Google Maps Dealer Locator
==========
* This was the best tutorial I could find to make a dealer locator using google maps: https://developers.google.com/maps/articles/phpsqlsearch_v3

* It's a great reference but very dated because it uses non-parameterized queries, xml, lots of unnecessary javascript, etc.

* So I ported it to more modern standards: PHP PDO, jQuery+ajax, json, added comments, and tweaked the layout a bit.

* Set database info in json.php and import sample data from maps.sql
