/*jshint eqeqeq:false */
(function (window) {
  "use strict";

  /**
   * Crée un nouvel objet de stockage côté client
   * et créera une collection vide si aucune collection n'existe déjà.
   * @constructor Store
   * @param {string} name The name of our DB we want to use
   * @param {function} callback Our fake DB uses callbacks because in
   * real life you probably would be making AJAX calls
   */
  function Store(name, callback) {
    callback = callback || function () {};

    this._dbName = name;

    if (!localStorage[name]) {
      var data = {
        todos: []
      };

      localStorage[name] = JSON.stringify(data);
    }

    callback.call(this, JSON.parse(localStorage[name]));
  }

  /**
   * Recherche des éléments en fonction d'une
   * requête donnée sous la forme d'un objet JS.
   * @function Store#find
   * @param {object} query The query to match against (i.e. {foo: 'bar'})
   * @param {function} callback	 The callback to fire when the query has
   * completed running
   *
   * @example
   * db.find({foo: 'bar', hello: 'world'}, function (data) {
   *	 // data will return any items that have foo: bar and
   *	 // hello: world in their properties
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
   * Récupérera toutes les données de la collection
   *
   * @param {function} callback The callback to fire upon retrieving data
   */
  Store.prototype.findAll = function (callback) {
    callback = callback || function () {};
    callback.call(this, JSON.parse(localStorage[this._dbName]).todos);
  };

  /**
   * Sauvera les données dans BD. Si aucun élément n'existe, il créera un nouveau
   * article, sinon il mettra simplement à jour les propriétés de l'élément existant
   *
   * @param {object} updateData The data to save back into the DB
   * @param {function} callback The callback to fire after saving
   * @param {number} id An optional param to enter an ID of an item to update
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
      // Assign an ID
      updateData.id = Date.now();

      todos.push(updateData);
      localStorage[this._dbName] = JSON.stringify(data);
      callback.call(this, [updateData]);
    }
  };

  /**
   * Retire un article du magasin en fonction de son ID.
   *
   * @param {number} id The ID of the item you want to remove
   * @param {function} callback The callback to fire after saving
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
   * Will drop all storage and start fresh
   *
   * @param {function} callback The callback to fire after dropping the data
   */
  Store.prototype.drop = function (callback) {
    var data = { todos: [] };
    localStorage[this._dbName] = JSON.stringify(data);
    callback.call(this, data.todos);
  };

  // Export to window
  window.app = window.app || {};
  window.app.Store = Store;
})(window);
