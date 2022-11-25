import { Component, ChangeDetectionStrategy } from '@angular/core';
import type { FormArray } from '@angular/forms';
import { NavigationService, UiService } from '@appSource/services';
import { switchMap, map, shareReplay } from 'rxjs/operators';
import config from '../config.json';
import { makeForm } from '@axrl/ngx-extended-form-builder';
import type { DishTag } from '@webresto/ng-gql';

@Component( {
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: [ './products.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class ProductsComponent {

  constructor (
    private navigation: NavigationService,
    private ui: UiService
  ) {
  }

  trackByFn = this.ui.trackByFn;
  filterControl = makeForm( {} );
  config = config;

  selectGroup ( event: string, control: string ) {
    const formArray = <FormArray> this.filterControl.controls[ control ];
    const values: string[] = formArray.value;
    if ( values.includes( event ) ) {
      const index = values.findIndex( value => value == event );
      formArray.removeAt( index );
    } else {
      formArray.push( makeForm( event ) );
    };
  }

  getFilteredDishes ( group: IGroup ) {
    const groupSelectedTags: string[] = this.filterControl.value[ group.slug! ];
    return groupSelectedTags.length == 0 ? group.dishes : group.dishes?.filter(
      dish => dish.tags && (
        ( Array.isArray( dish.tags ) && dish.tags?.some( tag => groupSelectedTags.includes( tag.name ) ) ) ||
        ( 'name' in dish.tags && groupSelectedTags.includes( ( <DishTag> dish.tags ).name ) )
      )
    );
  }

  getChildGroupsWithDishes ( group: IGroup ): IGroup[] {
    return group.childGroups.filter( childGroup => childGroup.dishes && childGroup.dishes.length > 0 );
  }

  getGroupTags ( group: IGroup ): string[] {
    return group.dishes ? [ ...group.dishes.reduce(
      ( accumulator, dish ) => {
        if ( dish.tags ) {
          if ( Array.isArray( dish.tags ) ) {
            dish.tags?.forEach( tag => accumulator.add( tag.name ) );
          } else {
            if ( 'name' in dish.tags ) {
              accumulator.add( ( <DishTag> dish.tags ).name );
            };
          };
        }
        return accumulator;
      }, new Set<string>( [] )
    )
    ] : [];
  }

  dishes$ = this.ui.locationPathName$.pipe(
    switchMap(
      url => {
        const slug = url.replace( /\/menu\/|\/menu/, '' );
        return this.navigation.allMenu$.pipe(
          map(
            groups => {
              if ( url.includes( '#' ) ) {
                groups.forEach( group => this.filterControl.addControl( group.slug!, makeForm( [] ) ) );
                return groups;
              } else {
                const returnedGroups = groups.filter( group => group.slug == slug ).map(
                  group => {
                    group.childGroups = group.childGroups.filter( childGroup => childGroup.dishes && childGroup.dishes?.length > 0 );
                    return group;
                  } );
                returnedGroups.forEach( group => {
                  this.filterControl.addControl( group.slug!, makeForm( [] ) );
                  if ( group.childGroups && group.childGroups.length > 0 ) {
                    group.childGroups.forEach( childGroup => this.filterControl.addControl( childGroup.slug!, makeForm( [] ) ) );
                  };
                } );
                return returnedGroups;
              };
            } )
        );
      } ),
    shareReplay( 1 )
  );

  logEvent ( event: any ) {
    console.log( event );
  }

  showCartPanel$ = this.ui.viewport$.pipe(
    map( viewport => this.config.enableCartPanel && ( viewport.innerWidth > 1422 ) ),
    shareReplay( 1 )
  );

}
