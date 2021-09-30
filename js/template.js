/*jshint laxbreak:true */
(function (window) {
  "use strict";

  var htmlEscapes = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;"
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
   * Définit des valeurs par défaut pour toutes les méthodes de modèle, comme un modèle par défaut.
   *
   * @constructor
   */
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
   * Crée une chaîne HTML <li> et la renvoie pour qu'elle soit placée dans votre application.
   *
   * NOTE: Dans la vie réelle, vous devriez utiliser un moteur de templating tel que Mustache
   * ou Handlebars, mais il s'agit ici d'un exemple de vanilla JS.
   *
   * @param {object} data L'objet contenant les clés que vous voulez trouver dans le
   * 											modèle à remplacer.
   * @returns {string} Chaîne HTML d'un élément <li>
   *
   * @example
   * view.show({
   *	id: 1,
   *	title: "Hello World",
   *	completed: 0,
   * });
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
   *
   * @param {number} activeTodos The number of active todos.
   * @returns {string} String containing the count
   */
  Template.prototype.itemCounter = function (activeTodos) {
    var plural = activeTodos === 1 ? "" : "s";

    return "<strong>" + activeTodos + "</strong> item" + plural + " left";
  };

  /**
   * Mise à jour du texte du bouton "Effacer les données".
   *
   * @param  {number} completedTodos The number of completed todos.
   * @returns {string} String containing the count
   */
  Template.prototype.clearCompletedButton = function (completedTodos) {
    if (completedTodos > 0) {
      return "Clear completed";
    } else {
      return "";
    }
  };

  // Export to window
  window.app = window.app || {};
  window.app.Template = Template;
})(window);
