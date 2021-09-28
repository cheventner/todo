(function (window) {
  "use strict";

  /**
   * Crée une nouvelle instance de modèle et raccroche le stockage.
   *
   * @constructor
   * @param {object} storage Une référence à la classe de stockage côté client
   */
  function Model(storage) {
    this.storage = storage;
  }

  /**
   * Crée un nouveau modèle TODO
   *
   * @param {string} [title] The title of the task
   * @param {function} [callback] The callback to fire after the model is created
   */
  Model.prototype.create = function (title, callback) {
    title = title || "";
    callback = callback || function () {};

    var newItem = {
      title: title.trim(),
      completed: false,
    };

    this.storage.save(newItem, callback);
  };

  /**
   * Trouve et retourne un modèle en stockage.Si aucune requête n'est donnée, ça va simplement
   * retournez tout.Si vous passez dans une chaîne ou un numéro, il semblerait que ce soit comme
   * l'identifiant du modèle à trouver.Enfin, vous pouvez transmettre un objet pour correspondre
   * contre.
   *
   * @param {string|number|object} [query] A query to match models against
   * @param {function} [callback] The callback to fire after the model is found
   *
   * @example
   * model.read(1, func); // Will find the model with an ID of 1
   * model.read('1'); // Same as above
   * //Below will find a model with foo equalling bar and hello equalling world.
   * model.read({ foo: 'bar', hello: 'world' });
   */
  Model.prototype.read = function (query, callback) {
    var queryType = typeof query;
    callback = callback || function () {};

    if (queryType === "function") {
      callback = query;
      return this.storage.findAll(callback);
    } else if (queryType === "string" || queryType === "number") {
      query = parseInt(query, 10);
      this.storage.find({ id: query }, callback);
    } else {
      this.storage.find(query, callback);
    }
  };

  /**
   * Met à jour un modèle en lui donnant un identifiant, des données à mettre à jour et un rappel au feu lorsque et un rappel au feu lorsque
   * la mise à jour est complète.
   *
   * @param {number} id L'identifiant du modèle à mettre à jour
   * @param {object} data The properties to update and their new value
   * @param {function} callback The callback to fire when the update is complete.
   */
  Model.prototype.update = function (id, data, callback) {
    this.storage.save(data, callback, id);
  };

  /**
   * Supprime un modèle de stockage
   *
   * @param {number} id The ID of the model to remove
   * @param {function} callback The callback to fire when the removal is complete.
   */
  Model.prototype.remove = function (id, callback) {
    this.storage.remove(id, callback);
  };

  /**
   * WARNING: Supprimera toutes les données du stockage.
   *
   * @param {function} callback The callback to fire when the storage is wiped.
   */
  Model.prototype.removeAll = function (callback) {
    this.storage.drop(callback);
  };

  /**
   * Returns a count of all todos
   * Retourne un compte de tous les TODOS
   */
  Model.prototype.getCount = function (callback) {
    var todos = {
      active: 0,
      completed: 0,
      total: 0,
    };

    this.storage.findAll(function (data) {
      data.forEach(function (todo) {
        if (todo.completed) {
          todos.completed++;
        } else {
          todos.active++;
        }

        todos.total++;
      });
      callback(todos);
    });
  };

  // Export to window
  window.app = window.app || {};
  window.app.Model = Model;
})(window);
