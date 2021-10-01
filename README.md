<h1 style="text-align: center;">Todo List</h1>

<h2> 1- Présentation du projet</h2>
<p>Todo List est une application simple et efficace, qui permet de gérer des listes de tâches à effectuer. Une fois la tâche crée, elle peut être modifiée ou supprimée définitivement.</p>
<h2> 2- Aspects techniques</h2>
<h3>2-1 Language </h3>
<p>
Aucune bibliothèque tierce n'a été utilisée, puisque cette application a été développée en Vanilla JS ( pure langage JavaScript).
</p>
<h3>2-2 Tests unitaires </h3>
<p>
Jasmine a été utilisé pour mener à bien l'ensemble des tests. C'est un framework de test open source pour JavaScript. 
Ces tests unitaires ont été réalisés selon la méthode TDD ( Test Driven Development ou Développements Pilotés par les Tests).
</p>
<h3>2-3 Architecture </h3>
<p>
Cette application a été developpée à l'aide du modèle MVC (Model-View-Controller ou Modèle-Vue-Contrôleur) Il met l'accent sur la séparation entre la logique métier et l'affichage l'application.
</p>

![Schéma-MVC](https://blogdummi.fr/wp-content/uploads/2019/01/schema-general-architecture-mvc.png)

<h3>2-4 Stockage </h3>
<p>
Le stockage de la liste des tâches sera sauvegardé chez l'utilisateur en local. Cette liste ne pourra pas être utilisé sur un autre support. Si l'utilisateur vide le cache du navigateur, la liste n'existera plus.
</p>
<br>
<br>
