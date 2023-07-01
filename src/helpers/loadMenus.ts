import { Collection } from 'discord.js';
import { UpdateRoles } from '../interactions/menus/updateRoles';
import { Menu } from '../interfaces/Commands';

export type MenuCollection = Collection<string, Menu>;

export default async function loadMenus(): Promise<MenuCollection> {
  const allMenus = [new UpdateRoles()];

  const menus = new Collection<string, Menu>();

  allMenus.forEach((menu) => {
    menus.set(menu.title, menu);
  });

  return menus;
}
