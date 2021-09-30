/** @namespace  Helpers*/
/*global NodeList */
(function (window) {
  "use strict";

  /**
   * Obtenir un élément(s) par un sélecteur class CSS.
   * Utiliser dans {@link View}.
   *@function Helpers#qs
   */
  window.qs = function (selector, scope) {
    return (scope || document).querySelector(selector);
  };

  /**
   * Récupère un tableau des éléments en fonction de leur class CSS
   *  Utiliser dans {@link View}.
   * @function Helpers#qsa
   */
  window.qsa = function (selector, scope) {
    return (scope || document).querySelectorAll(selector);
  };

  /**
   * Contenu des addEventListener.
   * Utiliser dans {@link View} et {@link App}
   * @param {Object} target la cible
   * @param {Bolean} type blur ou focus
   * @param {Function} callback function de rappel
   * @param {Object} useCapture l'élément capturé
   * @function Helpers#$on
   */

  window.$on = function (target, type, callback, useCapture) {
    target.addEventListener(type, callback, !!useCapture);
  };

  /**
   * Attache un gestionnaire à l'événement pour tous les éléments qui correspondent au sélecteur, sur la base d'un élément parent.
   *  Utiliser dans {@link View}.
   * @param {Object} target la cible
   * @param {Function} selector vérifie la correspondance entre enfants et parents
   * @param {Bolean} type le type d'évènenement
   * @param {Function} handler si la condition est remplie, le callback s'execute
   * @function Helpers#delegate
   */
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

    /**
     * @doc https://developer.mozilla.org/en-US/docs/Web/Events/blur
     * @type {Bolean}
     */
    var useCapture = type === "blur" || type === "focus";

    window.$on(target, type, dispatchEvent, useCapture);
  };

  /**
   * Trouvez le parent de l'élément avec le nom de balise donné: $parent(qs('a'), 'div');
   * Utiliser dans {@link View}.
   * @param {Object} (element) l'élément actif
   * @param {string} (tagName) le tagName de l'élémnent
   * @function Helpers#$parent
   */

  window.$parent = function (element, tagName) {
    if (!element.parentNode) {
      return;
    }
    if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
      return element.parentNode;
    }
    return window.$parent(element.parentNode, tagName);
  };

  /**
   * Autorise les boucles sur les nœuds en les enchaînant: qsa('.foo').forEach(function () {})
   */
  NodeList.prototype.forEach = Array.prototype.forEach;
})(window);
