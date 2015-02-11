(function() {
  'use strict';

  angular
    .module('material.core' )
    .provider('$mdIcon', MdIconProvider);

  /**
    * @ngdoc service
    * @name $mdIconProvider
    * @module material.core
    *
    * @description
    * `$mdIconProvider` is used only to register icon IDs with URLs. These configuration features allow
    * icons and icon sets to be pre-registered and associated with source URLs **before** the `<md-icon />`
    * directives are compiled.
    *
    * When an SVG is requested by name/ID, the `$mdIcon` service searches its registry for the associated source
    * URL; that URL is used to on-demand load and parse the SVG dynamically.
    *
    * <hljs lang="js">
    *   app.config(function($mdIconProvider) {
    *
    *     // Configure URLs for icons specified by [set:]id.
    *
    *     $mdIconProvider
    *          .defaultIconSet('my/app/icons.svg')       // Register a default set of SVG icons
    *          .iconSet('social', 'my/app/social.svg')   // Register a named icon set of SVGs
    *          .icon('android', 'my/app/android.svg')    // Register a specific icon (by name)
    *          .icon('work:chair', 'my/app/chair.svg');  // Register icon in a specific set
    *   });
    * </hljs>
    *
    * SVG icons and icon sets can be easily pre-loaded and cached using either (a) a build process or (b) a runtime
    * **startup** process (shown below):
    *
    * <hljs lang="js">
    *   app.config(function($mdIconProvider) {
    *
    *     // Register a default set of SVG icon definitions
    *     $mdIconProvider.defaultIconSet('my/app/icons.svg')
    *
    *   })
    *   .run(function($http, $templateCache){
    *
    *     // Pre-fetch icons sources by URL and cache in the $templateCache...
    *     // subsequent $http calls will look there first.
    *
    *     var urls = [ 'imy/app/icons.svg', 'img/icons/android.svg'];
    *
    *     angular.forEach(urls, function(url) {
    *       $http.get(url, {cache: $templateCache});
    *     });
    *
    *   });
    *
    * </hljs>
    *
    * NOTE: the loaded SVG data is subsequently cached internally for future requests.
    *
    */

   /**
    * @ngdoc method
    * @name $mdIconProvider#icon
    *
    * @description
    * Register a source URL for a specific icon name; name may include optional 'icon set' name prefix.
    * These icons can be retrieved from the cache using `$mdIcon( <icon name> )`
    *
    * <hljs lang="js">
    *   app.config(function($mdIconProvider) {
    *
    *     // Configure URLs for icons specified by [set:]id.
    *
    *     $mdIconProvider
    *          .icon('android', 'my/app/android.svg')    // Register a specific icon (by name)
    *          .icon('work:chair', 'my/app/chair.svg');  // Register icon in a specific set
    *   });
    * </hljs>
    *
    * @returns {obj} an `$mdIconProvider` reference with the chainable configuration API:
    *
    */
   /**
    * @ngdoc method
    * @name $mdIconProvider#iconSet
    *
    * @description
    * Register a source URL for a 'named' set of icons. Individual icons
    * can be retrieved from this cached set using `$mdIcon( <icon set name>:<icon name> )`
    *
    * <hljs lang="js">
    *   app.config(function($mdIconProvider) {
    *
    *     // Configure URLs for icons specified by [set:]id.
    *
    *     $mdIconProvider
    *          .iconSet('social', 'my/app/social.svg')   // Register a named icon set
    *   });
    * </hljs>
    *
    * @returns {obj} an `$mdIconProvider` reference with the chainable configuration API:
    *
    */
   /**
    * @ngdoc method
    * @name $mdIconProvider#defaultIconSet
    *
    * @description
    * Register a source URL for the default 'named' set of icons. Unless explicitly registered
    * subsequent lookups of icons will fall back to search this 'default' icon set.
    * Icon can be retrieved from this cached, default set using `$mdIcon( <icon name> )`
    *
    * <hljs lang="js">
    *   app.config(function($mdIconProvider) {
    *
    *     // Configure URLs for icons specified by [set:]id.
    *
    *     $mdIconProvider
    *          .defaultIconSet('social', 'my/app/social.svg')   // Register a default icon set
    *   });
    * </hljs>
    *
    * @returns {obj} an `$mdIconProvider` reference with the chainable configuration API:
    *
    */
   /**
    * @ngdoc method
    * @name $mdIconProvider#defaultIconSize
    *
    * @description
    * While `<md-icon />` markup can also be style with sizing CSS, this method configures
    * the default icon size used for all icons; unless overridden by specific CSS.
    * NOTE: the default sizing is (24px, 24px).
    *
    * <hljs lang="js">
    *   app.config(function($mdIconProvider) {
    *
    *     // Configure URLs for icons specified by [set:]id.
    *
    *     $mdIconProvider
    *          .defaultIconSize(36)   // Register a default icon size (width == height)
    *   });
    * </hljs>
    *
    * @returns {obj} an `$mdIconProvider` reference with the chainable configuration API:
    *
    */

 var config = {
   defaultIconSize: 24
 };

 function MdIconProvider() { }

 MdIconProvider.prototype = {
   icon : function icon(id, url, iconSize) {
     if ( id.indexOf(':') == -1 ) id = '$default:' + id;

     config[id] = new ConfigurationItem(url, iconSize );
     return this;
   },

   iconSet : function iconSet(id, url, iconSize) {
     config[id] = new ConfigurationItem(url, iconSize );
     return this;
   },

   defaultIconSet : function defaultIconSet(url, iconSize) {
     var setName = '$default';

     if ( !config[setName] ) {
       config[setName] = new ConfigurationItem(url, iconSize );
     }
     return this;
   },

   defaultIconSize : function defaultIconSize(iconSize) {
     config.defaultIconSize = iconSize;
     return this;
   },

   $get : ['$http', '$q', '$log', '$templateCache', function($http, $q, $log, $templateCache) {
     return new MdIconService(config, $http, $q, $log, $templateCache);
   }]
 };

   /**
    *  Configuration item stored in the Icon registry; used for lookups
    *  to load if not already cached in the `loaded` cache
    */
   function ConfigurationItem(url, iconSize) {
     this.url = url;
     this.iconSize = iconSize || config.defaultIconSize;
   }

 /**
  * @ngdoc service
  * @name $mdIcon
  *
  * @description
  * `$mdIcon` is a service used to lookup SVG icons configured via `$mdIconProvider` using
  *  and ID or uses a URL used to load and cache a currently external SVG (that is not currently cached).
  *
  * @param {string} ID or URL value
  * @returns {obj} Clone of the SVG DOM element
  *
  * @usage
  * <hljs lang="js">
  * function SomeDirective($mdIcon) {
  *
  *   // See if the icon has already been loaded, if not
  *   // then lookup the icon from the registry cache, load and cache
  *   // it for future requests.
  *
  *   $mdIcon('android').then(function(icon) { element.append(icon); });
  *   $mdIcon('work:chair').then(function(icon) { element.append(icon); });
  *
  *   // Load and cache the external SVG using a URL
  *
  *   $mdIcon('img/icons/android.svg').then(function(icon) {
  *     element.append(icon);
  *   });
  * };
  * </hljs>
  *
  * NOTE: The `md-icon` directive internally uses the `$mdIcon` service to query, loaded, and instantiate
  * SVG DOM elements.
  */
 function MdIconService(config, $http, $q, $log, $templateCache) {
   var iconCache = {};
   var urlRegex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/i;

   return function getIcon(id) {
     id = id || '';

     // If already loaded and cached, use a clone of the cached icon.
     // Otherwise either load by URL, or lookup in the registry and then load by URL, and cache.

     if ( iconCache[id]         ) return $q.when( iconCache[id].clone() );
     if ( urlRegex.test(id)     ) return loadByURL(id).then( cacheIcon(id) );
     if ( id.indexOf(':') == -1 ) id = '$default:' + id;

     return loadByID(id)
         .catch(loadFromIconSet)
         .catch(announceNotFound)
         .then( cacheIcon(id) );
   };

   /**
    * Prepare and cache the loaded icon for the specified `id`
    */
   function cacheIcon( id ) {

     return function updateCache( icon ) {
       var iconConfig = config[id];

       icon = !isIcon(icon) ? new Icon(icon, iconConfig) : icon;
       icon = prepareAndStyle(icon);

       iconCache[id] = icon;

       return icon.clone();
     };
   }

   /**
    * Lookup the configuration in the registry, if !registered throw an error
    * otherwise load the icon [on-demand] using the registered URL.
    *
    */
   function loadByID(id) {
     var iconConfig = config[id];

     return !iconConfig ? $q.reject(id) : loadByURL(iconConfig.url).then(function(icon) {
       return new Icon(icon, iconConfig);
     });
   }

   /**
    *
    */
   function loadFromIconSet(id) {
     var setName = id.substring(0, id.lastIndexOf(':')) || '$default';
     var iconSetConfig = config[setName];

     return !iconSetConfig ? $q.reject(id) : loadByURL(iconSetConfig.url).then(extractFromSet);

     function extractFromSet(set) {
       var iconName = id.slice(id.lastIndexOf(':') + 1);
       var icon = set.querySelector('#' + iconName);
       return !icon ? $q.reject(id) : new Icon(icon, iconSetConfig);
     }
   }

   /**
    *  Prepare the DOM element that will be cached in the
    *  loaded iconCache store.
    */
   function prepareAndStyle(icon) {
     var iconSize = icon.config ? icon.config.iconSize : config.defaultIconSize;
     var svg = angular.element(icon.element);

     return svg.attr({
       'fit'   : '',
       'height': '100%',
       'width' : '100%',
       'preserveAspectRatio': 'xMidYMid meet',
       'viewBox' : svg.attr('viewBox') || ('0 0 ' + iconSize + ' ' + iconSize)
     })
     .css( {
       'pointer-events' : 'none',
       'display' : 'block'
     });
   }

   /**
    * Load the icon by URL (may use the $templateCache).
    * Extract the data for later conversion to Icon
    */
   function loadByURL(url) {
     return $http
       .get(url, { cache: $templateCache })
       .then(function(response) {
         var els = angular.element(response.data);
         // Iterate to find first svg node, allowing for comments in loaded SVG (common with auto-generated SVGs)
         for (var i = 0; i < els.length; ++i) {
           if (els[i].nodeName == 'svg') {
             return els[i];
           }
         }
       });
   }

   /**
    * User did not specify a URL and the ID has not been registered with the $mdIcon
    * registry
    */
   function announceNotFound(id) {
     var msg = 'icon ' + id + ' not found';
     $log.warn(msg);
     throw new Error(msg);
   }


   /**
    * Check target signature to see if it is an Icon instance.
    */
   function isIcon(target) {
     return angular.isDefined(target.element) && angular.isDefined(target.config);
   }


   /**
    *  Define the Icon class
    */
   function Icon(el, config) {
     if (el.tagName != 'svg') {
       el = angular.element('<svg xmlns="http://www.w3.org/2000/svg">').append(el)[0];
     }

     this.element = el;
     this.config = config;
   }

   // Clone the Icon DOM element; which is stored as an angular.element()

   Icon.prototype.clone = function (){
    return this.element.cloneNode(true)[0];
   };
 }

})();
