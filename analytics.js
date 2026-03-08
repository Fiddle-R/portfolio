!function(T,l){var A=T[l];if(!A){var L={config:{connectionString:"InstrumentationKey=94eab42b-ad09-467e-8ff5-a87d503f53f9;IngestionEndpoint=https://eastus2-3.in.applicationinsights.azure.com/;LiveEndpoint=https://eastus2.livediagnostics.monitor.azure.com/;ApplicationId=bee78c23-58cb-4e26-bd21-383ac535da58"},initialize:true,queue:[],sv:"5",version:2};T[l]=L;var R=document.createElement("script");R.src="https://js.monitor.azure.com/scripts/b/ai.2.min.js";R.onload=function(){L.initialize=true;for(var e=0;e<L.queue.length;e++)L.queue[e]()};document.head.appendChild(R)}}(window,"appInsights");

window.addEventListener('load', function() {
  var ai = window.appInsights;
  if (!ai) return;

  var pageName = document.title || window.location.pathname;
  if (window.location.pathname.indexOf('offboarding') > -1) {
    pageName = 'Offboarding Demo';
  } else {
    pageName = 'Portfolio Home';
  }

  if (ai.trackPageView) {
    ai.trackPageView({ name: pageName });
  }
});
