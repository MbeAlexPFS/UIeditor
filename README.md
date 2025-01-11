# Information

Ceci est un framework javascript encore en phase de développement car très rigide dans la sélection des éléments et ne permet l'exportation de la page dans l'éditeur (obliger de passer par un code js ou de passer par l'inspection du navigateur au niveau de la vue pour extraire le code).

# Usage
- Sélectionner les éléments dans la barre en bas.
- Utiliser le slider de la couche d'édition pour éditer les éléments par profondeur.
- Le reste est plutôt intuitif.

# API
La classe: `Uieditor`
les paramètres de la classe: `contentID, maxLayer`
fonction: `addComponent(< nom >,< chemin vers une image illustrative >,< code de l'élément>), init`

# Exemple
## En HTML:  création d'une div (l'id est l'identifiant par défaut pour le framework (contentID) )

    <div  id="editor-content"></div>


## En JS: déclaration de la classe, ajout de quelques éléments html pour l'éditeur, l'initiation.

    ed  =  new  UIeditor()
    
    ed.addComponent('div','img/container.png',
    
    `<div class='element0'> div </div>`
    
    )
    
    ed.addComponent('button','img/button.png',
    
    `<button class='element0 btn btn-primary'> button </button>`
    
    )
    
    ed.init()
