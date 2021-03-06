<h1 style="text-align: center; border: 1px solid purple;color:purple">Todos</h1>
<h2 style="text-align: center; border: 1 solid red">Documentation Technique</h2>
<!--------------------------------- 1 Présentation du projet --------------------------->
<h2 style="text-decoration: underline; color:purple"> <strong>1 Présentation du projet </strong></h2>
<p>Todos est une application simple et efficace, qui permet de créer et gérer des listes de tâches à effectuer. Une fois la tâche créée, elle peut être modifiée ou supprimée définitivement. Un filtre permet de choisir le type de tâche à afficher ( "toute(s)" | active(s) | complétée(s). Tant que l'utilisateur n'efface pas le cache du navigateur, la liste des tâches restera accessible. L'utilisateur ne pourra y avoir accès qu'à partir du support sur lequel cette liste a été crée.</p>
<p align="center">
<img src="https://raw.githubusercontent.com/cheventner/todo/main/img/usercase.png" style="width : 400px">
</p>

<!--------------------------------- 2 Language --------------------------->
<h2 style="text-decoration: underline;color:purple"> <strong>2 Language</strong></h2>
<p>
Aucune bibliothèque tierce n'a été utilisée, puisque cette application a été développée en Vanilla JS ( pure langage JavaScript).
</p>

<!--------------------------------- 3 Architecture du projet --------------------------->
<h2 style="text-decoration: underline;color:purple"><strong>3 Architecture du projet</strong></h2>
<p>Le fonctionnement de l'application se situe dans le fichier "js"</p>
<p align="center">
<img src="https://raw.githubusercontent.com/cheventner/todo/main/img/fichierfonctionnement.png" style="width : 100px">
</p>

<!--------------------------------- 4 Architecture MVC --------------------------->
<h2 style="text-decoration: underline;color:purple"><strong>4 Architecture MVC</strong></h2>
<p>
Cette application a été developpée avec l'architecture logicielle MVC (Model-View-Controller ou Modèle-Vue-Contrôleur). Il met l'accent sur la séparation entre la logique métier et l'affichage l'application.
</p>
<ul>
<li>Modèle (Model) : contient les données à afficher.</li>  
<li>Vue (View) : contient la présentation de l'interface graphique.</li>  
<li>Contrôleur (Controller) : contient la logique concernant les actions effectuées par l'utilisateur.</li>  
</ul>
<p align="center">
<img src="https://blogdummi.fr/wp-content/uploads/2019/01/schema-general-architecture-mvc.png" style="width : 400px"></p>

<br>
<ul>
<li>Model :  il récupère les informations de la BD, les organisent et les assemblent afin d'être traitées par le contrôleur.</li>  
<li>Vue : elle récupère des variables afin de connaître la façon dont elles doivent être affichées.</li>  
<li>Contrôleur : il sert d'intermédiaire entre la Vue et le Modèle. Il récupère les données du "Modèle", les analysent, prends des décisions et renvoie le texte à afficher dans "Vue".</li>  
</ul>

<!------------------------------------------- 5 NPM ------------------------------------->
<h2 style="text-decoration: underline;color:purple"><strong>5 NPM</strong> </h2>
<img src="https://raw.githubusercontent.com/cheventner/todo/main/img/logoNpm.png" style="width : 100px">
<p> Npm automatise toute la gestion des dépendances et des paquets des projets JavaScript. Plus besoin de télécharger, installer et mettre à jour régulièrement les codes sources des différents paquets (modules, librairies, frameworks etc.) dont le projet dépend.
</br>
Toutes les dépendances sont listées dans un fichier package.json et toutes leurs sources sont disponibles dans un dossier /node_modules/ présent à la racine du projet.</p>
<p align="center">
<img src="https://raw.githubusercontent.com/cheventner/todo/main/img/nodeModules.png" style="width : 100px">
</p>

<!-------------------------------------------- 6 JSHINT -------------------------------->
<h2 style="text-decoration: underline;color:purple"><strong>6 JSHint</strong> </h2>
<img src="https://raw.githubusercontent.com/cheventner/todo/main/img/jshint.png" style="width : 100px">
<p> JSHint est un outil d'analyse de code statique. Il est utilisé dans le développement de logiciels pour vérifier si le code source JavaScript est conforme aux règles de codage. 
<a href="https://jshint.com/docs/">Doc JSHint</a>
</p>

<!------------------------------------------- 7 Jasmine --------------------------->
<h2 style="text-decoration: underline;color:purple"><strong>7 Tests unitaires</strong> </h2>
<img src="https://raw.githubusercontent.com/cheventner/todo/main/img/LogoJasmine.png">
<p>Le framework Jasmine a été utilisé pour mener à bien l'ensemble des tests. C'est un framework de test open source pour JavaScript.
Ces tests unitaires ont été réalisés selon la méthode TDD ( Test Driven Development ou Développements Pilotés par les Tests).</p>
<a href="https://jasmine.github.io/">Doc Jasmine</a>
<p align="center">
<img src="https://raw.githubusercontent.com/cheventner/todo/main/img/testJasmine.png" style="width : 500px">
</p>

<!-------------------------------------------- 8 JSDoc -------------------------------->
<h2 style="text-decoration: underline;color:purple"><strong>8 JSDoc</strong> </h2>
<img src="https://raw.githubusercontent.com/cheventner/todo/main/img/logoJsdoc.jpng.jpeg" style="width : 100px">
<p> JSDoc est un langage de balisage utilisé pour documenter les codes sources Javascript. En utilisant des commentaires qui contiennent des informations pour JSDoc, il est possible de créer la documentation de l'interface de programmation du code créé. Des balises telles que @ class @param, @function, @example permettent de bien documenté le code, il en existe énormément. <a href="https://jsdoc.app/">Doc JSDoc</a>
</p>
<p align="center">
<img src="https://raw.githubusercontent.com/cheventner/todo/main/img/exampleJsdocComment.png" style="width : 600px">
</p>
<p align="center">
<img src="https://raw.githubusercontent.com/cheventner/todo/main/img/modelJsdoc.png" style="width : 600px">
</p>

<!----------------------------------------- 9 Mode strict ------------------------------>
<h2 style="text-decoration: underline;color:purple"><strong>9 Le mode strict</strong> </h2>
<p> L'application est codé en mode "strict. Celui-ci apporte quelques changements à la sémantique « normale » de JavaScript. Son but principal est de faire plus de vérification. Cela va permettre de mieux détecter des erreurs que le moteur JavaScript aurait laissé passé en mode normal.
</p>
<p align="center">
<img src="https://raw.githubusercontent.com/cheventner/todo/main/img/userStrict.png" style="width : 200px">
</p>

<!----------------------------------------- 10 Le stockage local ------------------------------>
<h2 style="text-decoration: underline;color:purple"><strong>10 Le stockage local (localStorage)</strong> </h2>
<p>
Le stockage de la liste des tâches sera sauvegardé sur le navigateur de l'utilisateur. Cette méthode appelée "localStorage" est une alternative à l’utilisation des sessions en PHP, il est plus rapide à utiliser puisqu’il ne nécessite pas de requête HTTP (mode hors ligne). Les données sont persitantes d'une session à l'autre (contrairement à sessionStorage qui maintient le stockage seulement lorsque la fenêtre du navigateur est active).

Cette liste ne pourra pas être utilisé sur un autre support. Si l'utilisateur vide le cache du navigateur, la liste n'existera plus.
A noté que les données sont au format JSON et doivent par conséquent être converties en "string" pour être stockées.

</p>
<p align="center">
<img src="https://raw.githubusercontent.com/cheventner/todo/main/img/localstorage.png" style="width : 400px">
</p>
<p align="center">
<img src="https://raw.githubusercontent.com/cheventner/todo/main/img/JSONconvertedString.png" style="width : 400px">
</p>
<br>
<br>
