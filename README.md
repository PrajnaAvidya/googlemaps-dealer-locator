ee-locator
==========

TODO: turn page into EE template, hook ajax service directly into EE (either figure out how to use the ee api to do the queries or write class to interface with the database directly)

haversine formula: SELECT id, ( 3959 * acos( cos( radians(37) ) * cos( radians( lat ) ) * cos( radians( lng ) - radians(-122) ) + sin( radians(37) ) * sin( radians( lat ) ) ) ) AS distance FROM markers HAVING distance < 25 ORDER BY distance LIMIT 0 , 20;
