import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared';
import { AchievementsCategoryListComponent } from './components/category-list/category-list.component';
import { AchievementsCategoryComponent } from './components/category/category.component';
import { AchievementsComponent } from './components/main/achievements.component';
import { AchievementsService } from './services/AchievementsService';


@NgModule({
    imports: [
        SharedModule
    ],
    exports: [
        AchievementsComponent,
        AchievementsCategoryComponent,
        AchievementsCategoryListComponent
    ],
    providers: [
        AchievementsService
    ],
    declarations: [
        AchievementsComponent,
        AchievementsCategoryComponent,
        AchievementsCategoryListComponent
    ]
})
export class AchievementsModule
{} 