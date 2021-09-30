/**
 * Crée une nouvelle application contenant une {@link Todo} list
 * et paramètre la fonction {@link App#setView} pour la gestion des events 'load' et 'hashChange' déclenchés sur la window
 * @namespace App
 */
(function () {
  ("use strict");

  /**
   * Crée une liste de todo
   * @class Todo
   * @param {string} name Le nom de la nouvelle todo list
   * @example var todo = new Todo("todo");
   */
  function Todo(name) {
    /** @property {Store} */
    this.storage = new app.Store(name);
    /** @property {Model} */
    this.model = new app.Model(this.storage);
    /** @property {Template} */
    this.template = new app.Template();
    /** @property {View} */
    this.view = new app.View(this.template);
    /** @property {Controller} */
    this.controller = new app.Controller(this.model, this.view);
  }

  var todo = new Todo("todos-vanillajs"); // dans View.js, View.prototype.bind() et View.prototype.render()

  /**
   * Ajoute la route de la page dans l'url ''|| active || completed.
   * @function App#setView
   */
  function setView() {
    todo.controller.setView(document.location.hash);
  }
  $on(window, "load", setView);
  $on(window, "hashchange", setView);
})();
