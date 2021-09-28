/*global app, jasmine, describe, it, beforeEach, expect */

describe("controller", function () {
  "use strict";

  var subject, model, view;

  var setUpModel = function (todos) {
    model.read.and.callFake(function (query, callback) {
      callback = callback || query;
      callback(todos);
    });

    model.getCount.and.callFake(function (callback) {
      var todoCounts = {
        active: todos.filter(function (todo) {
          return !todo.completed;
        }).length,
        completed: todos.filter(function (todo) {
          return !!todo.completed;
        }).length,
        total: todos.length,
      };

      callback(todoCounts);
    });

    model.remove.and.callFake(function (id, callback) {
      callback();
    });

    model.create.and.callFake(function (title, callback) {
      callback();
    });

    model.update.and.callFake(function (id, updateData, callback) {
      callback();
    });
  };

  var createViewStub = function () {
    var eventRegistry = {};
    return {
      render: jasmine.createSpy("render"),
      bind: function (event, handler) {
        eventRegistry[event] = handler;
      },
      trigger: function (event, parameter) {
        eventRegistry[event](parameter);
      },
    };
  };

  beforeEach(function () {
    model = jasmine.createSpyObj("model", [
      "read",
      "getCount",
      "remove",
      "create",
      "update",
    ]);
    view = createViewStub();
    subject = new app.Controller(model, view);
  });
  // devrait afficher les entrées au démarrage
  it("should show entries on start-up", function () {
    //! TODO: write test
    var todo = {};
    setUpModel([todo]);
    subject.setView("");
    expect(view.render).toHaveBeenCalledWith("showEntries", [todo]);
  });

  describe("routing", function () {
    // devrait montrer toutes les entrées sans parcours
    it("should show all entries without a route", function () {
      var todo = { title: "my todo" };
      setUpModel([todo]);

      subject.setView("");

      expect(view.render).toHaveBeenCalledWith("showEntries", [todo]);
    });
    // devrait montrer toutes les entrées sans parcours "all".
    it('should show all entries without "all" route', function () {
      var todo = { title: "my todo" };
      setUpModel([todo]);

      subject.setView("#/");

      expect(view.render).toHaveBeenCalledWith("showEntries", [todo]);
    });
    // devrait montrer les entrées actives
    it("should show active entries", function () {
      //! TODO: write test
      var todo = { title: "monTitre", completed: false };
      setUpModel([todo]);
      subject.setView("#/active");
      expect(view.render).toHaveBeenCalledWith("showEntries", [
        { title: "monTitre", completed: false },
      ]);
    });
    // devrait montrer les entrées complétées
    it("should show completed entries", function () {
      //! TODO: write test
      var todo = { title: "monTitre", completed: true };
      setUpModel([todo]);
      subject.setView("#/completed");
      expect(view.render).toHaveBeenCalledWith("showEntries", [
        { title: "monTitre", completed: true },
      ]);
    });
  });
  // doit afficher le bloc de contenu lorsque les todos existent
  it("should show the content block when todos exists", function () {
    setUpModel([{ title: "my todo", completed: true }]);

    subject.setView("");

    expect(view.render).toHaveBeenCalledWith("contentBlockVisibility", {
      visible: true,
    });
  });
  // devrait masquer le bloc de contenu lorsqu'il n'existe pas de todos
  it("should hide the content block when no todos exists", function () {
    setUpModel([]);

    subject.setView("");

    expect(view.render).toHaveBeenCalledWith("contentBlockVisibility", {
      visible: false,
    });
  });
  // devrait vérifier le bouton "Tout basculer", si toutes les tâches sont terminées.
  it("should check the toggle all button, if all todos are completed", function () {
    setUpModel([{ title: "my todo", completed: true }]);

    subject.setView("");

    expect(view.render).toHaveBeenCalledWith("toggleAll", {
      checked: true,
    });
  });
  // devrait mettre en place le bouton "effacer complètement"
  it('should set the "clear completed" button', function () {
    var todo = { id: 42, title: "my todo", completed: true };
    setUpModel([todo]);

    subject.setView("");

    expect(view.render).toHaveBeenCalledWith("clearCompletedButton", {
      completed: 1,
      visible: true,
    });
  });
  // devrait mettre en évidence le filtre "Tout" par défaut
  it('should highlight "All" filter by default', function () {
    //! TODO: write test
    var todo = [
      { id: 15, title: "my todo", completed: false },
      { id: 68, title: "my todo", completed: true },
    ];
    setUpModel([todo]);

    subject.setView("");
    expect(view.render).toHaveBeenCalledWith("setFilter", "");
  });
  // devrait mettre en évidence le filtre "actif" lors du passage à la vue active
  it('should highlight "Active" filter when switching to active view', function () {
    // TODO: write test
    var todo = [
      { id: 15, title: "my todo", completed: false },
      { id: 68, title: "my todo", completed: true },
    ];
    setUpModel([todo]);

    subject.setView("#/active");
    expect(view.render).toHaveBeenCalledWith("setFilter", "active");
  });
  // devrait faire basculer tous les todos sur terminé
  describe("toggle all", function () {
    it("should toggle all todos to completed", function () {
      //! TODO: write test
      var todo = [
        { id: 15, title: "my todo", completed: false },
        { id: 68, title: "my todo", completed: false },
      ];
      setUpModel(todo);

      subject.setView("");

      view.trigger("toggleAll", { completed: true });

      expect(model.update).toHaveBeenCalledWith(
        15,
        { completed: true },
        jasmine.any(Function)
      );
      expect(model.update).toHaveBeenCalledWith(
        68,
        { completed: true },
        jasmine.any(Function)
      );
    });
    // devrait mettre à jour la vue
    it("should update the view", function () {
      // TODO: write test
      var todo = [
        { id: 15, title: "my todo", completed: false },
        { id: 68, title: "my todo", completed: false },
      ];
      setUpModel(todo);

      subject.setView("");
      view.trigger("toggleAll", { completed: true });
      expect(view.render).toHaveBeenCalledWith("elementComplete", {
        id: 15,
        completed: true,
      });
      expect(view.render).toHaveBeenCalledWith("elementComplete", {
        id: 68,
        completed: true,
      });
    });
  });

  describe("new todo", function () {
    // devrait ajouter un nouveau todo au modèle
    it("should add a new todo to the model", function () {
      //! TODO: write test
      setUpModel([]);

      subject.setView("");
      view.trigger("newTodo", "a new todo");
      expect(model.create).toHaveBeenCalledWith(
        "a new todo",
        jasmine.any(Function)
      );
    });
    // devrait ajouter une nouvelle tâche à la vue
    it("should add a new todo to the view", function () {
      setUpModel([]);

      subject.setView("");

      view.render.calls.reset();
      model.read.calls.reset();
      model.read.and.callFake(function (callback) {
        callback([
          {
            title: "a new todo",
            completed: false,
          },
        ]);
      });

      view.trigger("newTodo", "a new todo");

      expect(model.read).toHaveBeenCalled();

      expect(view.render).toHaveBeenCalledWith("showEntries", [
        {
          title: "a new todo",
          completed: false,
        },
      ]);
    });

    it("should clear the input field when a new todo is added", function () {
      setUpModel([]);

      subject.setView("");

      view.trigger("newTodo", "a new todo");

      expect(view.render).toHaveBeenCalledWith("clearNewTodo");
    });
  });

  describe("element removal", function () {
    // doit supprimer une entrée du modèle
    it("should remove an entry from the model", function () {
      // TODO: write test
      var todo = { id: 68, title: "my todo", completed: true };
      setUpModel([todo]);

      subject.setView("");
      view.trigger("itemRemove", { id: 68 });

      expect(model.remove).toHaveBeenCalledWith(68, jasmine.any(Function));
    });
    // doit supprimer une entrée de la vue
    it("should remove an entry from the view", function () {
      var todo = { id: 42, title: "my todo", completed: true };
      setUpModel([todo]);

      subject.setView("");
      view.trigger("itemRemove", { id: 42 });

      expect(view.render).toHaveBeenCalledWith("removeItem", 42);
    });
    // devrait mettre à jour le nombre d'éléments
    it("should update the element count", function () {
      var todo = { id: 42, title: "my todo", completed: true };
      setUpModel([todo]);

      subject.setView("");
      view.trigger("itemRemove", { id: 42 });

      expect(view.render).toHaveBeenCalledWith("updateElementCount", 0);
    });
  });
  // retirer complété
  describe("remove completed", function () {
    //doit supprimer une entrée "complétée"du modèle
    it("should remove a completed entry from the model", function () {
      var todo = { id: 42, title: "my todo", completed: true };
      setUpModel([todo]);

      subject.setView("");
      view.trigger("removeCompleted");

      expect(model.read).toHaveBeenCalledWith(
        { completed: true },
        jasmine.any(Function)
      );
      expect(model.remove).toHaveBeenCalledWith(42, jasmine.any(Function));
    });

    it("should remove a completed entry from the view", function () {
      var todo = { id: 42, title: "my todo", completed: true };
      setUpModel([todo]);

      subject.setView("");
      view.trigger("removeCompleted");

      expect(view.render).toHaveBeenCalledWith("removeItem", 42);
    });
  });

  describe("element complete toggle", function () {
    it("should update the model", function () {
      var todo = { id: 21, title: "my todo", completed: false };
      setUpModel([todo]);
      subject.setView("");

      view.trigger("itemToggle", { id: 21, completed: true });

      expect(model.update).toHaveBeenCalledWith(
        21,
        { completed: true },
        jasmine.any(Function)
      );
    });

    it("should update the view", function () {
      var todo = { id: 42, title: "my todo", completed: true };
      setUpModel([todo]);
      subject.setView("");

      view.trigger("itemToggle", { id: 42, completed: false });

      expect(view.render).toHaveBeenCalledWith("elementComplete", {
        id: 42,
        completed: false,
      });
    });
  });

  describe("edit item", function () {
    it("should switch to edit mode", function () {
      var todo = { id: 21, title: "my todo", completed: false };
      setUpModel([todo]);

      subject.setView("");

      view.trigger("itemEdit", { id: 21 });

      expect(view.render).toHaveBeenCalledWith("editItem", {
        id: 21,
        title: "my todo",
      });
    });

    it("should leave edit mode on done", function () {
      var todo = { id: 21, title: "my todo", completed: false };
      setUpModel([todo]);

      subject.setView("");

      view.trigger("itemEditDone", { id: 21, title: "new title" });

      expect(view.render).toHaveBeenCalledWith("editItemDone", {
        id: 21,
        title: "new title",
      });
    });

    it("should persist the changes on done", function () {
      var todo = { id: 21, title: "my todo", completed: false };
      setUpModel([todo]);

      subject.setView("");

      view.trigger("itemEditDone", { id: 21, title: "new title" });

      expect(model.update).toHaveBeenCalledWith(
        21,
        { title: "new title" },
        jasmine.any(Function)
      );
    });

    it("should remove the element from the model when persisting an empty title", function () {
      var todo = { id: 21, title: "my todo", completed: false };
      setUpModel([todo]);

      subject.setView("");

      view.trigger("itemEditDone", { id: 21, title: "" });

      expect(model.remove).toHaveBeenCalledWith(21, jasmine.any(Function));
    });

    it("should remove the element from the view when persisting an empty title", function () {
      var todo = { id: 21, title: "my todo", completed: false };
      setUpModel([todo]);

      subject.setView("");

      view.trigger("itemEditDone", { id: 21, title: "" });

      expect(view.render).toHaveBeenCalledWith("removeItem", 21);
    });

    it("should leave edit mode on cancel", function () {
      var todo = { id: 21, title: "my todo", completed: false };
      setUpModel([todo]);

      subject.setView("");

      view.trigger("itemEditCancel", { id: 21 });

      expect(view.render).toHaveBeenCalledWith("editItemDone", {
        id: 21,
        title: "my todo",
      });
    });

    it("should not persist the changes on cancel", function () {
      var todo = { id: 21, title: "my todo", completed: false };
      setUpModel([todo]);

      subject.setView("");

      view.trigger("itemEditCancel", { id: 21 });

      expect(model.update).not.toHaveBeenCalled();
    });
  });
});
