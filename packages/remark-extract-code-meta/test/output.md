<p><a href="https://www.topografix.com/gpx.asp">GPX</a> (short for GPX exchange format) is an XML file type used to store coordinates data. It is used as a common way to share coordinates amongst softwares and applications. It is defined with this open format : <a href="https://www.topografix.com/GPX/1/1/gpx-strict.xsd">https://www.topografix.com/GPX/1/1/gpx-strict.xsd</a>.</p>
<p>There are three data types :</p>
<ul>
<li><strong>wptType</strong>: It's a Waypoint. It descibes with coordinates the position and elevation with time if given.</li>
<li><strong>trkType</strong>: A Track is made of segments containing self describing waypoints.</li>
<li><strong>rteType</strong>: It's a Route. It contains routepoints that can be distant, but as a whole describe a path between a start and an end. The void between routepoints can be filled as slef-describing waypoints and re-injected into another GPX file as a Track. GPS for instance can work that way, by having only turn-points and town to cross by, and projecting those on vector maps.</li>
</ul>
<p>Coordinates are Latitude and Longitude in decimal degrees. Elevation is in meters. Dates and times are in UTC.</p>
<p>Per its specifications, a GPX file is valid as long as every single waypoint has coordinates.</p>
<p>For the <a href="/projects/corsica">Corsica</a> project, I only used tracks and track segments. Here are the types I used to parse a GPX file :</p>
<pre><code class="language-typescript" data-meta="lines=2">export interface GPXTrkPart {
  __ATTRIBUTE__lat: string,
  __ATTRIBUTE__lon: string,
  ele: number,
  time?: string
}

export interface GPXJson {
    '?xml': {
        __ATTRIBUTE__version: string,
        __ATTRIBUTE__encoding: string
    },
    gpx: {
        '__ATTRIBUTE__creator': string,
        '__ATTRIBUTE__xmlns:xsi': string,
        '__ATTRIBUTE__xsi:schemaLocation': string,
        '__ATTRIBUTE__version': string,
        '__ATTRIBUTE__xmlns': string
        metadata?: {
          time?: string
        },
        trk: {
          name: string,
          type: string,
          trkseg: {
              trkpt: Array&#x3C;GPXTrkPart>
          }
        }
    }
  }
</code></pre>