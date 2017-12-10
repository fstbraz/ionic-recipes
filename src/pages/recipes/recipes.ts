import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EditRecipePage } from '../edit-recipe/edit-recipe';
import { Recipe} from '../../models/recipe';
import { RecipesService } from '../../services/recipes';
import { RecipePage } from '../recipe/recipe';

@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html',
})
export class RecipesPage {
  recipes: Recipe[];

  constructor(private navCtrl: NavController, private recipesService: RecipesService){}

    ionViewWillEnter(){
      this.recipes = this.recipesService.getRecipes();
    }
  
    onNewRecipe(){
      this.navCtrl.push(EditRecipePage, {mode: 'Nova'});
    }

    onLoadRecipe(recipe: Recipe, index: number){
      this.navCtrl.push(RecipePage, {recipe: recipe, index: index});
    }

}
