import { Component, OnInit } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ActionSheetController } from 'ionic-angular/components/action-sheet/action-sheet-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { RecipesService } from '../../services/recipes';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { Recipe } from '../../models/recipe';

@Component({
  selector: 'page-edit-recipe',
  templateUrl: 'edit-recipe.html',
})
export class EditRecipePage implements OnInit {
  mode = 'Nova';
  selectOptions = ['Fácil', 'Média', 'Difícil'];
  recipeForm: FormGroup;
  recipe: Recipe;
  index: number;

  constructor(
      public navParams: NavParams, 
      private actionSheetController:ActionSheetController, 
      private alertCtrl: AlertController,
      private toastCtrl: ToastController,
      private recipesService: RecipesService,
      private navCtrl: NavController) {
  }

  ngOnInit(){
    this.mode = this.navParams.get('mode');
    if (this.mode == 'Editar'){
      this.recipe = this.navParams.get('recipe');
      this.index = this.navParams.get('index')
    }
    this.initializeForm();
  }

  onSubmit() {
    const value = this.recipeForm.value;
    let ingredients = [];
    if (value.ingredients.length > 0) {
      ingredients = value.ingredients.map(name => {
        return {name: name, amount: 1};
      });
    }
    if (this.mode == 'Editar') {
      this.recipesService.updateRecipe(this.index, value.title, value.description, value.difficulty, ingredients);
    } else {
      this.recipesService.addRecipe(value.title, value.description, value.difficulty, ingredients);
    }
    this.recipeForm.reset();
    this.navCtrl.popToRoot();
  }

  onManageIngredients(){
    const actionSheet = this.actionSheetController.create({
      title: 'O que deseja fazer?',
      buttons: [{
        text: 'Adicionar Ingrediente',
        handler: () => {
          this.createNewIngredientAlert().present();
        }
      },
      {
        text: 'Apagar Ingredientes',
        role: 'destructive',
        handler: () => {
          const fArray: FormArray = <FormArray>this.recipeForm.get('ingredients');
          const length = fArray.length;
          if( length > 0){
            for(let i = length - 1; i >= 0; i--){
              fArray.removeAt(i);
            }
            const toast = this.toastCtrl.create({
              message: 'Ingredientes apagados!',
              duration: 1500,
              position: 'bottom'
            });
            toast.present();
          }
        }
      },
      {
        text: 'Cancelar',
        role: 'cancel'
      }
    ]
    });
    actionSheet.present();
  }

  private createNewIngredientAlert(){
    return this.alertCtrl.create({
      title: 'Adicionar Ingrediente',
      inputs: [{
        name: 'nome',
        placeholder: 'Nome'
      }],
      buttons: [{
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Adicionar',
        handler: data => {
          if (data.nome.trim() == '' || data.nome == null ){
            const toast = this.toastCtrl.create({
              message: 'Insira um valor válido',
              duration: 1500,
              position: 'bottom'
            });
            toast.present();
            return;
          }
          (<FormArray>this.recipeForm.get('ingredients'))
            .push(new FormControl(data.nome, Validators.required));

            const toast = this.toastCtrl.create({
              message: 'Ingrediente adicionado',
              duration: 1500,
              position: 'bottom'
            });
            toast.present();
        }
      }]
    });
  }

  private initializeForm(){
    let title = null;
    let description = null;
    let difficulty = 'Fácil';
    let ingredients = [];

    if (this.mode == 'Editar') {
      title = this.recipe.title;
      description = this.recipe.description;
      difficulty = this.recipe.difficulty;
      for (let ingredient of this.recipe.ingredients) {
        ingredients.push(new FormControl(ingredient.name, Validators.required));
      }
    }

    this.recipeForm = new FormGroup({
      'title': new FormControl(title, Validators.required),
      'description': new FormControl(description, Validators.required),
      'difficulty': new FormControl(difficulty, Validators.required),
      'ingredients': new FormArray(ingredients)
    });
  }
}
