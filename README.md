Jordan wind map
===============

"Jordan wind map" is a project to visualize live air quality data provided by the [Arabi weather](http://pro.arabiaweather.com)
Government. The main components of the project are:
   * a scraper to extract air data from [Arabi weather](http://pro.arabiaweather.com)
   * an express.js server to serve this data and other static files to the client
   * a client app that interpolates the data and renders an animated wind map

An instance of "Jordan wind map" is available at http://wind.artofeclipse.com.

Just like "air" is a personal project I've used to learn javascript, node.js, when.js, D3
and browser programming. Some of the design decisions were made simply to try something new. Undoubtedly, other decisions were made from a lack of experience. Feedback
welcome!

inspiration
-----------
First of all, [Tokyo Wind Speed](http://air.nullschool.net/) which is this project based on,
The awesome [wind map at hint.fm](http://hint.fm/wind/) provided the main inspiration for
this project. And the very nice D3 tutorial [Let's Make a Map](http://bost.ocks.org/mike/map/)
showed how easy it was to get started.

Finally I really want to thank Cameron Beccario for his amazing work.