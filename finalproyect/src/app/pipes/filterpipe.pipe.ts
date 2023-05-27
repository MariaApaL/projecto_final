import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterpipe'
})
export class FilterpipePipe implements PipeTransform {
  transform(items: any[], searchText: string, filteredCategory: string, selectedOption: string): any[] {
    if (!items) {
      return [];
    }
  
    let filteredItems = items;
  
    // Filtrar por texto de búsqueda
    if (searchText) {
      searchText = searchText.toLowerCase();
      filteredItems = filteredItems.filter(item =>
        item.name.toLowerCase().includes(searchText) ||
        item.description.toLowerCase().includes(searchText)
      );
    }
  
    // Filtrar por categoría
    if (filteredCategory) {
      filteredItems = filteredItems.filter(item =>
        item.category === filteredCategory
      );
    }
  
    // Filtrar según la opción seleccionada
    if (selectedOption) {
      switch (selectedOption) {
        case 'mayor-menor-precio':
          filteredItems = filteredItems.sort((a, b) => b.price - a.price);
          break;
        case 'menor-mayor-precio':
          filteredItems = filteredItems.sort((a, b) => a.price - b.price);
          break;
        case 'fecha-lejana':
          filteredItems = filteredItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          break;
        case 'fecha-reciente':
          filteredItems = filteredItems.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          break;
        case 'numero-participantes':
          filteredItems = filteredItems.sort((a, b) => b.plazas.length - a.plazas.length);
          break;
      }
    }
  
    return filteredItems;
  }
}