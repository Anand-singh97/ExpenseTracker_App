import {Component, OnInit} from '@angular/core';
import {ICategories} from "../../model/model";
import {DALService} from "../services/dal.service";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {InputComponentComponent} from "../input-component/input-component.component";

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgClass,
    FormsModule,
    RouterLink,
    ReactiveFormsModule,
    InputComponentComponent
  ],
  templateUrl: './category-page.component.html',
  styleUrl: './category-page.component.css'
})
export class CategoryPageComponent implements OnInit
{
  categories: Array<ICategories> = [];
  categoriesCopy: Array<ICategories> = this.categories;
  newCategoryWindowActive: boolean = false;
  isIncomeSelected: boolean = true;
  isExpenseSelected: boolean = false;
  isAddACategoryActive: boolean = false;
  isEditACategoryActive: boolean = false;
  selectedCategory: ICategories | null | undefined;
  constructor(public dal: DALService) {}
  filterText: string = '';
  async ngOnInit()
  {
    try
    {
      await this.loadData();
    }
    catch(e)
    {
      console.log("Error getting all categories: ", e);
    }
  }

  async loadData(){
    this.categories = await this.dal.getAllCategories();
    this.categoriesCopy = this.categories;
  }
  title = new FormControl('',
    [Validators.required, Validators.maxLength(15)]);

  categoryForm = new FormGroup({
    name: this.title
  })

  async btn_hideCategory_Click(category: ICategories): Promise<void>
  {
    try
    {
      if(category)
      {
        category.isVisible = ! category.isVisible;
        await this.dal.updateCategory(category);
      }
    }
    catch(e)
    {
      console.log('Error hiding category')
    }
  }

  filterCategories(): void
  {
    this.categoriesCopy = this.categories.filter((item)=>{
      return item.name.toLowerCase().includes(this.filterText.toLowerCase());
    })
  }

  openNewCategoryWindow()
  {
    this.title.patchValue('');
    this.isAddACategoryActive = true;
    this.isEditACategoryActive = false;
    this.newCategoryWindowActive = !this.newCategoryWindowActive;
  }

  toggleSelectionInNewWindow(selection: string) {
    if(selection === 'income')
    {
      this.isIncomeSelected = true;
      this.isExpenseSelected = false;
    }
    else
    {
      this.isIncomeSelected = false;
      this.isExpenseSelected = true;
    }
  }

  async addNewCategory(): Promise<void>
  {
    try
    {
      let isCategoryUnique = true;
      if(this.isAddACategoryActive)
      {
        this.categories.forEach((item)=>{
          if(item.name.toLowerCase() === this.categoryForm.value.name?.toLowerCase() &&
            (this.isIncomeSelected && item.typeId === 1 || this.isExpenseSelected &&
              item.typeId === 2))
          {
            isCategoryUnique = false;
            alert('This Category name is already present');
          }
        })
      }
      else
      {
        this.categories.forEach((item)=>{
          if(item.name.toLowerCase() === this.categoryForm.value.name?.toLowerCase() &&
            item.typeId === this.selectedCategory?.typeId && item.id != this.selectedCategory.id)
          {
            isCategoryUnique = false;
            alert('This Category name is already present');
          }
        })
      }

      if(isCategoryUnique)
      {
        if(this.isAddACategoryActive)
        {
          const category: ICategories = {
            name: this.categoryForm.value.name!,
            typeId: this.isIncomeSelected ? 1 : 2,
            isVisible: true
          };
          await this.dal.addCategory(category);
        }
        else
        {
          const category: ICategories = {
            name: this.categoryForm.value.name!,
            typeId: this.selectedCategory?.typeId!,
            isVisible: this.selectedCategory?.isVisible!,
            id: this.selectedCategory?.id
          }
          await this.dal.updateCategory(category);
        }
      }
    }
    catch(e)
    {
      console.log('Error adding/updating Category', e)
    }
    await this.loadData();
    this.newCategoryWindowActive = false;
  }

  async btn_Edit_Click(id: number) : Promise<void>
  {
    this.isEditACategoryActive = true;
    this.isAddACategoryActive = false;
    this.selectedCategory = await this.dal.getCategory(id);
    this.title.patchValue(this.selectedCategory?.name!);
    this.newCategoryWindowActive = true;
  }
}
