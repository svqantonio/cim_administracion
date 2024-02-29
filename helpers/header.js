document.addEventListener("DOMContentLoaded", function() {
  var metaViewport = document.createElement("meta");
  metaViewport.setAttribute("name", "viewport");
  metaViewport.setAttribute("content", "width=device-width, initial-scale=1.0");
  document.head.appendChild(metaViewport);

  var sweetalertScript = document.createElement("script");
  sweetalertScript.setAttribute("src", "https://cdn.jsdelivr.net/npm/sweetalert2@11");
  document.body.appendChild(sweetalertScript);

  var bootstrapLink = document.createElement("link");
  bootstrapLink.setAttribute("href", "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css");
  bootstrapLink.setAttribute("rel", "stylesheet");
  bootstrapLink.setAttribute("integrity", "sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN");
  bootstrapLink.setAttribute("crossorigin", "anonymous");
  document.head.appendChild(bootstrapLink);

  var popperScript = document.createElement("script");
  popperScript.setAttribute("src", "https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js");
  popperScript.setAttribute("integrity", "sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r");
  popperScript.setAttribute("crossorigin", "anonymous");
  document.body.appendChild(popperScript);

  var bootstrapScript = document.createElement("script");
  bootstrapScript.setAttribute("src", "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js");
  bootstrapScript.setAttribute("integrity", "sha384-BBtl+eGJRgqQAUMxJ7pMwbEyER4l1g+O15P+16Ep7Q9Q+zqX6gSbd85u4mG4QzX+");
  bootstrapScript.setAttribute("crossorigin", "anonymous");
  document.body.appendChild(bootstrapScript);
});
