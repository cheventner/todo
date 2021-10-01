(function (window) {
  "use strict";

  /**
   * Crée un nouvel objet de stockage côté client
   * et créera une collection vide si aucune collection n'existe déjà.
   * @constructor Store
   * @param {string} name Le nom de la DB que nous voulons utiliser
   * @param {function} callback Fonction de rappel (Notre fausse DB utilise des callbacks)
   */
  function Store(name, callback) {
    callback = callback || function () {};

    this._dbName = name;

    if (!localStorage[name]) {
      var data = {
        todos: [],
      };

      localStorage[name] = JSON.stringify(data);
    }

    callback.call(this, JSON.parse(localStorage[name]));
  }

  /**
   * Recherche des éléments en fonction d'une requête donnée sous la forme d'un objet JS.
   * @function Store#find
   * @param {object} query La requête à comparer (i.e. {foo: 'bar'})
   * @param {function} callback	 Le callback à lancer lorsque la requête a
   * terminé l'exécution.
   * @example
   * db.find({foo: 'bar', hello: 'world'}, function (data) {
   *	 data will return any items that have foo: bar and
   *	 hello: world in their properties
   * });
   */
  Store.prototype.find = function (query, callback) {
    if (callback) {
      var todos = JSON.parse(localStorage[this._dbName]).todos;

      callback.call(
        this,
        todos.filter(function (todo) {
          for (var q in query) {
            if (query[q] !== todo[q]) {
              return false;
            }
          }
          return true;
        })
      );
    }
  };

  /**
   * Récupére toutes les données de la collection
   * @function Store#findAll
   * @param {function} callback Récupération des données avec la fonction de rappel
   */
  Store.prototype.findAll = function (callback) {
    callback = callback || function () {};
    callback.call(this, JSON.parse(localStorage[this._dbName]).todos);
  };

  /**
   * Sauve les données dans DB. Si aucun élément n'existe, il crée un nouvel
   * article, sinon il mettra simplement à jour les propriétés de l'élément existant
   * @param {object} updateData Les données à sauvegarder dans la DB
   * @param {function} callback Le callback à lancer après la sauvegarde
   * @param {number} id Un paramètre facultatif pour entrer l'ID d'un élément à mettre à jour.
   * @function Store#save
   */
  Store.prototype.save = function (updateData, callback, id) {
    var data = JSON.parse(localStorage[this._dbName]);
    var todos = data.todos;

    callback = callback || function () {};

    // Si un ID a été effectivement donné, trouver l'élément et mettre à jour chaque propriété
    if (id) {
      for (var i = 0; i < todos.length; i++) {
        if (todos[i].id === id) {
          for (var key in updateData) {
            todos[i][key] = updateData[key];
          }
          break;
        }
      }

      localStorage[this._dbName] = JSON.stringify(data);
      callback.call(this, todos);
    } else {
      // Attribuer un ID
      updateData.id = Date.now();

      todos.push(updateData);
      localStorage[this._dbName] = JSON.stringify(data);
      callback.call(this, [updateData]);
    }
  };

  /**
   * Retire un article du magasin en fonction de son ID.
   * @param {number} id L'ID de l'élément à supprimer.
   * @param {function} callback Le callback à lancer après la sauvegarde.
   * @function Store#remove
   */
  Store.prototype.remove = function (id, callback) {
    var data = JSON.parse(localStorage[this._dbName]);
    var todos = data.todos;
    var todoId;

    for (var i = 0; i < todos.length; i++) {
      if (todos[i].id == id) {
        todoId = todos[i].id;
      }
    }

    for (var i = 0; i < todos.length; i++) {
      if (todos[i].id == todoId) {
        todos.splice(i, 1);
      }
    }

    localStorage[this._dbName] = JSON.stringify(data);
    callback.call(this, todos);
  };

  /**
   * Vide et commence un nouveau stockage.
   * @param {function} callback Le callback à lancer après avoir déposé les données.
   *   @function Store#drop
   */
  Store.prototype.drop = function (callback) {
    var data = { todos: [] };
    localStorage[this._dbName] = JSON.stringify(data);
    callback.call(this, data.todos);
  };

  // Export vers la window
  window.app = window.app || {};
  window.app.Store = Store;
})(window);
