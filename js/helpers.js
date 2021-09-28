/*global NodeList */
(function (window) {
  "use strict";

  // Obtenir un élément(s) par un sélecteur CSS:
  window.qs = function (selector, scope) {
    return (scope || document).querySelector(selector);
  };
  window.qsa = function (selector, scope) {
    return (scope || document).querySelectorAll(selector);
  };

  // addEventListener wrapper:
  window.$on = function (target, type, callback, useCapture) {
    target.addEventListener(type, callback, !!useCapture);
  };

  // Attache un gestionnaire à l'événement pour tous les éléments qui correspondent au sélecteur,
  // maintenant ou dans le futur, sur la base d'un élément racine.
  window.$delegate = function (target, selector, type, handler) {
    function dispatchEvent(event) {
      var targetElement = event.target;
      var potentialElements = window.qsa(selector, target);
      var hasMatch =
        Array.prototype.indexOf.call(potentialElements, targetElement) >= 0;

      if (hasMatch) {
        handler.call(targetElement, event);
      }
    }

    // https://developer.mozilla.org/en-US/docs/Web/Events/blur
    var useCapture = type === "blur" || type === "focus";

    window.$on(target, type, dispatchEvent, useCapture);
  };

  // Trouvez le parent de l'élément avec le nom de balise donné:
  // $parent(qs('a'), 'div');
  window.$parent = function (element, tagName) {
    if (!element.parentNode) {
      return;
    }
    if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
      return element.parentNode;
    }
    return window.$parent(element.parentNode, tagName);
  };

  // Permettre de faire des boucles sur les nœuds en les enchaînant:
  // qsa('.foo').forEach(function () {})
  NodeList.prototype.forEach = Array.prototype.forEach;
})(window);
