Google Maps Dealer Locator
==========
* This was the best tutorial I could find to make a dealer locator using google maps: https://developers.google.com/maps/articles/phpsqlsearch_v3

* It's a great reference but very dated because it uses non-parameterized queries, xml, lots of unnecessary javascript, etc.

* So I ported it to more modern standards: PHP PDO, jQuery+ajax, json, and tweaked the layout a bit.

* TODO: layout for search box, result tooltip for both types (links/etc), custom result icons, turn page into EE template, hook ajax service directly into EE (either figure out how to use the ee api to do the distance query or write library to interface with the database directly)
