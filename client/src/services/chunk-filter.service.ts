import { Injectable } from '@angular/core';
import { ChunkRoles } from '../models/chunk';

@Injectable({
  providedIn: 'root',
})
export class ChunkFilterService {
  roles: { role: ChunkRoles; isSelected: boolean }[] = [];

  constructor() {
    const keys = Object.keys(ChunkRoles) as ChunkRoles[];
    keys.forEach((key) => {
      this.roles.push({
        role: key,
        isSelected: true,
      });
    });
  }

  isSelected() {
    return this.roles.some((role) => !role.isSelected);
  }
}
