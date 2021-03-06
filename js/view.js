/*global qs, qsa, $on, $parent, $delegate */
/**
 * @class View
 */
(function (window) {
  "use strict";

  /**
   * Vue qui fait abstraction du DOM du navigateur.
   * Il comporte deux points d'entrée simples :
   *   - bind(eventName, handler)
   *     Prend un événement de l'application todo et enregistre le gestionnaire.
   *   - Rendu (commande, paramètreObject)
   *     Rend la commande donnée avec les options
   */
  function View(template) {
    this.template = template;

    this.ENTER_KEY = 13;
    this.ESCAPE_KEY = 27;

    this.$todoList = qs(".todo-list");
    this.$todoItemCounter = qs(".todo-count");
    this.$clearCompleted = qs(".clear-completed");
    this.$main = qs(".main");
    this.$footer = qs(".footer");
    this.$toggleAll = qs(".toggle-all");
    this.$newTodo = qs(".new-todo");
  }

  /**
   * Supprimer un todo en utilisant son ID
   * @param {number} id Id de l'item à supprimer
   * @function View#_removeItem
   */
  View.prototype._removeItem = function (id) {
    var elem = qs('[data-id="' + id + '"]');

    if (elem) {
      this.$todoList.removeChild(elem);
    }
  };
  /**
   * Effacer les éléments terminés de la vue
   * @param {number} completedCount Nombre d'items complétés
   * @param {boolean} visible true || false
   * @function View#_clearCompletedButton
   */
  View.prototype._clearCompletedButton = function (completedCount, visible) {
    this.$clearCompleted.innerHTML =
      this.template.clearCompletedButton(completedCount);
    this.$clearCompleted.style.display = visible ? "block" : "none";
  };

  /**
   * Filtre un todo en utilisant sa classe
   * @memberof View
   * @param {string} currentPage '' || active || completed
   * @function View#_setFilter
   */
  View.prototype._setFilter = function (currentPage) {
    qs(".filters .selected").className = "";
    qs('.filters [href="#/' + currentPage + '"]').className = "selected";
  };

  /**
   * Vérifie si l'élément est terminé
   * @param {number} id ID de l'élément à vérifier
   * @param {boolean} completed status de l'élément
   * @function View#_elementComplete
   */
  View.prototype._elementComplete = function (id, completed) {
    var listItem = qs('[data-id="' + id + '"]');

    if (!listItem) {
      return;
    }

    listItem.className = completed ? "completed" : "";

    // Dans le cas où il a été basculé à partir d'un événement et non en cliquant sur la case à cocher
    qs("input", listItem).checked = completed;
  };

  /**
   * Affiche l'édition de l'élément à modifier
   * @param {number} id ID de l'élément à modifier
   * @param {string} title Contenu de l'élément
   * @function View#_editItem
   */
  View.prototype._editItem = function (id, title) {
    var listItem = qs('[data-id="' + id + '"]');

    if (!listItem) {
      return;
    }

    listItem.className = listItem.className + " editing";

    var input = document.createElement("input");
    input.className = "edit";

    listItem.appendChild(input);
    input.focus();
    input.value = title;
  };

  /**
   * Remplace l'ancien élément par le nouveau
   * @param {number} id ID de l'élément édité
   * @param {string} title nouveau contenu de l'élément
   * @function View#_editItemDone
   */
  View.prototype._editItemDone = function (id, title) {
    var listItem = qs('[data-id="' + id + '"]');

    if (!listItem) {
      return;
    }

    var input = qs("input.edit", listItem);
    listItem.removeChild(input);

    listItem.className = listItem.className.replace("editing", "");

    qsa("label", listItem).forEach(function (label) {
      label.textContent = title;
    });
  };

  /**
   * Rendre une commande spécifique
   * @param {string} viewCmd La commande que nous voulons rendre
   * @param {object} parameter Paramètres de cette commande
   *  @function View#render
   */
  View.prototype.render = function (viewCmd, parameter) {
    var self = this;
    var viewCommands = {
      showEntries: function () {
        self.$todoList.innerHTML = self.template.show(parameter);
      },
      removeItem: function () {
        self._removeItem(parameter);
      },
      updateElementCount: function () {
        self.$todoItemCounter.innerHTML = self.template.itemCounter(parameter);
      },
      clearCompletedButton: function () {
        self._clearCompletedButton(parameter.completed, parameter.visible);
      },
      contentBlockVisibility: function () {
        self.$main.style.display = self.$footer.style.display =
          parameter.visible ? "block" : "none";
      },
      toggleAll: function () {
        self.$toggleAll.checked = parameter.checked;
      },
      setFilter: function () {
        self._setFilter(parameter);
      },
      clearNewTodo: function () {
        self.$newTodo.value = "";
      },
      elementComplete: function () {
        self._elementComplete(parameter.id, parameter.completed);
      },
      editItem: function () {
        self._editItem(parameter.id, parameter.title);
      },
      editItemDone: function () {
        self._editItemDone(parameter.id, parameter.title);
      },
    };

    viewCommands[viewCmd]();
  };

  /**
   * Attribue un ID à un élément
   *  @param {object} element L'élément actif
   * @function View#_itemId
   */
  View.prototype._itemId = function (element) {
    var li = $parent(element, "li");
    return parseInt(li.dataset.id, 10);
  };

  /**
   * Désactive l'affichage de l'édition de l'élément lorsqu'il est validé
   * @param {function} handler
   * @function View#_bindItemEditDone
   */
  View.prototype._bindItemEditDone = function (handler) {
    var self = this;
    $delegate(self.$todoList, "li .edit", "blur", function () {
      if (!this.dataset.iscanceled) {
        handler({
          id: self._itemId(this),
          title: this.value,
        });
      }
    });

    $delegate(self.$todoList, "li .edit", "keypress", function (event) {
      if (event.keyCode === self.ENTER_KEY) {
        // Supprimez le curseur de la saisie lorsque vous appuyez sur la touche Entrée,
        // comme s'il s'agissait d'un vrai formulaire.
        this.blur();
      }
    });
  };

  /**
   *  Désactive l'affichage de l'édition de l'élément lorsqu'il est annulé
   * @param {function} handler
   * @function View#_bindItemEditCancel
   */

  View.prototype._bindItemEditCancel = function (handler) {
    var self = this;
    $delegate(self.$todoList, "li .edit", "keyup", function (event) {
      if (event.keyCode === self.ESCAPE_KEY) {
        this.dataset.iscanceled = true;
        this.blur();

        handler({ id: self._itemId(this) });
      }
    });
  };

  /**
   * Se lie à {@link Controller} fonctions avec {@link View} events
   * @param {function} event
   * @param {function} handler
   * @function View#bind
   */
  View.prototype.bind = function (event, handler) {
    var self = this;

    switch (event) {
      case "newTodo":
        $on(self.$newTodo, "change", function () {
          handler(self.$newTodo.value);
        });
        break;
      case "removeCompleted":
        $on(self.$clearCompleted, "click", function () {
          handler();
        });
        break;
      case "toggleAll":
        $on(self.$toggleAll, "click", function () {
          handler({ completed: this.checked });
        });
        break;
      case "itemEdit":
        $delegate(self.$todoList, "li label", "dblclick", function () {
          handler({ id: self._itemId(this) });
        });
        break;
      case "itemRemove":
        $delegate(self.$todoList, ".destroy", "click", function () {
          handler({ id: self._itemId(this) });
        });
        break;
      case "itemToggle":
        $delegate(self.$todoList, ".toggle", "click", function () {
          handler({
            id: self._itemId(this),
            completed: this.checked,
          });
        });
        break;
      case "itemEditDone":
        self._bindItemEditDone(handler);
        break;
      case "itemEditCancel":
        self._bindItemEditCancel(handler);
        break;
    }
  };

  // Exporter vers window
  window.app = window.app || {};
  window.app.View = View;
})(window);
