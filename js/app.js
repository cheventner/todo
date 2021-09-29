/**
 *  Crée une nouvelle application.
 *  @class string App
 */
(function () {
  "use strict";

  /**
   * Configure une nouvelle Todo list.
   * @param {string} (name) Le nom de votre nouvelle to do list.
   */
  function Todo(name) {
    this.storage = new app.Store(name);
    this.model = new app.Model(this.storage);
    this.template = new app.Template();
    this.view = new app.View(this.template);
    this.controller = new app.Controller(this.model, this.view);
  }

  var todo = new Todo("todos-vanillajs"); // dans View.js, View.prototype.bind() et View.prototype.render()

  /**
   * Ajoute la route de la page dans l' url ''|| active || completed
   * @function setView
   */
  function setView() {
    todo.controller.setView(document.location.hash);
  }
  $on(window, "load", setView);
  $on(window, "hashchange", setView);
})();
