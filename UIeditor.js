function textReplace(word, text) {
    var nouveauTexte = text.replace(new RegExp("\\b" + word + "\\b", "g"), "");
    return nouveauTexte;
}

function getNumber(chaine) {
    var numero = chaine.match(/\d+/); // Utilisation d'une expression régulière pour extraire les chiffres
    if (numero) {
      return parseInt(numero[0]); // Utilisation de parseInt pour convertir la chaîne en nombre entier
    } else {
      return null; // Retourne null si aucun numéro n'est trouvé dans la chaîne
    }
}

class UIeditor {
    constructor() {
        this.contentID = 'editor-content';
        this.contentHTML = '';
        this.component = [];
        this.componentSelected = '';
        this.elementSelected = '';
        this.maxLayer = 3
        this.layer = 0
    }

    addComponent(name, img = '', html = '') {
        this.component.push({
            name: name,
            img: img,
            html: html
        });
    }

    init() {
        //configuration de l'interface
        this.contentHTML = document.getElementById(this.contentID);
        this.contentHTML.innerHTML = `
            <div class="container-fluid">
                <div class="row">
                    <div id="view" class="view col-md-9 border border-2 border-primary">
                
                    </div>
                    <div id="data" class="edit col-md-3 border border-2 border-dark">
                        
                    </div>
                    <div id="component" class="component d-flex col-md-12 border border-2 border-success pt-2">
                        
                    </div>
                </div>
            </div>`;

        this.viewHTML = this.contentHTML.querySelector("#view");
        this.dataHTML = this.contentHTML.querySelector("#data");
        this.componentHTML = this.contentHTML.querySelector("#component");

        this.dataHTML.innerHTML = `
            <h4> Couche d'edition </h4>
            <div class="form-group">
                <label for="">Couche</label>
                <input type="range" class="form-range" value="${this.layer}" id="layer" max="${this.maxLayer}" aria-describedby="rangeNb">
                <small id="rangeNb" class="form-text text-muted">Help text</small>
            </div>
            <h4> Ajout direct </h4> 
            <button id="addRoot" class="mt-3 m-auto btn btn-primary">
                Ajouter un élément à la racine
            </button>
            <button id="addEnd" class="mt-3 m-auto btn btn-primary">
                Ajouter un élément à la fin
            </button>
            <hr>`;

        //ajouter les composants
        this.component.forEach(element => {
            this.componentHTML.innerHTML += `
                <div id="${element.name}" class="cpn text-center">
                    <img src="${element.img}" width="100vh" height="100vh">
                    <h5>${element.name}</h5>
                </div>`;
        });

        // Sélectionnez tous les éléments avec la classe 'element'
        var components = this.componentHTML.querySelectorAll('.cpn');

        //layer
        var layerTurn = this.dataHTML.querySelector('#layer');
        var rangeNb = this.dataHTML.querySelector('#rangeNb');
        rangeNb.innerHTML = "couche n*" + this.layer
        layerTurn.addEventListener('input', () => {
            this.layer = layerTurn.value
            rangeNb.innerHTML = "couche n*" + this.layer
        });

        //add to root
        var addRoot = this.dataHTML.querySelector('#addRoot');

        addRoot.addEventListener('click', () => {
            var selectedComponent = this.component.find(element => element.name === this.componentSelected);
            if (selectedComponent) {
                this.viewHTML.innerHTML = selectedComponent.html + this.viewHTML.innerHTML;
            }
        });

        //add to end
        var addEnd = this.dataHTML.querySelector('#addEnd');

        addEnd.addEventListener('click', () => {
            var selectedComponent = this.component.find(element => element.name === this.componentSelected);
            if (selectedComponent) {
                this.viewHTML.innerHTML += selectedComponent.html;
            }
        });

        // Parcourez chaque élément et ajoutez un gestionnaire d'événement de clic
        components.forEach((component) => {
            component.addEventListener('click', () => {
                // Cet élément a été cliqué
                this.componentSelected = component.id;

                components.forEach((component) => {
                    component.setAttribute('class', component.id === this.componentSelected ? 'cpn text-center border rounded border-5 border-primary' : 'cpn text-center');
                });
            });
        });

        this.viewHTML.addEventListener('click', () => {
            for (let index = 0; index < this.maxLayer; index++) {
                var elements = this.viewHTML.querySelectorAll('.element'+String(index));
                elements.forEach((element) => {
                    element.onclick = null
                });
            }

            var elements = this.viewHTML.querySelectorAll('.element'+String(this.layer));    
            
            elements.forEach((element) => {
                element.onclick = () => {
                    // Cet élément a été cliqué
                    for (let index = 0; index < this.maxLayer; index++) {
                        var elements = this.viewHTML.querySelectorAll('.element'+String(index));
                        elements.forEach((element) => {
                            if (element.classList.contains('selected')) {
                                element.classList.remove('selected');
                            }
                        });
                        if (element.classList.contains('element'+String(this.layer))) {
                            element.classList.add('selected');      
                        }
                    }
                    //genere form
                    var form = '';
                    var attributs = element.attributes;
                    var atts = ''; // attributs data
                    // Parcourez les attributs et affichez-les
                    for (var i = 0; i < attributs.length; i++) {
                      var attribut = attributs[i];
                      var nomAttribut = attribut.name;
                      var valeurAttribut = attribut.value;
                        
                        if (nomAttribut != 'style') {
                            atts += nomAttribut + " = '" + valeurAttribut + "' ";
                        }  
                        
                    }

                    var styles = window.getComputedStyle(element);
                    var sts = '' //style data

                    // Parcourez les propriétés de style et affichez-les
                    for (var i = 0; i < styles.length; i++) {
                      var propriete = styles[i];
                      var valeur = styles.getPropertyValue(propriete);
                    
                      sts += propriete + " = '" + valeur +"'; \n";
                    }

                    form = `
                        <div class="form-group">
                            <label for="attributs">attributs</label>
                            <textarea class="form-control" id="attributs" placeholder="éditer attributs de l'élément">${atts}</textarea>
                        </div>
                        <div class="form-group">
                            <label for="contenu">contenu</label>
                            <textarea class="form-control" id="contenu" placeholder="éditer contenu de l'élément">${element.innerHTML}</textarea>
                        </div>
                        <div class="form-group">
                            <label for="style">style</label>
                            <textarea class="form-control" id="style" placeholder="éditer style de l'élément">${sts}</textarea>
                        </div>`;

                    //add edit input
                    this.dataHTML.innerHTML = `
                        <h4> Couche d'edition </h4>
                        <div class="form-group">
                            <label for="">Couche</label>
                            <input type="range" class="form-range" value="${this.layer}" id="layer" max="${this.maxLayer}" aria-describedby="rangeNb">
                            <small id="rangeNb" class="form-text text-muted">Help text</small>
                        </div>
                        <h4> Ajout direct </h4> 
                        <button id="addRoot" class="mt-3 m-auto btn btn-primary">
                            Ajouter un élément à la racine
                        </button>
                        <button id="addEnd" class="mt-3 m-auto btn btn-primary">
                            Ajouter un élément à la fin
                        </button>
                        <hr>
                        <h4> Ajout à partir de l'element</h4>
                        <button id="beforeItem" class="mt-1 mb-2 m-auto btn btn-primary">
                            ajouter avant
                        </button>
                        <button id="inItem" class="mt-1 mb-2 m-auto btn btn-primary">
                            ajouter dedans
                        </button> 
                        <button id="afterItem" class="mt-1 mb-2 m-auto btn btn-primary">
                            ajouter après
                        </button>
                        <hr>  
                        <h4> édition de ${element.tagName.toLowerCase()} </h4>
                        <button id="deleteItem" class="mt-1 mb-2 m-auto btn btn-danger">
                            Supprimer cet element
                        </button>
                        ${form}
                        <button id="updateItem" class="mt-2 mb-1 m-auto btn btn-success">
                            mettre à jour
                        </button>`;
                    
                    //verify if element selected
                    for (let index = 0; index < this.maxLayer; index++) {
                        var elements = this.viewHTML.querySelectorAll('.element'+String(index));
                        if (element.classList.contains('selected')) {
                            break;    
                        }else if (index == this.maxLayer - 1) {
                            this.dataHTML.innerHTML = this.dataHTML.innerHTML = `
                            <h4> Couche d'edition </h4>
                            <div class="form-group">
                                <label for="">Couche</label>
                                <input type="range" class="form-range" value="${this.layer}" id="layer" max="${this.maxLayer}" aria-describedby="rangeNb">
                                <small id="rangeNb" class="form-text text-muted">Help text</small>
                            </div>
                            <h4> Ajout direct </h4> 
                            <button id="addRoot" class="mt-3 m-auto btn btn-primary">
                                Ajouter un élément à la racine
                            </button>
                            <button id="addEnd" class="mt-3 m-auto btn btn-primary">
                                Ajouter un élément à la fin
                            </button>
                            <hr>`;
                        }
                    }
                    

                    //change layer
                    var layerTurn = this.dataHTML.querySelector('#layer');
                    var rangeNb = this.dataHTML.querySelector('#rangeNb');
                    rangeNb.innerHTML = "couche n*" + this.layer
                    layerTurn.addEventListener('input', () => {
                        this.layer = layerTurn.value
                        rangeNb.innerHTML = "couche n*" + this.layer
                    });
                    //add with element
                    var beforeItem = this.dataHTML.querySelector('#beforeItem');
                    beforeItem.addEventListener('click', () => {
                        var selectedComponent = this.component.find(element => element.name === this.componentSelected);
                        if (selectedComponent) {
                            element.insertAdjacentHTML("beforebegin", selectedComponent.html);
                            var el = (element.parentNode).querySelectorAll('.element0');
                            el.forEach((e) => {
                                e.classList.remove('element0')
                                e.setAttribute('class',e.getAttribute('class') + ` element${Number(this.layer)}`);
                            })
                        }  
                    });

                    var inItem = this.dataHTML.querySelector('#inItem');
                    inItem.addEventListener('click', () => {
                        var selectedComponent = this.component.find(element => element.name === this.componentSelected);
                        if (selectedComponent) {
                            element.innerHTML = selectedComponent.html;
                            var el = element.querySelectorAll('.element0');
                            el.forEach((e) => {
                                if ((Number(this.layer) + 1) > this.maxLayer) {
                                    alert("vous avez atteint la couche maximal")     
                                }else{
                                    e.classList.remove('element0')
                                    e.setAttribute('class',e.getAttribute('class') + ` element${Number(this.layer) + 1}`);
                                }
                                
                            })
                        }  
                    });

                    var afterItem = this.dataHTML.querySelector('#afterItem');
                    afterItem.addEventListener('click', () => {
                        var selectedComponent = this.component.find(element => element.name === this.componentSelected);
                        if (selectedComponent) {
                            element.insertAdjacentHTML("afterend", selectedComponent.html);
                            var el = (element.parentNode).querySelectorAll('.element0');
                            el.forEach((e) => {
                                e.classList.remove('element0')
                                e.setAttribute('class',e.getAttribute('class') + ` element${Number(this.layer)}`);
                            })
                        }  
                    });

                    //add to root
                    addRoot = this.dataHTML.querySelector('#addRoot');

                    addRoot.addEventListener('click', () => {
                        var selectedComponent = this.component.find(element => element.name === this.componentSelected);
                        if (selectedComponent) {
                            this.viewHTML.innerHTML = selectedComponent.html + this.viewHTML.innerHTML;
                        }
                    });
                
                    //add to end
                    addEnd = this.dataHTML.querySelector('#addEnd');
                
                    addEnd.addEventListener('click', () => {
                        var selectedComponent = this.component.find(element => element.name === this.componentSelected);
                        if (selectedComponent) {
                            this.viewHTML.innerHTML += selectedComponent.html;
                        }
                    });

                    //delete item
                    var deleteItem = this.dataHTML.querySelector('#deleteItem');
                
                    deleteItem.addEventListener('click', () => {
                        if ((element.parentNode).childElementCount === 1) {
                            (element.parentNode).innerHTML = 'empty ' + (element.parentNode).tagName.toLowerCase()
                        }else{
                            element.remove()
                        }
                        this.dataHTML.innerHTML = `
                        <h4> Couche d'edition </h4>
                        <div class="form-group">
                            <label for="">Couche</label>
                            <input type="range" class="form-range" value="${this.layer}" id="layer" max="${this.maxLayer}" aria-describedby="rangeNb">
                            <small id="rangeNb" class="form-text text-muted">Help text</small>
                        </div>
                        <h4> Ajout direct </h4> 
                        <button id="addRoot" class="mt-3 m-auto btn btn-primary">
                            Ajouter un élément à la racine
                        </button>
                        <button id="addEnd" class="mt-3 m-auto btn btn-primary">
                            Ajouter un élément à la fin
                        </button>
                        <hr>`;
                        
                        var layerTurn = this.dataHTML.querySelector('#layer');
                        var rangeNb = this.dataHTML.querySelector('#rangeNb');
                        rangeNb.innerHTML = "couche n*" + this.layer
                        layerTurn.addEventListener('input', () => {
                            this.layer = layerTurn.value
                            rangeNb.innerHTML = "couche n*" + this.layer
                        });

                    });

                    
                    //update item
                    //'attributs','contenu','style'
                    var updateItem = this.dataHTML.querySelector('#updateItem');
                    var data_attributes = this.dataHTML.querySelector('#attributs');
                    var data_content = this.dataHTML.querySelector('#contenu');
                    var data_style = this.dataHTML.querySelector('#style');
                
                    updateItem.addEventListener('click', () => {
                        element.innerHTML = data_content.value;

                        var regex = /(\w+)\s*=\s*['"]([^'"]+)['"]/g;
                        var match;
                        while ((match = regex.exec(data_attributes.value)) !== null) {
                          var nomAttribut = match[1];
                          var valeurAttribut = match[2];
                        
                          // Attribuez la valeur de l'attribut à l'élément
                          element.setAttribute(nomAttribut, valeurAttribut);
                        }

                        element.style = data_style.value
                    });
                    
                };
            });
            
        })

    }
}