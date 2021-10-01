/**
 * @class Model
 */
(function (window) {
  "use strict";

  /**
   * Crée une nouvelle instance de modèle et lie le stockage coté client.
   * @constructor Model
   * @param {object} storage Une référence à la classe de stockage côté client {@link Store}.
   * @function Model#model
   */
  function Model(storage) {
    this.storage = storage;
  }

  /**
   * Crée un nouveau Model de TODO.
   * @param {string} title Le titre de la tâche.
   * @param {function} callback Le callback à lancer après la création du modèle.
   * @function Model#create
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
   * Trouve et retourne un modèle en stockage.Si aucune requête n'est donnée, il va simplement
   * tout retourner.Si on passe dans une chaîne ou un numéro, cela ressemblera à
   * l'identifiant du modèle à trouver.On peut lui transmettre un objet.
   * @param {string|number|object} query Une requête pour comparer les modèles.
   * @param {function} callback Le callback à lancer après que le modèle soit trouvé
   * @function Model#read
   *  @example
   * model.read(1, func); // Trouvera le modèle avec un ID de 1
   * model.read('1'); // Même chose que ci-dessus.
   * Ci-dessous un exemple avec foo égalant bar et hello égalant world..
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
   * Met à jour un modèle en lui donnant un ID, des données et un callback lorsque
   * la mise à jour est complète.
   * @param {number} id L'identifiant du modèle à mettre à jour.
   * @param {object} data Les propriétés à mettre à jour et leur nouvelle valeur.
   * @param {function} callback La fonction de rappel à lancer lorsque la mise à jour est terminée.
   * @function Model#update
   */
  Model.prototype.update = function (id, data, callback) {
    this.storage.save(data, callback, id);
  };

  /**
   * Supprime un modèle de stockage
   * @param {number} id L'ID du modèle à supprimer
   * @param {function} callback La fonction de rappel à lancer lorsque la suppression est terminée.
   * @function Model#remove
   */
  Model.prototype.remove = function (id, callback) {
    this.storage.remove(id, callback);
  };

  /**
   * WARNING: Supprimera toutes les données du stockage.
   * @param {function} callback Le rappel à déclencher lorsque le stockage est effacé.
   * @function Model#removeAll
   */
  Model.prototype.removeAll = function (callback) {
    this.storage.drop(callback);
  };

  /**
   * Retourne un compte de tous les TODOS
   * @param {function} callback
   * @function Model#getCount
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

  // Export vers la window
  window.app = window.app || {};
  window.app.Model = Model;
})(window);
