/**
 * Crée un nouveau contrôleur
 * @class string Controller
 */
(function (window) {
  "use strict";

  /**
   * le controller permet d'interagir entre la View et le Model
   * @constructor
   * @param {object} model The model instance
   * @param {object} view The view instance
   */
  function Controller(model, view) {
    var self = this;
    self.model = model;
    self.view = view;

    self.view.bind("newTodo", function (title) {
      self.addItem(title);
    });

    self.view.bind("itemEdit", function (item) {
      self.editItem(item.id);
    });

    self.view.bind("itemEditDone", function (item) {
      self.editItemSave(item.id, item.title);
    });

    self.view.bind("itemEditCancel", function (item) {
      self.editItemCancel(item.id);
    });

    self.view.bind("itemRemove", function (item) {
      self.removeItem(item.id);
    });

    self.view.bind("itemToggle", function (item) {
      self.toggleComplete(item.id, item.completed);
    });

    self.view.bind("removeCompleted", function () {
      self.removeCompletedItems();
    });

    self.view.bind("toggleAll", function (status) {
      self.toggleAll(status.completed);
    });
  }

  /**
   * Charge et initialise la vue ( '' | 'active' | 'completed')
   * @param {string} locationHash peut avoir comme valeur ( '' | 'active' | 'completed')
   * @function setView
   */
  Controller.prototype.setView = function (locationHash) {
    var route = locationHash.split("/")[1];
    var page = route || "";
    this._updateFilterState(page);
  };

  /**
   * Un événement à déclencher au chargement. Il récupère tous les éléments et
   * les affiche dans la fenêtre todo-list
   * @function showAll
   */
  Controller.prototype.showAll = function () {
    var self = this;
    self.model.read(function (data) {
      self.view.render("showEntries", data);
    });
  };

  /**
   * Retourne toutes les tâches actives
   * @function showActive
   */
  Controller.prototype.showActive = function () {
    var self = this;
    self.model.read({ completed: false }, function (data) {
      self.view.render("showEntries", data);
    });
  };

  /**
   * Retourne toutes les tâches terminées
   * @function ShowCompleted
   */
  Controller.prototype.showCompleted = function () {
    var self = this;
    self.model.read({ completed: true }, function (data) {
      self.view.render("showEntries", data);
    });
  };

  /**
   * Un événement à déclencher chaque fois que vous voulez ajouter un élément.
   * Passez simplement l'objet event et il se chargera de l'insertion dans le DOM
   * et de la sauvegarde du nouvel élément.
   *  @param {string} (title) le contenu de la todo
   * @function addItem
   */
  Controller.prototype.addItem = function (title) {
    // correction de la faute de frappe

    var self = this;

    if (title.trim() !== "") {
      self.model.create(title, function () {
        self.view.render("clearNewTodo");
        self._filter(true);
      });
    }
  };

  /**
   * Déclenche le mode d'édition des éléments.
   * @param {number} (id) L'id de la tâche à éditer
   * @function editItem
   */
  Controller.prototype.editItem = function (id) {
    var self = this;
    self.model.read(id, function (data) {
      self.view.render("editItem", { id: id, title: data[0].title });
    });
  };

  /**
   * Termine le mode d'édition des éléments et supprime les espaces.
   * @param {*} id  L'id de la tâche éditée, à sauvegarder
   * @param {*} title  le contenu de la todo
   * @function editItemSave
   */
  Controller.prototype.editItemSave = function (id, title) {
    var self = this;

    title = title.trim(); // permet de retirer les blancs en début et fin de chaîne

    if (title.length !== 0) {
      self.model.update(id, { title: title }, function () {
        self.view.render("editItemDone", { id: id, title: title });
      });
    } else {
      self.removeItem(id);
    }
  };

  /**
   * Annule le mode d'édition des éléments.
   * @param {*} id  L'id de la tâche éditée, à annuler
   * @function editItemCancel
   */
  Controller.prototype.editItemCancel = function (id) {
    var self = this;
    self.model.read(id, function (data) {
      self.view.render("editItemDone", { id: id, title: data[0].title });
    });
  };

  /**
   * En lui donnant un ID, il trouvera l'élément du DOM correspondant à cet ID,
   * le supprimera du DOM et le supprimera également du stockage.
   * @param {number} id L'ID de l'élément à supprimer du DOM et du stockage
   * @function removeItem
   */
  Controller.prototype.removeItem = function (id) {
    var self = this;
    var items;
    self.model.read(function (data) {
      items = data;
    });

    self.model.remove(id, function () {
      self.view.render("removeItem", id);
      console.log("Element with ID: " + id + " has been removed.");
    });

    self._filter();
  };

  /**
   * Enlèvera tous les éléments terminés du DOM et du stockage.
   * @function removeCompletedItems
   */
  Controller.prototype.removeCompletedItems = function () {
    var self = this;
    self.model.read({ completed: true }, function (data) {
      data.forEach(function (item) {
        self.removeItem(item.id);
      });
    });

    self._filter();
  };

  /**
   * Donnez-lui l'ID d'un modèle et une case à cocher et
   * il mettra à jour l'élément dans le stockage en fonction de l'état de la case à cocher.
   *
   * @param {number} (id) L'ID de l'élément à compléter ou à retirer
   * @param {object} (checkbox) La case à cocher pour valider le statut de la tache
   * @param {boolean|undefined} silent Empêcher le re-filtrage des éléments de tâche
   * @function toggleComplete
   */
  Controller.prototype.toggleComplete = function (id, completed, silent) {
    var self = this;
    self.model.update(id, { completed: completed }, function () {
      self.view.render("elementComplete", {
        id: id,
        completed: completed,
      });
    });
    if (!silent) {
      self._filter();
    }
  };

  /**
   *
   */

  /**
   * Basculera l'état activation / désactivation des cases à cocher
   * Il suffit de passer dans l'objet de l'événement.
   * @param {objetc} (checkbox) case à covher pour valider le choix du statut
   * @function toggleAll
   */
  Controller.prototype.toggleAll = function (completed) {
    var self = this;
    self.model.read({ completed: !completed }, function (data) {
      data.forEach(function (item) {
        self.toggleComplete(item.id, completed, true);
      });
    });

    self._filter();
  };

  /**
   * Met à jour les taches de la page qui changent
   * en fonction du nombre de todos restants.
   * @function _updateCount
   */
  Controller.prototype._updateCount = function () {
    var self = this;
    self.model.getCount(function (todos) {
      self.view.render("updateElementCount", todos.active);
      self.view.render("clearCompletedButton", {
        completed: todos.completed,
        visible: todos.completed > 0,
      });

      self.view.render("toggleAll", {
        checked: todos.completed === todos.total,
      });
      self.view.render("contentBlockVisibility", { visible: todos.total > 0 });
    });
  };

  /**
   * Refiltre les élémentsde la todo, en fonction de route active.
   * @param {boolean|undefined} (force)  refiltre les éléments de la todo.
   * @function filter
   */
  Controller.prototype._filter = function (force) {
    var activeRoute =
      this._activeRoute.charAt(0).toUpperCase() + this._activeRoute.substr(1);

    // Mettre à jour les éléments de la page, qui changent avec chaque tâche achevée.
    this._updateCount();

    // Si la dernière route actvie n'est pas "All", ou si nous changeons de route, nous
    // recréons les éléments de la todo , en appelant :
    // this.show[All|Active|Completed]() ;
    if (
      force ||
      this._lastActiveRoute !== "All" ||
      this._lastActiveRoute !== activeRoute
    ) {
      this["show" + activeRoute]();
    }

    this._lastActiveRoute = activeRoute;
  };

  /**
   * Met simplement à jour les états sélectionnés de la nav de filtrage
   * @param {string} (currentPage) le filtrage de la page actuelle ('' || active || completed )
   * @function _updateFilterState
   */
  Controller.prototype._updateFilterState = function (currentPage) {
    // Stocke une référence à la route active, ce qui nous permet de re-filtrer les todo
    // au fur et à mesure qu'ils sont marqués comme complets ou incomplets.
    this._activeRoute = currentPage;

    if (currentPage === "") {
      this._activeRoute = "All";
    }

    this._filter();

    this.view.render("setFilter", currentPage);
  };

  // Exporter vers window
  window.app = window.app || {};
  window.app.Controller = Controller;
})(window);
