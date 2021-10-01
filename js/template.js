/**
 * Crée un nouveau template
 * @class Template
 */

(function (window) {
  "use strict";

  var htmlEscapes = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;",
  };

  var escapeHtmlChar = function (chr) {
    return htmlEscapes[chr];
  };

  var reUnescapedHtml = /[&<>"'`]/g;
  var reHasUnescapedHtml = new RegExp(reUnescapedHtml.source);

  var escape = function (string) {
    return string && reHasUnescapedHtml.test(string)
      ? string.replace(reUnescapedHtml, escapeHtmlChar)
      : string;
  };

  /**
   * Définit les valeurs par défaut du template.
   *@function Template#template
   *   */
  function Template() {
    this.defaultTemplate =
      '<li data-id="{{id}}" class="{{completed}}">' +
      '<div class="view">' +
      '<input class="toggle" type="checkbox" {{checked}}>' +
      "<label>{{title}}</label>" +
      '<button class="destroy"></button>' +
      "</div>" +
      "</li>";
  }

  /**
   * Crée une chaîne HTML <li> et la renvoie pour qu'elle soit placée dans l'application.
   * @param {object} data L'objet contenant les clés que l'on veut trouver dans le
   * 											modèle à remplacer.
   * @returns {string} Chaîne HTML d'un élément <li>
   * @example
   * view.show({
   *	id: 1,
   *	title: "Hello World",
   *	completed: 0,
   * });
   * @function Template#show
   */
  Template.prototype.show = function (data) {
    var i, l;
    var view = "";

    for (i = 0, l = data.length; i < l; i++) {
      var template = this.defaultTemplate;
      var completed = "";
      var checked = "";

      if (data[i].completed) {
        completed = "completed";
        checked = "checked";
      }

      template = template.replace("{{id}}", data[i].id);
      template = template.replace("{{title}}", escape(data[i].title));
      template = template.replace("{{completed}}", completed);
      template = template.replace("{{checked}}", checked);

      view = view + template;
    }

    return view;
  };

  /**
   * Affiche un compteur du nombre de tâches à accomplir.
   * @param {number} activeTodos Le nombre de todos actives.
   * @returns {string} Chaîne contenant le nombre.
   * @function Template#itemCounter
   */
  Template.prototype.itemCounter = function (activeTodos) {
    var plural = activeTodos === 1 ? "" : "s";

    return "<strong>" + activeTodos + "</strong> item" + plural + " left";
  };

  /**
   * Mise à jour du texte du bouton "Clear completed".
   * @param  {number} completedTodos Le nombre de todos terminées.
   * @returns {string} Chaîne contenant le compte.
   * @function Template#clearCompletedButton
   */
  Template.prototype.clearCompletedButton = function (completedTodos) {
    if (completedTodos > 0) {
      return "Clear completed";
    } else {
      return "";
    }
  };

  // Export vers la window
  window.app = window.app || {};
  window.app.Template = Template;
})(window);
